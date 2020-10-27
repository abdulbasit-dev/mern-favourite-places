const {v4} = require('uuid')
const {validationResult} = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/Place')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
  {
    id: 'p3',
    title: 'shandar cave',
    description: 'One of the most famous cave',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
]

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
    places = await Place.find()
    places = places.filter(place => place.creator === userId)
  } catch (err) {
    return next(new HttpError('Fetching places failed, please try again later'))
  }

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404))
  }
  res.json({places: places.map(place => place.toObject({getters: true}))})
}

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

  try {
    await createdPlace.save()
  } catch (err) {
    return next(new HttpError('Creating place failed, please try agian', 500))
  }

  //201 created succssefully
  res.status(201).json({place: createdPlace})
}

//Delete plaec
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid

  //1 finde place
  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    return next(new HttpError('Somting went wrong, could not delete place', 500))
  }

  //2 then delete the place
  try {
    await place.remove()
  } catch (err) {
    return next(new HttpError('Somting went wrong, could not delete place', 500))
  }

  res.status(200).json({message: 'Place Deleted'})
}

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
