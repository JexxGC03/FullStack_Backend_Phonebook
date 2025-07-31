require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
} 

app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send(`<h1>Backend Phonebook</h1>` )
})

app.get('/info', (request, response) => {
  const total_persons = Person.length
  console.log(total_persons)
  const date = new Date().toString()
  response.send(
    `<p>Phonebook has info for ${total_persons} people</p>
    <p>${date} </p>`)
  })


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const existingPerson = persons.find(person => person.name === body.name);
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  
  if(existingPerson){
    return response.status(400).json({
      error: `person ${body.name} already exists`
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  
  persons = persons.concat(person)
  
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
