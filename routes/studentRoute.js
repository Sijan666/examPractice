const express = require('express')
const router = express.Router()

router.post('/students')
router.get('/students')
router.get('/students/:id')
router.patch('/students/:id')
router.delete('/students/:id')

module.exports = router