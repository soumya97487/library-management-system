const mongoose = require ('mongoose')
const bcrypt = require ('bcrypt')

const userSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'please add a name']},
    email: {type: String, required: [true, 'please add a mailId'], unique:true},
    password:{type:String, required:[true, 'please add a password'], minlength: 8, select:false},
    role: {type: String, enum:['admin', 'librarian', 'member'], default: 'member'}
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()    
})

userSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('users', userSchema)