const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    return next(new HttpError('Signing up failed, please try again later', 500))
  }

  if (existingUser) {
    return next(new HttpError('User already exist, please login insted', 422))
  }

  let hashedPassowrd
  try {
    hashedPassowrd = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(new HttpError('Could not create user, please try again', 500))
  }

  const createdUser = new User({
    name,
    password: hashedPassowrd,
    email,
    image: req.file.path,
    places: [],
  })

  try {
    await createdUser.save()
  } catch (err) {
    return next(new HttpError('Signing up failed, Please try again', 500))
  }

  //generate token with jwt
  let token
  try {
    token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_KEY, {
      expiresIn: '1h',
    })
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later', 500))
  }

  res.status(201).json({userId: createdUser.id, email: createdUser.email, token})
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

  //403 not authentecate
  if (!existingUser) {
    return next(new HttpError('invalid email or password, please try again ', 403))
  }

  //check for password
  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    return next(
      new HttpError('could not log you in, invalid password or email please try again'),
      500
    )
  }

  if (!isValidPassword) {
    return next(new HttpError('invalid email or password, please try again ', 401))
  }

  //generate token with jwt
  let token
  try {
    token = jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.JWT_KEY, {
      expiresIn: '1h',
    })
  } catch (err) {
    return next(new HttpError('loffing in ip failed, please try again later', 500))
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
