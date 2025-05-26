const Category = require('../models/Categories')

exports.createCategory = async(req,res)=>{
    try{
        const newCategory = new Category(req.body)
        const saved = await newCategory.save()
        res.status(201).json(saved)
    } catch(err){
        res.status(400).json({error: err.message})
    }
}