const mongoose = required('mongoose')

const loanSchema = new mongoose.schema({
    book: {type: mongoose.schema.Types.ObjectId, ref: 'Book', required: true},
    borrower: {type: mongoose.schema.Types.ObjectId, ref: 'Borrower', required: true},
    loan_date: {type: Date, default: Date.now},
    due_date: {type: Date, required: true},
    return_date: {type: date, required: true},
    status: {type: String, default: 'on_loan'}
})

module.exports = mongoose.model('Loan', loanSchema);