require("dotenv").config()
const express = require('express')
const app = express()
const studentRoute = require('./routes/studentRoute')
const courseRoute = require('./routes/courseRoute')
const mongoDb = require('./config/mongoDb')

app.use(express.json())

mongoDb()

app.use('/api/v1/students',studentRoute)
app.use('/api/v1/courses',courseRoute)

let port = process.env.port || 5000
app.listen(port , ()=>{
    console.log(`Server is running on ${port}`);
})