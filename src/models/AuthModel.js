const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
    userId: String,
    email: String,
    hashedPassword: String,
    salt: String
});

module.exports = mongoose.model("auth", AuthSchema, "Authentication");