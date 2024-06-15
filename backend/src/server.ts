import express from 'express'
import cors from 'cors'
import privateRouter from './privateRouter'
import publicRouter from './publicRouter'
import { authenticateToken } from './modules/auth'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/private', authenticateToken, privateRouter)
app.use('/api/public', publicRouter)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error', error: err })
})


export default app
