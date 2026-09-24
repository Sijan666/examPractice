const express = require('express')
const { createCourse, getCourseById, updateCourse, deleteCourse, allcourse, singlecourse } = require('../controllers/courseController')
const router = express.Router()

router.post('/createcourse',createCourse)
router.get('/allcourse',allcourse)
router.get('/singlecourse/:id',singlecourse)
router.patch('/updatecourse/:id',updateCourse)
// router.delete('/deletecourse/:id',deleteCourse)

module.exports = router