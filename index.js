const express = require('express')
const app = express()


app.use(express.json())



let port = 5000
app.listen(port , ()=>{
    console.log(`Server is running on ${port}`);
})