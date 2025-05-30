const jwt = require('jsonwebtoken')

const user = require('../models/User')

const sendToken = (user, statusCode, res)=>{
    const payload = {id: user.id, role: user.role}
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE})
    res.status(statusCode).json({success: true,token})
}

exports.signup = async(req,res)=>{
    const{name, email, password, role} = req.body
    const user = await user.create({name, email, password, role})
    sendToken(user, 201, res)
}

exports.login = async(req, res)=>{
    const{email, password}=req.body
    if(!email || !password){
        return res.status(401).json({success: false, error: 'invalid credentials'})
    }
    sendToken(user, 200, res)
}