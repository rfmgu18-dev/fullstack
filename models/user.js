const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    verified: {
        type: Boolean,
        default: false
    },
});

userShema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});


const User = mongoose.model('User', userShema);

module.exports = User;