const mongoose = require ("mongoose")

const authorSchema = new mongoose.Schema({
    name: {type: String, required: true, maxlength: 70, unique: true},

    bio: {type: String, required: true, maxlength: 255},

    created_at: {type: Date, default: Date.now}
}) 

const Author = mongoose.model('Author', authorSchema, 'authors')

module.exports = Author