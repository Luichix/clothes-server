require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
const cors = require('cors')

app.use(express.json())

// Mensaje de estructura de solicitud
const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(logger)

// Permiso de enlace del frontend desde otro origen
app.use(cors())

// Renderizado del archivo estatico
app.use(express.static('build'))

// Mensaje de ruta inicial del servidor
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Recibir todas las notas
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// Recibir una unica nota
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Agregar una nota
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })
    .catch(error => next(error))
})

// Actualizacion de nota
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))

})


// ELiminar una nota
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Error de ruta desconocida
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Manejador de errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error:error.message })
  }

  next(error)
}

app.use(errorHandler)

// Puerto del servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

