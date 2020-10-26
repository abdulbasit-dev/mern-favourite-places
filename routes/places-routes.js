const express = require('express')
const router = express.Router()

const PlacesControllers = require('../controllers/places-controllers')

router.get('/:pid', PlacesControllers.getPlaceById)
router.get('/user/:uid', PlacesControllers.getPlacesByUserId)
router.post('/:pid', PlacesControllers.createPlace)
router.delete('/:pid', PlacesControllers.deletePlace)
router.patch('/:pid', PlacesControllers.updatePlace)

module.exports = router
