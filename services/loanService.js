const Loan = require('../models/Loans');

exports.getAllLoans = async () => {
  return await Loan.find()
    .populate({ path: 'book', select: 'title' })
    .populate({ path: 'borrower', select: 'first_name last_name' });
};

exports.getLoanById = async (id) => {
  const loan = await Loan.findById(id)
    .populate({ path: 'book', select: 'title' })
    .populate({ path: 'borrower', select: 'first_name last_name' });
  if (!loan) throw new Error('Loan not found');
  return loan;
};

exports.createLoan = async (data) => {
  const loan = new Loan(data);
  return await loan.save();
};

exports.updateLoan = async (id, data) => {
  const updated = await Loan.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Loan not found');
  return updated;
};

exports.deleteLoan = async (id) => {
  const deleted = await Loan.findByIdAndDelete(id);
  if (!deleted) throw new Error('Loan not found');
  return deleted;
};
