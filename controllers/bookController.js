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

exports.getBookById = async (req,res)=>{
    try{
        const book = await book.findById(req.params.id).populate('authors').populate('categories')
        if(!book)return res.status(404).json({error: 'book not found'})
        res.json(book)    
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.updateBook = async(req,res)=>{
    try{
        const updated = await book.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updated)return res.status(404).json({error: 'Book not Found'})
        res.json(updated)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

exports.deleteBook = async(req,res)=>{
    try{
        const removed = await book.findByIdAndDelete(req.params.id)
        if(!removed) return res.status(404).json({error: 'Book not found'})
        res.json({message: 'Book deleted'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}