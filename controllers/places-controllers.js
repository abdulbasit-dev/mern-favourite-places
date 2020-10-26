const {v4} = require('uuid')
const {validationResult} = require('express-validator')

const HttpError = require('../models/http-error')

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
const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid
  //the req.params.:id is express functinality
  const place = DUMMY_PLACES.find(place => place.id === placeId)
  if (!place) {
    throw new HttpError('Could not find place for the provided id.', 404)
  }
  res.json({place})
}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid
  const places = DUMMY_PLACES.filter(place => place.creator === userId)
  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404))
  }
  res.json({places})
}

const createPlace = (req, res, next) => {
  const {title, description, address, creator, coordinates} = req.body
  const error = validationResult(req)
  if (!error.isEmpty()) {
    throw new HttpError('invalid input passsed, please check your data')
  }

  const createdPlace = {
    id: v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  }
  DUMMY_PLACES.unshift(createdPlace)
  //201 created succssefully
  res.status(201).json({place: createdPlace})
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  if (!DUMMY_PLACES.find(place => place.id === placeId)) {
    throw new HttpError('Could not find a place for that id', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId)
  res.status(200).json({message: 'Place Deleted'})
}

const updatePlace = (req, res, next) => {
  const placeId = req.params.pid
  const {title, description} = req.body
  const error = validationResult(req)
  if (!error.isEmpty()) {
    throw new HttpError('invalid input passsed, please check your data')
  }

  //find the current place and overwrite title and description
  const updatedPlace = {...DUMMY_PLACES.find(place => place.id === placeId), title, description}
  //find index of place that we wont to be updated
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)
  //replace the old place with updatedPlace
  DUMMY_PLACES[placeIndex] = updatedPlace
  res.json({places: DUMMY_PLACES})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.deletePlace = deletePlace
exports.updatePlace = updatePlace
