import prisma from '../db'
import crypto from "crypto";
import { validationResult } from 'express-validator'
import { comparePasswords, createJWT, hashPassword } from '../modules/auth'
import { sendEmail } from '../utils/email'

export const signin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: req.body.username },
                    { email: req.body.email }
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

        const token = createJWT(user, '1h')
        const refreshToken = createJWT(user, '1d')
        res.json({ token, refreshToken })
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

        const link = `${process.env.BASE_URL}/verify-email/${user.id}/${token.token}`
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
        const { userId, token } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({ message: 'Invalid verification link' })
        }

        const foundToken = await prisma.token.findFirst({
            where: {
                userId: user.id,
                token
            }
        })

        if (!foundToken) {
            return res.status(404).json({ message: 'Invalid verification link' })
        }

        await prisma.user.update({
            where: {
                id: user.id
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
            return res.status(404).json({ message: 'Account not found' })
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

        const link = `${process.env.BASE_URL}/reset-password/${token.token}`
        await sendEmail(user.email, user.username, 'Password reset', link)

        res.json({ message: 'Email sent successfully' })
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
            return res.status(400).json({ message: 'Invalid reset password link' })
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

        res.send(`
            <html>
                <body>
                    <h1>Password reset successfully.</h1>
                </body>
            </html>
        `);
    } catch (error) {
        next(error)
    }
}
