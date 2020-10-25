const express = require("express")
const router = express.Router()

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

router.get("/user/:uid" , (req,res)=>{
  const userId = req.params.uid 
  const place = DUMMY_PLACES.find(place=>place.creator===userId)
  res.json({place}) 
})


router.get("/:pid",(req,res)=>{
  const placeId = req.params.pid
  //the req.params.:id is express functinality 
  const place = DUMMY_PLACES.find(place => place.id===placeId )
  res.json({place})
})




module.exports = router