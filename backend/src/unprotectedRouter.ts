import { Router } from 'express'
import { check } from 'express-validator';
import {
    signin,
    signup,
    verifyEmail,
    requestResetPassword,
    resetPassword
} from './handlers/auth'

const router = Router()

// Auth Routes

router.post('/signin', [
    check('username').not().isEmpty(),
    check('password').not().isEmpty(),
], signin);

router.post('/signup', [
    check('username').not().isEmpty(),
    check('email').not().isEmpty(),
    check('password').not().isEmpty(),
], signup);

router.get('/verify-email', [
    check('userId').not().isEmpty(),
    check('token').not().isEmpty()
], verifyEmail);

router.post('/request-reset-password', [
    check('email').not().isEmpty()
], requestResetPassword);

router.post('/reset-password', [
    check('token').not().isEmpty(),
    check('password').not().isEmpty()
], resetPassword);


const unprotectedRouter = router;
export default unprotectedRouter;
