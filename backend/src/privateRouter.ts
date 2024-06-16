import { Router } from 'express'
import {
    signout
} from './handlers/authentification'

const privateRouter = Router()

// Authentification routes

privateRouter.post('/signout', signout);

// Picture routes

// Sticker routes

// User routes

// Comment routes

export default privateRouter