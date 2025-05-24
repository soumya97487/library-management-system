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

exports.getAllAuthor = async(req, res)=>{
    try{
        const authors = await Author.find();
        res.json(authors)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}