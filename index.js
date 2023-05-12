require('dotenv').config()
const { v4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
const middleware = require('./utils/middleware')
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

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

morgan.token('type', function (req, _res) {
  if (req.method === 'POST') return JSON.stringify(req.body)
})

const Person = require('./models/person')
const User = require('./models/user')

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.get('/health', (_req, res) => {
  res.send('ok')
})

app.get('/api/persons', (_req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing',
    })
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: v4(),
  })
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.post('/api/login', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET
    //,{ expiresIn: 60*60 } // expires in one hour
  )

  response.status(200).send({ token, username: user.username, name: user.name })
})

app.get('/api/users', async (_request, response) => {
  const users = await User.find({}).populate('people', {
    name: 1,
    number: 1,
  })
  response.json(users)
})

app.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body
  const existingUser = await User.findOne({ username })

  if (!username || !name || !password)
    response.status(400).json({ error: 'Please set all fields' })
  else if (existingUser) {
    return response.status(400).json({ error: 'username is not available' })
  } else if (username.length < 3)
    response.status(400).json({ error: 'Username too short' })
  else if (password.length < 8) response.status(400).json({ error: 'Password too short' })
  else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }
})

console.log(process.env.NODE_ENV)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler) //keep last

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
