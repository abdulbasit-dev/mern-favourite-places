const express = require("express")
const router = express.Router()

const HttpError = require("../models/http-error")


const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

//next() for asynconouns
//throw error for secronouns
router.get("/:pid",(req,res,next)=>{
  const placeId = req.params.pid
  //the req.params.:id is express functinality 
  const place = DUMMY_PLACES.find(place => place.id===placeId )
  if(!place){
    throw new HttpError("Could not find place for the provided id." , 404) 
  }
  res.json({place})
})

router.get("/user/:uid" , (req,res,next)=>{
  const userId = req.params.uid 
  const place = DUMMY_PLACES.find(place=>place.creator===userId)
  if(!place){
    return next(new HttpError("Could not find place for the provided user id." , 404))
  }
  res.json({place}) 
})





module.exports = router