const mongoose = require('mongoose')
const Course = require('../models/courseSchema')
const Student = require('../models/studentSchema')

// create course
const createCourse = async (req, res) => {
    try {
        const { title, description, price, category, durationInMonths, isPublished } = req.body

        if (!title || !price || !category || !durationInMonths) {
            return res.status(400).json({
                success: false,
                message: "please fill all the required fields"
            })
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'price must be greater than 0'
            })
        }

        if (durationInMonths < 1) {
            return res.status(400).json({
                success: false,
                message: 'duration must be at least 1 month'
            })
        }

        const existingCourse = await Course.findOne({ title, category })
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: 'a course with this exact title and category already exists'
            })
        }

        const newCourse = await new Course({
            title,
            description,
            price,
            category,
            durationInMonths,
            isPublished
        }).save()

        res.status(201).json({
            success: true,
            message: 'course successfully created',
            data: newCourse
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to create course',
            error: error.message
        })
    }
}

const allcourse = async (req,res) => {
    const allcourse = await Course.find({})
    res.status(200).json({
        success: true,
        count: allcourse.length,
        data: allcourse
    })
}

const singlecourse = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid MongoDB ObjectId format'
        })
    }

    const course = await Course.findById(id)
    if (!course) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        })
    }
}


// update course
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params
        const { title, category, price, durationInMonths } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid MongoDB ObjectId format'
            })
        }

        if (!title || !category || !price || !durationInMonths) {
            return res.status(400).json({
                success: false,
                message: "please fill all the required fields"
            })
        }

        if (price <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Price must be greater than 0' 
            })
        }

        if (durationInMonths < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Duration must be at least 1 month' 
            })
        }

        const existingCourse = await Course.findOne({ title, category })
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: 'a course with this exact title and category already exists'
            })
        }

        const updateCourse = await Course.findByIdAndUpdate(id, req.body, { new: true })
        
        if (!updateCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Update successful',
            data: updateCourse
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update course',
            error: error.message
        })
    }
}


// delete course
const deleteCourse = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid MongoDB ObjectId format'
        })
    }

    const deleteCourse = await Course.findByIdAndDelete(id)
    res.status(200).json({
        success : true,
        message : "course deleted"
    })
}


// all enrolled students for a course
const getCourseStudents = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'invalid id' 
            })
        }

        const course = await Course.findById(id)
        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'course not found' 
            })
        }

        const students = await Student.find({ enrolledCourses: id })

        return res.status(200).json({
            success: true,
            message: 'students fetched successfully',
            count: students.length,
            data: students
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        })
    }
}

module.exports = { createCourse ,allcourse , singlecourse , updateCourse ,deleteCourse,getCourseStudents}