const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to url')

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 4,
    require: true
  },
  number: {
    type: String,
    minLength: [8, 'El número no es valido, debe tener minimo 8 caracteres'],
    validate: {
      validator: function(v) {
        // Debe empezar con 2 o 3 dígitos, luego un guion, luego al menos un dígito
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} no es un número válido. Debe tener 2 o 3 dígitos, un guion y más números (ej: 12-123456 o 123-456789)`
    },
    require: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)