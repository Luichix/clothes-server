const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true },
    description: {
        type: String,
        required: true },
    category: {
        type: String,
        required: true },
    stock: {
        type: Number,
        required: true },
    price: {
        type: Number,
        required: true },
    state: {
        type: String,
        required: true },
    imageUrl: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now() }
})


imageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Image', imageSchema)