const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
morgan.token('reqBody', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(cors())
app.use(static('build'))

//Kovakoodattu lista ihmisistä
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
  ]

  // Kutsu juureen tulostaa "Hello World"
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  // api/persons palautaa json-muotoisen listan henkilöistä
  app.get('/api/persons', (req, res) => {
    res.json(persons)
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

  // ID: generointi
  const newId = () => {
    const ID = Math.floor(Math.random() * 5000)
    return (ID)
  }

  // Henkilön lisäys
  app.post('/api/persons/', (req, res) => {

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
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})