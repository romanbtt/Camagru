import { Router } from 'express'
import { check } from 'express-validator';
import {
    signin,
    signup,
    verifyEmail,
    requestResetPassword,
    resetPassword
} from './handlers/authentification'

const publicRouter = Router()

// Authentification routes

publicRouter.post('/signin', [
    check('usernameOrEmail').not().isEmpty(),
    check('password').not().isEmpty(),
], signin);

publicRouter.post('/signup', [
    check('username').not().isEmpty(),
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
], signup);

publicRouter.get('/verify-email', [
    check('userId').not().isEmpty(),
    check('token').not().isEmpty()
], verifyEmail);

publicRouter.post('/request-reset-password', [
    check('email').not().isEmpty()
], requestResetPassword);

publicRouter.post('/reset-password', [
    check('token').not().isEmpty(),
    check('password').not().isEmpty()
], resetPassword);

// Picture routes

// Sticker routes

// User routes

// Comment routes

export default publicRouter;
