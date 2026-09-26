const express = require('express')
const { createCourse, updateCourse, allcourse, singlecourse, deleteCourse, courseStudent } = require('../controllers/courseController')
const router = express.Router()

router.post('/createcourse',createCourse)
router.get('/allcourse',allcourse)
router.get('/singlecourse/:id',singlecourse)
router.patch('/updatecourse/:id',updateCourse)
router.delete('/deletecourse/:id',deleteCourse)
router.get('/:id/students', courseStudent)

module.exports = router