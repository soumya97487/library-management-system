const Author = require('../models/Author')

exports.createAuthor = async(req, res)=>{
    try{
        const newAuthor = new Author(req.body);
        const saved = await newAuthor.save();
        res.status(201).json(saved)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

exports.getAllAuthors = async(req, res)=>{
    try{
        const authors = await Author.find();
        res.json(authors)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.getAuthorById = async(req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        if(!author)return res.status(404).json({error: 'Author not found'})
            res.json(author)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.updateAuthor = async(req,res)=>{
    try{    
        const updated = await Author.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updated)return res.status(404).json({error: 'Author not found'})
            res.json(updated);
    }catch(err){
        res.status(400).json({error:err.message})
    }
}

exports.deleteAuthor = async(req,res)=>{
    try{
        const removed = await Author.findByIdAndDelete(req.params.id)
        if(!removed)return res.status(404).json({error: 'Author not found'})  
        res.json({message: 'Author deleted'})  
    }catch(err){
        res.status(500).json({error: err.message})
    }
}