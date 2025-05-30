const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {type: String, required: [true, 'please add a Category name'], maxlength: 70},
    description: {type: String, required: [true, 'please add a description'], maxlength: 255},
     created_at: {type: Date, default: Date.now}

})

module.exports = mongoose.model('categories', categorySchema)