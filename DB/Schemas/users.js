const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: String,
    firstName: String,
    lastName: String,
    email: { type: String, required:true },
    password: { type: String, required:true },
    role: {type: String, required:true},
    players:[String],
    trainingPrograms:[String]
});

const User = model('users', userSchema);

module.exports = User;