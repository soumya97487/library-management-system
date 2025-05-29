const Borrower = require('../models/Borrowers')

exports.getAllBorrowers = async(req,res)=>{
    try{

        const borrowers = await Borrower.find()
        res.json(borrowers)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.getBorrowersById = async(req,res)=>{
    try{
        const borrower = await Borrower.findById(req.params.id)
        if(!borrower) return res.status(404).json({error: 'Borrower not found'})
        res.json(borrower)    
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.createBorrower = async(req,res)=>{
    try{
        const newBorrower = new Borrower(req.body)
        const saved = await newBorrower.save()
        res.status(201).json(saved)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

exports.updateBorrower = async (req,res)=>{
    try{
        const updated = await Borrower.findByIdAndUpdate(req.params.id, req.body,{new: true})
        if(!updated)return res.status(404).json({error: 'Borrower not found'})
        res.json(updated)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

exports.deleteBorrower = async(req,res)=>{
    try{
        const removed = await Borrower.findByIdAndDelete(req.params.id)
        if(!removed)return res.status(404).json({error: 'Borrower not found'})
        res.json({message: 'Borrower Deleted'})
    }catch(err){
        res.status(400).json({error: err.message})
    }
}