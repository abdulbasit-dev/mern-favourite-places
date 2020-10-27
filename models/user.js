const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

//create schema
const userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    image: {type: String, required: true},
    places: {type: String, required: true},
  },
  {timestamps: true}
)

//prevent dublicated email
userSchema.plugin(uniqueValidator)

//create model
const User = mongoose.model('User', userSchema)

module.exports = User
