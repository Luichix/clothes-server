const imageRouter = require('express').Router()
const { cloudinary } = require('../utils/config')
const Image = require('../models/image')

imageRouter.get('/', async (request, response) => {
    const images = await Image.find({}).skip(0).limit(0)
    response.json(images)
})

imageRouter.post('/', async (request, response) => {
    const body = request.body
    const fileStr = request.body.data
    const uploadResponse = await cloudinary.uploader.upload(fileStr,{
        upload_preset: 'cloudinary_react'
    })

    const newImage = new Image({
        item: body.item,
        description: body.description,
        category: body.category,
        stock: body.stock,
        price: body.price,
        state: body.state,
        imageUrl: uploadResponse.url,
        public_id: uploadResponse.public_id,
    })

    const savedImage = await newImage.save()
    response.json(savedImage)

})


imageRouter.put('/:id', async (request, response) => {
    const body = request.body

    const image = {
        item: body.item,
        description: body.description,
        category: body.category,
        stock: body.stock,
        price: body.price,
        state: body.state
    }

    const updatedImage = await Image.findByIdAndUpdate(request.params.id, image, { new: true })
    response.json(updatedImage)
})


imageRouter.delete('/:_id', async (request, response) => {
    const id = request.params
    const photo = await Image.findByIdAndDelete(id)
    if (photo){
        const result = await cloudinary.uploader.destroy(photo.public_id)
        console.log('cloudinary',result)
    }
    response.status(204).end()
})


module.exports = imageRouter

