const Rental = require('../models/Rental');
const Book = require('../models/Books');
const MONTHLY_RATE = 50;

exports.createRental = async ({ bookId, userId, months }) => {
  if (months < 1 || months > 12) throw new Error('Rent months must be between 1 and 12');
  const book = await Book.findById(bookId);
  if (!book) throw new Error('Book not found');
  const amount = months * MONTHLY_RATE;
  const rental = new Rental({ book: bookId, user: userId, rent_months: months, rent_amount: amount, status: 'pending' });
  return await rental.save();
};

exports.listRentals = async ({ userId, role }) => {
  if (role === 'admin' || role === 'librarian') {
    return Rental.find().populate('book', 'title').populate('user', 'name');
  }
  return Rental.find({ user: userId }).populate('book', 'title');
};

exports.updateRental = async ({ rentalId, months }) => {
  if (months < 1 || months > 12) throw new Error('Rent months must be between 1 and 12');
  const rental = await Rental.findById(rentalId);
  if (!rental) throw new Error('Rental not found');
  rental.rent_months = months;
  rental.rent_amount = months * MONTHLY_RATE;
  return await rental.save();
};

exports.cancelRental = async ({ rentalId }) => {
  const rental = await Rental.findById(rentalId);
  if (!rental) throw new Error('Rental not found');
  await Rental.findByIdAndDelete(rentalId);
  return
};
