const mongoose= require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    estado: String,
    validacion: String,
});

module.exports = mongoose.model('users', UserSchema);