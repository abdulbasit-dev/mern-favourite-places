const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: Number, required: true},
  },
  {timestamps: true}
)
//create model
const User = mongoose.model('User', userSchema)

module.exports = User
