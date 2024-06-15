import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const comparePasswords = (password, hash) => {
    return bcrypt.compare(password, hash)
}

export const hashPassword = (password) => {
    return bcrypt.hash(password, 5)
}

export const createJWT = (user, expiresIn) => {
    const token = jwt.sign({
        id: user.id,
        username: user.username
    },
        process.env.JWT_SECRET,
        { expiresIn }
    )
    return token
}

export const authenticateToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;

    if (!authToken && !refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const [, foundAuthToken] = authToken.split(' ');
    const [, foundRefreshToken] = refreshToken.split(' ');

    if (!foundRefreshToken || !foundAuthToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = jwt.verify(foundAuthToken, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (_) {
        try {
            const user = jwt.verify(foundRefreshToken, process.env.JWT_SECRET);
            req.user = user;

            const token = createJWT(user, '1h');
            res.json({ token });

            next();
        } catch (_) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
    }
}
