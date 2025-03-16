const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    description: String,
    ownedCourses: Array,
    createdCourses: Array,
    cart: Array,
    // ratings: Array,
});

module.exports = mongoose.model("user", UserSchema, "Users");