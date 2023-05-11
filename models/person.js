require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

console.log('connecting to', url)
mongoose
  .connect(url)
  .then((_result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /\d{2}-\d{2}-\d{4,}|\d{3}-\d{5,}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
})
personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('Person', personSchema)
