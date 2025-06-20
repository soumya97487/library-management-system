const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'please add a name']},
    email: {type: String, required: [true, 'please add a mailId'], unique:true},
    password:{type:String, required:[true, 'please add a password'], minlength: 8, select:false},
    role: {type: String, enum:['admin', 'librarian', 'member'], default: 'member'},
    isVerified: {type: Boolean, default: false},
    verificationToken: String,
    verificationTokenExpire: Date
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    if (this.password.startsWith('$2b$')) return next();     
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()    
})

userSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
}

// Method to generate verification token
userSchema.methods.generateVerificationToken = function(){
    const verificationToken = crypto.randomBytes(32).toString('hex')
    this.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
    return verificationToken
}

module.exports = mongoose.model('User', userSchema)