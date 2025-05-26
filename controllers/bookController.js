const book = require('../models/Books')

exports.createBook = async(req,res)=>{
    try{
        const newBook = new book(req.body)
        const saved = await newBook.save()
        res.status(201).json(saved)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

exports.getAllBooks = async(req,res)=>{
    try{
        const books = await book.find().populate('authors').populate('categories')
        res.json(books)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}