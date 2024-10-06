import express from 'express'
import router from './route'

const app = express()

app.use(router)

app.listen(8000, () => console.log('Listening on port 8000'))