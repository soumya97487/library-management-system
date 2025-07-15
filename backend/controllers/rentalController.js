// backend/controllers/rentalController.js
const service = require('../services/rentalService');

exports.createRental = async (req,res) => {
  try {
    const r = await service.createRental({ bookId:req.body.bookId, userId:req.user._id, months:req.body.months });
    res.status(201).json(r);
  } catch(err) {
    res.status(400).json({ error:err.message });
  }
};

exports.listRentals = async (req,res) => {
  try {
    const r = await service.listRentals({ userId:req.user._id, role:req.user.role });
    res.json(r);
  } catch(err) {
    res.status(500).json({ error:err.message });
  }
};

exports.updateRental = async (req,res) => {
  try {
    const r = await service.updateRental({ rentalId:req.params.id, months:req.body.months });
    res.json(r);
  } catch(err) {
    res.status(400).json({ error:err.message });
  }
};

exports.cancelRental = async (req,res) => {
  try {
    await service.cancelRental({ rentalId:req.params.id });
    res.json({ success:true });
  } catch(err) {
    res.status(400).json({ error:err.message });
  }
};

exports.payAllRentals = async (req,res) => {
  try {
    const result = await service.payAllRentals({ userId:req.user._id });
    res.json({ success:true, modifiedCount: result.nModified });
  } catch(err) {
    res.status(500).json({ error:err.message });
  }
};
