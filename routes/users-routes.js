const express = require('express')
const {check} = require('express-validator')
const router = express.Router()

const UsersControllers = require('../controllers/users-controllers')
const fileUpload = require('../middleware/file-upload')

router.get('/', UsersControllers.getUsers)
router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email')
      .normalizeEmail() //Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({min: 6}),
  ],
  UsersControllers.signup
)
router.post('/login', UsersControllers.login)

module.exports = router
