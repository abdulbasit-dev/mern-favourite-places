const express = require('express')
const {check} = require('express-validator')

const router = express.Router()

const PlacesControllers = require('../controllers/places-controllers')
const fileUpload = require('../middleware/file-upload')

router.get('/:pid', PlacesControllers.getPlaceById)
router.get('/user/:uid', PlacesControllers.getPlacesByUserId)
router.post(
  '/',
  fileUpload.single('image'),
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
