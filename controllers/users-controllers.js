const {validationResult} = require('express-validator')
const {v4} = require('uuid')
const HttpError = require('../models/http-error')
const User = require('../models/User')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
]

const getUsers = (req, res, next) => {
  res.json({users: DUMMY_USERS})
}

//Create user
const signup = async (req, res, next) => {
  const {name, password, email} = req.body
  const errpr = validationResult(req)
  if (!errpr.isEmpty()) {
    return next(new HttpError('invalid input passsed, please check your data ', 422))
  }

  // const hasUser = DUMMY_USERS.find(user => user.email === email)
  // if (hasUser) {
  //   //422 user input error
  //   throw new HttpError('Could not create user, email already exist', 422)
  // }

  let createdUser = new User({
    name,
    password,
    email,
  })

  try {
    await createdUser.save()
  } catch (err) {
    return next(new HttpError('sds', 500))
  }

  res.status(201).json({user: createdUser})
}

const login = (req, res, next) => {
  const {email, password} = req.body
  const identifiedUser = DUMMY_USERS.find(user => user.email === email)

  if (!identifiedUser || identifiedUser.password !== password) {
    //401 authentication error
    throw new HttpError('Could not identify user, credential seems to be wrong', 401)
  }

  res.json({message: 'logged in'})
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
