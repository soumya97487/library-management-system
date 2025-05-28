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

exports.getAllCategories = async(req, res)=>{
    try{
        const categories = await Category.find()
        res.json(categories)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getCategoryById = async(req,res)=>{
    try{
        const category = await Category.findById(req.params.id)
        if(!category)return res.status(404).json({error: 'Category not found'})
        res.json(category)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.updateCategory = async(req,res)=>{
    try{
        const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updated)return res.status(404).json({error: 'Category not found'})
        res.json(updated)
    }
    catch(err){
        res.status(400).json({error: err.message})
    }
}

exports.deleteCategory = async(req,res)=>{
    try{
        const removed = await Category.findByIdAndDelete(req.params.id)
        if(!removed)return res.status(404).json({error: 'Category not found'})
        res.json({message: 'Category deleted'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}