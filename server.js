const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

//express app
const app = express()
const port = process.env.PORT || 5000

//middlewares
//to convert data to json
//1
// app.use(bodyParser.json())
//2
app.use(express.json())

//listen
app.listen(port, () => console.log(`server is running on port ${port}`))

//Routes
app.use("/api/places",placesRoutes)
app.use("/api/users",usersRoutes)

//unspportes route handling like (http://localhost:5000/api/u2)
app.use((req,res,next)=>{
  const error = new HttpError("could not find this route." , 404)
  return next(error)
})

//if we have any error in above middlware the below middleware function run
//ERROR HANDLING MIDLLEWARE FUNCTION
app.use((error,req,res,next)=>{
  //we check if a response has aleardy sent or not
  if(res.headersSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({message:error.message || "An unknown error occurred"})
})
