const notesRouter = require('express').Router()
const Note = require('../models/note')


// Recibir todas las notas
notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

// Recibir una unica nota
notesRouter.get('/:id', (request, response, next) => {
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
notesRouter.post('/', (request, response, next) => {
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
notesRouter.put('/:id', (request, response, next) => {
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
notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = notesRouter