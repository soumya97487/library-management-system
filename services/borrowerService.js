const Borrower = require('../models/Borrowers');

exports.getAllBorrowers = async () => {
  return await Borrower.find();
};

exports.getBorrowerById = async (id) => {
  const borrower = await Borrower.findById(id);
  if (!borrower) throw new Error('Borrower not found');
  return borrower;
};

exports.createBorrower = async (data) => {
  const borrower = new Borrower(data);
  return await borrower.save();
};

exports.updateBorrower = async (id, data) => {
  const updated = await Borrower.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Borrower not found');
  return updated;
};

exports.deleteBorrower = async (id) => {
  const deleted = await Borrower.findByIdAndDelete(id);
  if (!deleted) throw new Error('Borrower not found');
  return deleted;
};
