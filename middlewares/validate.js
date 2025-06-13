const Joi = require('joi')

const validate = (schema)=>(req,res,next)=>{
    const{error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({sucess: false, message: error.details[0].message})
    }
    next()
}

const authorSchema = Joi.object({
  name: Joi.string().max(70).required(),
  bio: Joi.string().max(255).required()
});

const categorySchema = Joi.object({
  name: Joi.string().max(70).required(),
  description: Joi.string().max(255).required()
});

const borrowerSchema = Joi.object({
  first_name: Joi.string().max(70).required(),
  last_name: Joi.string().max(70).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string()
});

const bookSchema = Joi.object({
  title: Joi.string().max(70).required(),
  isbn: Joi.string().max(70).required(),
  publication_year: Joi.number().integer().required(),
  publisher: Joi.string().max(70).required(),
  authors: Joi.array().items(Joi.string().hex().length(24)).required(),
  categories: Joi.array().items(Joi.string().hex().length(24)).required()
});

const loanSchema = Joi.object({
  book: Joi.string().hex().length(24).required(),
  borrower: Joi.string().hex().length(24).required(),
  loan_date: Joi.date().required(),
  due_date: Joi.date().required(),
  return_date: Joi.date().required(),
  status: Joi.string().required()
});

const userSignupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin','librarian','member').optional()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

module.exports = {
    validate,
    schemas:{
        author: authorSchema,
        category: categorySchema,
        borrower: borrowerSchema,
        book: bookSchema,
        loan: loanSchema,
        userSignup: userSignupSchema,
        userLogin: userLoginSchema
    }
}

