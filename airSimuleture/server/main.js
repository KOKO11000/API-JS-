import { config } from 'dotenv'
import express, { json } from 'express'
import cors from 'cors'
// import { json } from 'sequelize'
config()
const app = express()
const port = process.env.PORT || 3001
app.use(json())
app.use(cors())

async function start() {
    app.listen(port,()=>{
        console.log(`🚀 server run on http:lochalhost:${port}`)
    })
}
start()