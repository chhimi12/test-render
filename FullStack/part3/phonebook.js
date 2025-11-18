
const http = require('http')
const express = require('express')
let morgan = require('morgan')
const cors = require('cors')

const phonebook = require('./models/db_phonebook')
const { error } = require('console')


const app = express()
app.use(express.json()) // parses request received from JSON to java script object and attaches to request body

app.use(express.static('dist'))
app.use(cors()) // allows request from all origins


morgan.token('body', (req) => {
  console.log("call reached here, middleware activated")
  return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] :body - :response-time ms'))

app.get('/api/persons',(request, response) => {
    phonebook.find({}).then(result =>{
      console.log(result)
      response.json(result)
    })
}) 

app.get('/api/persons/:id',(request, response, next) => {
  const id = request.params.id

  phonebook.find({_id:id}).then(result => {
    response.json(result)
    response.status(204).end()
  }).catch(error => next(error))

})

app.put('/api/persons/:id',(request, response, next) => {
  const id = request.params.id
  const {name, number} = request.body

  phonebook.findById(id).then(result => {
    if(!result) {
      return response.status(404).end()
    }
    result.name = name
    result.number = number

    return result.save().then((updatedPhone) => {
      response.json(updatedPhone)
    })
  }).catch(error => next(error))

})

app.delete('/api/persons/:id',(request, response, next) => {
  console.log("call reached to delete")
  const id = request.params.id

  phonebook.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))

})




app.post('/api/persons',(request, response, next) => {
 
 
  console.log("call reached to add the person")
  const new_phone = new phonebook({
    name: request.body.name,
    number: request.body.number
  })

  new_phone.save().then(savedContact => {
    response.json(savedContact)
  }).catch(error => next(error))
  

})


app.get('/info', (request, response) => {
    const now = Date()
    
    response.send(`<b><p>The phonebook has ${phonebook.length} entries.</p>${now}</b>`)

})

// this has to be the last loaded middleware, also all the routes should be registered before this!

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`)
})
