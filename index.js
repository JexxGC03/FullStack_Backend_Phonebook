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
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    });
  }

  Person.find({ name: body.name }).then(existingPerson => {
    if (existingPerson.length > 0) {
      return response.status(400).json({
        error: `person ${body.name} already exists`
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then(savedPerson => {
      response.json(savedPerson);
    });
  });
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log('error deleting person:', error.message)
      response.status(500).send({ error: 'deletion failed' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
