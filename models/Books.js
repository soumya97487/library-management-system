const mongoose = require('mongoose')
const BooksSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'please add a title'], maxlength: 70, unique: true},
    isbn: {type: String, required: [true, 'please add the isbn no'], maxlength: 70},
    publication_year: {type: Number, required: [true, 'please add the year']},
    publisher: {type: String, required: [true, "please add the publisher's name"], maxlength: 70},
     created_at: {type: Date, default: Date.now},
     authors: [{type: mongoose.Schema.Types.ObjectId, ref: 'authors'}],
     categories:[{type: mongoose.Schema.Types.ObjectId, ref: 'categories'}]
})
module.exports = mongoose.model("books", BooksSchema)   