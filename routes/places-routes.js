const express = require('express')
const {check} = require('express-validator')
const router = express.Router()

const PlacesControllers = require('../controllers/places-controllers')

router.get('/:pid', PlacesControllers.getPlaceById)
router.get('/user/:uid', PlacesControllers.getPlacesByUserId)
router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty(),
  ],
  PlacesControllers.createPlace
)
router.delete('/:pid', PlacesControllers.deletePlace)
router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({min: 5})],
  PlacesControllers.updatePlace
)

module.exports = router
