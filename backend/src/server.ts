import express from 'express'
import cors from 'cors'
import protectedRouter from './protectedRouter'
import unprotectedRouter from './unprotectedRouter'
import { authenticateToken } from './modules/auth'


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/secure', authenticateToken, protectedRouter)
app.use('/api/public', unprotectedRouter)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error', error: err })
})


export default app
