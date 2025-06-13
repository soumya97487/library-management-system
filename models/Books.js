const mongoose = require('mongoose')
const BooksSchema = new mongoose.Schema({
    title: {type: String, required: true, maxlength: 70},
    isbn: {type: String, required: true, maxlength: 70},
    publication_year: {type: Number, required: true},
    publisher: {type: String, required: true, maxlength: 70},
     created_at: {type: Date, default: Date.now},
     authors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}],
     categories:[{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}]
})
module.exports = mongoose.model('Book', BooksSchema);
