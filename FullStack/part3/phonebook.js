const http = require('http')
const express = require('express')
let morgan = require('morgan')
const cors = require('cors')


// nto working

const app = express()
app.use(express.static('dist'))
app.use(cors()) // allows request from all origins

app.use(express.json()) // parses request received from JSON to java script object and attaches to request body

morgan.token('body', (req) => {
  console.log("call reached here, middleware activated")
  return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] :body - :response-time ms'))

// app.use('tiny')

let phoneBook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    
]


app.get('/api/persons',(request, response) => {
    response.json(phoneBook)
}) 

app.get('/api/persons/5',(request, response) => {

  if(phoneBook[5]) {
      response.json(phoneBook[5])
  }
  else {
    response.status(404).end() // set the status and do not send any data
  }

})


app.delete('/api/persons/:id',(request, response) => {
  const id = request.params.id
  if(phoneBook[id]) {
    phoneBook = phoneBook.filter(note => note.id != id)   
    response.json(phoneBook) 
  }

  else {
    response.status(404).end()
  }

})

app.post('/api/persons',(request, response) => {


  const new_phone = request.body
  if (phoneBook.find(item => item.number === new_phone.number ))
  {
    response.statusMessage = "Phone number already exists"
    response.status(404).end()
  }

  if(new_phone.name && new_phone.number) {
  const randomId = Math.floor(Math.random()*100)
  new_phone.id = randomId

  phoneBook.push(new_phone)
  }

  else {
    response.status(404).end()
  }

 console.log(new_phone)

})

app.get('/info', (request, response) => {
    const now = Date()
    
    response.send(`<b><p>The phonebook has ${phoneBook.length} entries.</p>${now}</b>`)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`)
})
