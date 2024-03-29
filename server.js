const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const colors = require("colors")

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

//express app
const app = express()
const port = process.env.PORT || 5000
app.use(express.static(path.resolve(__dirname, './client/build')));

//middlewares
//to convert data to json
app.use(express.json())
app.use(morgan("dev"))

//connect to mongoDb
mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once('open',()=>{
  //listen
  app.listen(port, () => console.log(`server is running on port ${port}`.red))
})
mongoose.connection.on("error",(err)=>{
  console.log(err);
})

//CORS hnadler
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

  next()
})

//this middleware make /uploads/images (images) accessabel from outside
app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use('/api/users', usersRoutes)
app.use('/api/places', placesRoutes)

//unspportes route handling like (http://localhost:5000/api/u2)
app.use((req, res, next) => {
  const error = new HttpError('could not find this route.', 404)
  return next(error)
})

//if we have any error in above middlware the below middleware function run
//ERROR HANDLING MIDLLEWARE FUNCTION
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err)
    })
  }
  //we check if a response has aleardy sent or not
  if (res.headersSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred'})
})
