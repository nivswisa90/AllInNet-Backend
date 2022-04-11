const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName: { type: String },
    lastName: {type: String},
    email: { type: String },
    password: { type: String },
    role: {type: String}
});

const User = model('users', userSchema);

module.exports = User;