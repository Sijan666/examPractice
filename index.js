const express = require('express')
const app = express()
const studentRoute = require('./routes/studentRoute')

app.use(express.json())

app.use('/api/v1/students',studentRoute)


let port = 5000
app.listen(port , ()=>{
    console.log(`Server is running on ${port}`);
})