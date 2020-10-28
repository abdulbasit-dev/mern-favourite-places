const {validationResult} = require('express-validator')
const mongoose = require('mongoose')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')
const User = require('../models/User')
const {findById} = require('../models/User')
const {Mongoose} = require('mongoose')

//next() for asynconouns
//throw error for secronouns
const getPlaceById = async (req, res, next) => {
  //the req.params.:id is express functinality
  const placeId = req.params.pid
  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    return next(new HttpError('Somting went wrong, could not find place', 500))
  }

  if (!place) {
    return next(new HttpError('Could not find place for the provided id.', 404))
  }

  res.json({place: place.toObject({getters: true})})
}

//findById return object
//but find() retrun array of object
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid
  let places
  try {
    //one way
    // places = await Place.find({creator: userId})
    // onther way
    places = await User.findById(userId).populate('places')
  } catch (err) {
    return next(new HttpError('Fetching places failed, please try again later'))
  }

  if (!places || places.places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404))
  }
  res.json({places: places.places.map(place => place.toObject({getters: true}))})
}

//Create place
const createPlace = async (req, res, next) => {
  const {title, description, address, creator} = req.body
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(new HttpError('invalid input passsed, please check your data'))
  }

  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator,
  })

  //first check if we have the user id in the database
  let user
  try {
    user = await User.findById(creator)
  } catch (err) {
    return next(new HttpError('Creating place failed, please try agian, not finde user  ', 500))
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id ', 404))
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdPlace.save({session: sess})
    user.places.push(createdPlace)
    await user.save({session: sess})
    await sess.commitTransaction()
  } catch (err) {
    return next(new HttpError('Creating place failed, please try agian', 500))
  }

  //201 created succssefully
  res.status(201).json({place: createdPlace})
}

//Delete place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid

  //1 find the  place
  let place
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (err) {
    return next(new HttpError('Somting went wrong, could not delete place', 500))
  }

  //if we dont have a place with id
  if (!place) {
    return next(new HttpError('Could not find a place for this id ', 404))
  }

  // 2 then delete the place
  try {
    const sess = mongoose.startSession()
    sess.startTransaction()
    //first remove the place in the place collection
    await place.remove({session: sess})
    //then also remove this place in user docuement
    place.creator.places.pull(place)
    await place.creator.save({session: sess})
    await sess.commitTransaction()
  } catch (err) {
    return next(new HttpError('Somting went wrong, could not delete place', 500))
  }

  res.status(200).json({message: 'Place Deleted', place})
}

//Update place
const updatePlace = async (req, res, next) => {
  const placeId = req.params.pid
  const {title, description} = req.body
  const error = validationResult(req)
  if (!error.isEmpty()) {
    return next(HttpError('invalid input passsed, please check your data', 421))
  }

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    return next(new HttpError('Somting went wrong, could not update  place', 500))
  }

  if (!place) {
    return next(new HttpError('Could not find place for the provided id.', 404))
  }

  place.title = title
  place.description = description

  try {
    await place.save()
  } catch (err) {
    return next(new HttpError('Could not find place for the provided id.', 500))
  }

  res.json({place: place.toObject({getters: true})})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.deletePlace = deletePlace
exports.updatePlace = updatePlace
