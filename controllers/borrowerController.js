const borrowerService = require('../services/borrowerService');

exports.getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await borrowerService.getAllBorrowers();
    res.status(200).json(borrowers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch borrowers' });
  }
};

exports.getBorrowerById = async (req, res) => {
  try {
    const borrower = await borrowerService.getBorrowerById(req.params.id);
    res.status(200).json(borrower);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.createBorrower = async (req, res) => {
  try {
    const borrower = await borrowerService.createBorrower(req.body);
    res.status(201).json(borrower);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateBorrower = async (req, res) => {
  try {
    const updated = await borrowerService.updateBorrower(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.deleteBorrower = async (req, res) => {
  try {
    await borrowerService.deleteBorrower(req.params.id);
    res.status(200).json({ message: 'Borrower deleted' });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};
