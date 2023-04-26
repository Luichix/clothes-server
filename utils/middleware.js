const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {

    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error:error.message })
    }else if (error.name === 'MongoServerError' && error.code === 11000) {
        return response
            .status(500)
            .send({ success: false, message: 'Username already exists!' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TypeError') {
        return response.status(500).json({
            error: 'Internal Server Error'
        })
    }

    logger.error(error.message)
    console.log(error.name)

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}