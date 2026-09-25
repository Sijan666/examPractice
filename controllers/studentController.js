const mongoose = require('mongoose')
const Student = require('../models/studentSchema')
const Course = require('../models/courseSchema')

// create student
const createStudent = async (req, res) => {
    try {
        const { name, email, phone, age, enrolledCourses } = req.body

        if (!name || !email || !phone || !age) {
            return res.status(400).json({
                success: false, 
                message: "Please fill all the required fields"
            })
        }

        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: 'Age must be at least 18 years old to create a student.'
            })
        }

        const existingStudent = await Student.findOne({ email })
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'A student with this email already exists'
            })
        }

        const newStudent = await new Student({
            name : name ,
            email :email,
            phone : phone,
            age : age,
            enrolledCourses: enrolledCourses || []
        }).save()

        res.status(201).json({
            success: true,
            message: 'Student successfully created',
            data: newStudent
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create student',
            error: error.message
        })
    }
}

// all student
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
        
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students',
            error: error.message
        })
    }
}

// single user
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid MongoDB ObjectId format'
            })
        }

        const student = await Student.findById(id).populate('enrolledCourses')
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            })
        }

        res.status(200).json({
            success: true,
            data: student
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student',
            error: error.message
        })
    }
}

// update student
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid MongoDB ObjectId format'
            })
        }

        if (req.body.age !== undefined && req.body.age < 18) {
            return res.status(400).json({ 
                success: false, 
                message: 'age must be at least 18' 
            })
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true})

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Student successfully updated',
            data: updatedStudent
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update student',
            error: error.message
        })
    }
}

// delete student
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid MongoDB ObjectId format'
            })
        }

        const student = await Student.findById(id)
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            })
        }

        if (student.enrolledCourses) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete student because they are enrolled in one course'
            })
        }

        await Student.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: 'Student successfully deleted'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete student',
            error: error.message
        })
    }
}


// enroll student
const enrollStudent = async (req, res) => {
    try {
        const { studentId , courseId } = req.params

        if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'invalid id' 
            })
        }

        const student = await Student.findById(studentId)
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: 'student not found' 
            })
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'course not found' 
            })
        }

        if (!course.isPublished) {
            return res.status(400).json({ 
                success: false, 
                message: 'course is not published' 
            })
        }

        // check duplicate enrollment
        if (student.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'already enrolled' 
            })
        }

        // add and save
        student.enrolledCourses.push(courseId)
        await student.save()

        return res.status(200).json({
            success: true,
            message: 'enrolled successfully',
            data: student
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}

module.exports = {createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent , enrollStudent}