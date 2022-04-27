const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName: { type: String },
    lastName: {type: String},
    email: { type: String, required:true },
    password: { type: String, required:true },
    role: {type: String, required:true},
    players:[
        {id:{type:String}}
    ],
    trainingPrograms:[
        {id: {type: String}}
    ]
});

const User = model('users', userSchema);

module.exports = User;