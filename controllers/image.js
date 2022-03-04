const imageRouter = require('express').Router()
const { cloudinary } = require('../utils/config')
const Image = require('../models/image')

imageRouter.get('/', async (request, response) => {
    const images = await Image.find({}).skip(0).limit(0)
    console.log(images)
    response.json(images)
})

imageRouter.post('/', async (request, response) => {
    const body = request.body
    const fileStr = request.body.data
    const uploadResponse = await cloudinary.uploader.upload(fileStr,{
        upload_preset: 'cloudinary_react'
    })
    console.log(uploadResponse)
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
    console.log(newImage)
    const savedImage = await newImage.save()
    response.json(savedImage)

})

module.exports = imageRouter

