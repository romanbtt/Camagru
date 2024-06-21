import prisma from '../db'
import crypto from "crypto";
import { validationResult } from 'express-validator'
import { comparePasswords, createJWT, hashPassword } from '../modules/authentification'
import { sendEmail } from '../utils/email'
import exp from 'constants';

export const signin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { usernameOrEmail } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail }
                ]
            }
        })

        if (!user) {
            return res.status(401).json({ message: 'User not found or incorrect password.' })
        }

        const isValid = await comparePasswords(req.body.password, user.password)

        if (!isValid) {
            return res.status(401).json({ message: 'User not found or incorrect password.' })
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please check your email to verify your account.' })
        }

        const authToken = createJWT(user, '1h')
        const authTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const refreshToken = createJWT(user, '1d')
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        res.json({ authToken, authTokenExpiresAt })
    } catch (error) {
        next(error)
    }
}

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { username, email, password } = req.body

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        })

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already exists.' })
            } else {
                return res.status(400).json({ message: 'Email already exists.' })
            }
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        const token = await prisma.token.create({
            data: {
                userId: user.id,
                token: crypto.randomBytes(32).toString('hex')
            }
        })

        const link = `${process.env.FE_URL}/verify-email.html?token=${token.token}`
        await sendEmail(user.email, user.username, 'Verify Your Account', link)

        res.status(201).json({ message: 'Account created. Please check your email to verify your account.' })
    } catch (error) {
        next(error)
    }
}

export const verifyEmail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { token } = req.params;

        const foundToken = await prisma.token.findFirst({
            where: {
                token
            }
        })

        if (!foundToken) {
            return res.status(404).json({ message: 'Invalid verification link' })
        }

        await prisma.user.update({
            where: {
                id: foundToken.userId
            },
            data: {
                isVerified: true
            }
        })

        await prisma.token.delete({
            where: {
                token
            }
        })

        res.json({ message: 'Email verified successfully.' })
    } catch (error) {
        next(error)
    }
}

export const requestResetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        })

        if (!user) {
            return res.json({ message: 'Email sent! Check your inbox for password reset instructions.' })
        }

        let token = await prisma.token.findFirst({
            where: {
                userId: user.id
            }
        })

        if (!token) {
            token = await prisma.token.create({
                data: {
                    userId: user.id,
                    token: crypto.randomBytes(32).toString('hex')
                }
            })
        }

        const link = `${process.env.FE_URL}/reset-password.html?token=${token.token}`
        await sendEmail(user.email, user.username, 'Password reset', link)

        return res.json({ message: 'Email sent! Check your inbox for password reset instructions.' })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { token, password } = req.body;

        const foundToken = await prisma.token.findFirst({
            where: {
                token
            }
        })

        if (!foundToken) {
            return res.status(400).json({ message: 'Invalid token. Please request a new password reset link and try again.' })
        }

        const hashedPassword = await hashPassword(password)

        await prisma.user.update({
            where: {
                id: foundToken.userId
            },
            data: {
                password: hashedPassword,
                isVerified: true
            }
        })

        await prisma.token.delete({
            where: {
                token: token
            }
        })

        res.json({ message: 'Password reset successfully.' })

    } catch (error) {
        next(error)
    }
}


export const signout = async (req, res, next) => {
    res.clearCookie('refreshToken')
    res.json({ message: 'Sign out successfully.' })
}

export const authentificate = async (req, res, next) => {
    res.json({ message: 'Authentificate successfully.' })
}
