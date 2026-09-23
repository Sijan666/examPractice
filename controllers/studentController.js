const Student = require('../models/studentSchema')

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
                message: 'A student with this email already exists!'
            })
        }

        const newStudent = new Student({
            name,
            email,
            phone,
            age,
            enrolledCourses: enrolledCourses || []
        })

        const savedStudent = await newStudent.save()

        res.status(201).json({
            success: true,
            message: 'Student successfully created',
            data: savedStudent
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
        const students = await Student.find().populate('enrolledCourses')
        
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
                message: 'Invalid MongoDB ObjectId format!'
            })
        }

        const student = await Student.findById(id).populate('enrolledCourses')
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found!'
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
                message: 'Invalid MongoDB ObjectId format!'
            })
        }

        const { age, email, ...updateData } = req.body

        if (age !== undefined) {
            if (age < 18) {
                return res.status(400).json({
                    success: false,
                    message: 'Age must be at least 18 years old.'
                })
            }
            updateData.age = age
        }

        if (email) {
            const existingEmail = await Student.findOne({ email, _id: { $ne: id } })
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already used by another student!'
                })
            }
            updateData.email = email
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { 
            new: true, 
            runValidators: true 
        }).populate('enrolledCourses')

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Student successfully updated!',
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
                message: 'Invalid MongoDB ObjectId format!'
            })
        }

        const student = await Student.findById(id)
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found!'
            })
        }

        if (student.enrolledCourses && student.enrolledCourses.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete student because they are enrolled in one or more courses!'
            })
        }

        await Student.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: 'Student successfully deleted!'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete student',
            error: error.message
        })
    }
}

module.exports = {createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent}