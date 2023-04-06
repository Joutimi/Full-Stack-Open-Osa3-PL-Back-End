const express = require('express')
const app = express()

require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())

morgan.token('reqBody', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :reqBody'))
app.use(cors())

const { response } = require('express')

//Errorhandler
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({error : 'malformatted id'})
  }
  next(error)
}

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


// Kutsu juureen tulostaa "Hello World"
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
  const len = persons.length
  const time = new Date()
  res.send(`
      <div>
      <p> Phonebook has info for ${len} people</p>
      <p> ${time} </p>
      </div>
  `)
})

// Yksittäisen henkilön haku
app.get('/api/people/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

// Henkilön poisto
app.delete('/api/people/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})


// Henkilön lisäys
app.post('/api/people/', (req, res) => {

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

})

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})