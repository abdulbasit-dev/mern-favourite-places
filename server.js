const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')

//express app
const app = express()
const port = process.env.PORT || 5000

//middlewares
// app.use(bodyParser())

//listen
app.listen(port, () => console.log(`server is running on port ${port}`))

//Routes
app.use("/api/places",placesRoutes)
app.use("/api/users",usersRoutes)

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
