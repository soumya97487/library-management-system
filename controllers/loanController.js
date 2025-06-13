const loanService = require('../services/loanService')

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await loanService.getAllLoans();
    res.status(200).json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await loanService.getLoanById(req.params.id);
    res.status(200).json(loan);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.createLoan = async (req, res) => {
  try {
    const loan = await loanService.createLoan(req.body);
    res.status(201).json(loan);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const updated = await loanService.updateLoan(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    await loanService.deleteLoan(req.params.id);
    res.status(200).json({ message: 'Loan deleted' });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};
