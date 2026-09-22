const mongoose = require('mongoose')
const {Schema} = mongoose

const studentSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    isActive : {
        type : Boolean,
        default : true
    },
    enrolledCourses : {
        type : String,
        enum : ['Full-Stack Development' , 'Front-End Development' , 'Backend Development']
    }
})


module.exports = mongoose.model('Student' , studentSchema)