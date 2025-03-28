const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },  //required password
    description: String,
    ownedCourses: Array,
    createdCourses: Array,
    cart: Array,
    // ratings: Array,
});

module.exports = mongoose.model("user", UserSchema, "Users");