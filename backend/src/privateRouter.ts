import { Router } from 'express'
import {
    signout,
    authentificate
} from './handlers/authentification'

const privateRouter = Router()

// Authentification routes

privateRouter.post('/signout', signout);
privateRouter.get('/authentificate', authentificate);

// Picture routes

// Sticker routes

// User routes

// Comment routes

export default privateRouter