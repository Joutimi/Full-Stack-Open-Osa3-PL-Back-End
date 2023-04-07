const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const morgan = require('morgan')

const Person = require('./models/person')
app.use(express.json())

morgan.token('reqBody', (request) => JSON.stringify(request.body))

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] :response-time ms :reqBody'))
app.use(express.static('build'))

//Errorhandler
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error : 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error : error.message })
  }

  next(error)
}

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


// Kutsu juureen tulostaa "Hello World" jos build ei jostain syystä toimi
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Palauttaa kaikki listassa olevat henkilöt
app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

// /info tulostaa henkilöiden määrän persons-listassa ja pyynnön aikaleiman
app.get('/info', (req, res) => {
  Person.count({}).then(count => {
    res.send(`<p> Phonebook has info for ${count} people</p>
              <p> ${new Date}</p>`)
  })
})

// Yksittäisen henkilön haku
app.get('/api/people/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

// Henkilön poisto
app.delete('/api/people/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(res => {
    res.status(204).end()
  })
    .catch(error => next(error))
})


// Henkilön lisäys
app.post('/api/people/', (req, res, next) => {

  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'Name missing'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'Number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number : body.number,
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

// Numeron päivitys olemassaolevalle henkilölle
app.put('/api/people/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})