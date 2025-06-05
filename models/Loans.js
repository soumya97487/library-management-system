const mongoose = require('mongoose')

const loanSchema = new mongoose.Schema({
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
    borrower: {type: mongoose.Schema.Types.ObjectId, ref: 'Borrower', required: true},
    loan_date: {type: Date, default: Date.now},
    due_date: {type: Date, required: true},
    return_date: {type: Date, required: true},
    status: {type: String, default: 'on_loan'}
})

module.exports = mongoose.model('Loan', loanSchema);