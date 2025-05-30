const mongoose = require ("mongoose")

const authorSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'please add a name'], maxlength: 70, unique: true},

    bio: {type: String, required: [true, 'please add a bio'], maxlength: 255},

    created_at: {type: Date, default: Date.now}
}) 

const Author = mongoose.model('authors', authorSchema)

module.exports = Author