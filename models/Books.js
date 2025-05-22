const mongoose = required('mongoose')
const BooksSchema = new mongoose.schema({
    title: {type: String, required: true, maxlength: 70},
    isbn: {type: String, required: true, maxlength: 70},
    publication_year: {type: integer, required: true},
    publisher: {type: String, required: true, maxlength: 70},
     created_at: {type: Date, default: Date.now},
     authors: [{type: mongoose.schema.Types.objectId, ref: 'Author'}],
     categories:[{type: mongoose.schema.Types.objectID, ref: 'Category'}]
})
module.exports = mongoose.model("Books", BooksSchema)