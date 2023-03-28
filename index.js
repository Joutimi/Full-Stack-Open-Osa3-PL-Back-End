const express = require('express')
const app = express()

require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.json())
morgan.token('reqBody', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(cors())

app.use(express.static('build'))
const { response } = require('express')

//Kovakoodattu lista ihmisistä
/* let persons = [
    {

    }
  ]   */

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
  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
  })

  // Henkilön poisto
  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
  })

  // Henkilön lisäys
/*   app.post('/api/persons/', (req, res) => {

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

   if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
   }

  
    const person = {
      name: body.name,
      number: body.number,
      id: newId()
    }

    persons = persons.concat(person)
    res.json(person)
  }) */

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})