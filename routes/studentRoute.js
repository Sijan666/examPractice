const express = require('express')
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, enrollStudent } = require('../controllers/studentController')
const router = express.Router()

router.post('/createstudent',createStudent)
router.get('/allstudent',getAllStudents)
router.get('/singlestudent/:id',getStudentById)
router.patch('/updatestudent/:id',updateStudent)
router.delete('/deletestudent/:id',deleteStudent)
router.post('/:studentId/enroll/:courseId', enrollStudent)


module.exports = router