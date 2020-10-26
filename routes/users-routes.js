const express = require('express')
const router = express.Router()

const UsersControllers = require('../controllers/users-controllers')

router.get('/', UsersControllers.getUsers)
router.post('/signup', UsersControllers.signup)
router.post('/login', UsersControllers.login)

module.exports = router
