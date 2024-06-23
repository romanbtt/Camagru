import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import privateRouter from './privateRouter'
import publicRouter from './publicRouter'
import { authenticateToken } from './modules/authentification'
import { populateStickers } from './scripts/populateStickers'

const app = express()

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))
app.use(cookieParser())

app.use('/api/private', authenticateToken, privateRouter)
app.use('/api/public', publicRouter)
app.use('/stickers', express.static('stickers'))

populateStickers();

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error', error: err })
})


export default app
