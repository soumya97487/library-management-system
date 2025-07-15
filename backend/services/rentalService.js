// backend/services/rentalService.js
const Rental = require('../models/Rental');
const Book   = require('../models/Books');
const RATE   = 50;

exports.createRental = async ({ bookId, userId, months }) => {
  if (months<1||months>12) throw new Error('Months 1–12');
  if (!await Book.findById(bookId)) throw new Error('Book not found');
  const rent_amount = months * RATE;
  return new Rental({ book: bookId, user: userId, rent_months: months, rent_amount, status: 'pending' }).save();
};

exports.listRentals = async ({ userId, role }) => {
  const filter = role==='member'
    ? { user: userId, status: { $ne:'cancelled' } }
    : { status: { $ne:'cancelled' } };
  return Rental.find(filter).populate('book','title').populate('user','name');
};

exports.updateRental = async ({ rentalId, months }) => {
  const r = await Rental.findById(rentalId);
  if (!r) throw new Error('Rental not found');
  r.rent_months = months; r.rent_amount = months * RATE;
  return r.save();
};

exports.cancelRental = async ({ rentalId }) => {
  await Rental.findByIdAndDelete(rentalId);
};

exports.payAllRentals = async ({ userId }) => {
  return Rental.updateMany(
    { user: userId, status: 'pending' },
    { status:'paid' }
  );
};
