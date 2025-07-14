const rentalService = require('../services/rentalService');

exports.createRental = async (req, res) => {
  try {
    const { bookId, months } = req.body;
    const userId = req.user._id;
    const rental = await rentalService.createRental({ bookId, userId, months });
    res.status(201).json(rental);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listRentals = async (req, res) => {
  try {
    const { _id: userId, role } = req.user;
    const rentals = await rentalService.listRentals({ userId, role });
    res.status(200).json(rentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRental = async (req, res) => {
  try {
    const { months } = req.body;
    const rental = await rentalService.updateRental({ rentalId: req.params.id, months });
    res.status(200).json(rental);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.cancelRental = async (req, res) => {
  try {
    const rental = await rentalService.cancelRental({ rentalId: req.params.id });
    res.status(200).json(rental);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

