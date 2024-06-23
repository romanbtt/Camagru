import { Router } from 'express'
import { check } from 'express-validator';
import {
    signout,
    authentificate
} from './handlers/authentification'
import { createPicture } from './handlers/picture'
import uploadPicture from './utils/upload';


const privateRouter = Router()

// Authentification routes

privateRouter.post('/signout', signout);
privateRouter.get('/authentificate', authentificate);

// Picture routes

privateRouter.post('/picture', [
    check('picture').not().isEmpty(),
    check('stickerId').not().isEmpty(),
    check('posX').not().isEmpty(),
    check('posY').not().isEmpty(),
    check('zoom').not().isEmpty()
], uploadPicture, createPicture)

// Sticker routes

// User routes

// Comment routes

export default privateRouter;
