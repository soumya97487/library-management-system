const mongoose = require('mongoose')
const borrowerSchema = new mongoose.Schema({
    first_name: {type: String, required: true, maxlength:70},
    last_name: {type: String, required: true, maxlength:70},
    email: {type: String, required: true, maxlength:70},
    membership_date: {type: Date, default: Date.now}
})
module.exports = mongoose.model("borrower", borrowerSchema)
