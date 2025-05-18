const mongoose = require ("mongoose")

const authorSchema = new mongoose.schema({
    id: {type: Number, required: true, unique: true},

    name: {type: String, required: true, maxlength: 70},

    bio: {type: String, required: true, maxlength: 255},

    created_at: {type: Date, default: Date.now}
}) 

const Author = mongoose.model('Author', authorSchema, 'Author')

module.exports = Author