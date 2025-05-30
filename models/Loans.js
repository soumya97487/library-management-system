const mongoose = require('mongoose')

const loanSchema = new mongoose.Schema({
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'books', required: [true, 'please add the bookId']},
    borrower: {type: mongoose.Schema.Types.ObjectId, ref: 'borrowers', required: [true, 'please add the borrowerId']},
    loan_date: {type: Date, default: Date.now, required: [true, 'please add the loan-date']},
    due_date: {type: Date, required: [true, 'please add the due-date']},
    return_date: {type: Date, required: [true, 'please add thye return-date']},
    status: {type: String, default: 'on_loan'}
})

module.exports = mongoose.model('Loan', loanSchema);