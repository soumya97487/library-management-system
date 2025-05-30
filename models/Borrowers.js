const mongoose = require('mongoose')
const borrowerSchema = new mongoose.Schema({
    first_name: {type: String, required: [true, 'please add a name'], maxlength:70},
    last_name: {type: String, required: [true, 'please add a name'], maxlength:70},
    email: {type: String, required: [true, 'please add email'], maxlength:70, unique: true},
    phone: {type: Number, required: [true, 'please add the phone no'], unique: true},
    membership_date: {type: Date, default: Date.now}
})
module.exports = mongoose.model("borrowers", borrowerSchema)
