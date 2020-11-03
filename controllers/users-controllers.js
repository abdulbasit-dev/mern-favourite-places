const {validationResult} = require('express-validator')
const {v4} = require('uuid')
const HttpError = require('../models/http-error')
const User = require('../models/User')

const getUsers = async (req, res, next) => {
  let users
  try {
    //both only return email and password
    users = await User.find({}, '-password')
    // users = await User.find({},'name email')
  } catch (err) {
    return next(new HttpError('Fetching users failed, please try gain later ', 500))
  }

  res.json({users: users.map(user => user.toObject({getters: true}))})
}

//Create user
const signup = async (req, res, next) => {
  const {name, password, email} = req.body
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(new HttpError('invalid input passsed, please check your data ', 422))
  }

  let existingUser
  try {
    //finde one dec based on the condition
    existingUser = await User.findOne({email: email})
  } catch (err) {
    return next(new HttpError('Signing ip failed, please try again later', 500))
  }

  if (existingUser) {
    return next(new HttpError('User already exist, please login insted', 422))
  }

  let createdUser = new User({
    name,
    password,
    email,
    image: req.file.path,
    places: [],
  })

  try {
    await createdUser.save()
  } catch (err) {
    return next(new HttpError('Signing up failed, Please try again', 500))
  }

  res.status(201).json({user: createdUser.toObject({getters: true})})
}

//Login
const login = async (req, res, next) => {
  const {email, password} = req.body

  let existingUser
  try {
    //finde one dec based on the condition
    existingUser = await User.findOne({email: email})
  } catch (err) {
    return next(new HttpError('Signing in failed, please try again later', 500))
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError('invalid email or password, please try again ', 401))
  }

  res.json({message: 'logged in', user: existingUser.toObject({getters: true})})
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
