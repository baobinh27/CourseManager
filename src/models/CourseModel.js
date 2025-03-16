const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: String,
    author: String,
    tags: Array,
    description: String,
    content: Array,
    ratings: Array,
    enrolCount: Number,
    price: Number,
    lastModified: Date,
    banner: String
});

module.exports = mongoose.model("course", CourseSchema, "Courses");