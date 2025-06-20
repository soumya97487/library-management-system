const jwt = require('jsonwebtoken')

const user = require('../models/User')

exports.protect = async(req,res, next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return res.status(401).json({ success: false, error: 'Not authorized, token missing' })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await user.findById(decoded.id)
        next()
    }catch(err){
        console.log(err)
        return res.status(401).json({ success: false, error: 'Not authorized, token invalid' })
    }
}

exports.restrictTo = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ success: false, error: `Role '${req.user.role}' not allowed` })
        }
        next(   )
    }
}