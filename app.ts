import express from 'express'
import cors from "cors"
import locationRoutes from './routes/location'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/location', locationRoutes)

export default app