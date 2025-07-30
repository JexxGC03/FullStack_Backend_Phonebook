const express = require('express')
const app = express()
const morgan = require('morgan');

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(morgan('dev'));

morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '-';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));
 
app.get('/', (request, response) => {
  response.send(`<h1>Backend Phonebook</h1>` )
})

app.get('/info', (request, response) => {
    const total_persons = persons.length
    console.log(total_persons)
    const date = new Date().toString()
    response.send(
        `<p>Phonebook has info for ${total_persons} people</p>
        <p>${date} </p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * (99999 - 1 + 1) + 1);
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

