const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require("dotenv").config();
const CourseModel = require('../models/CourseModel');

// Connecting to database
const query = process.env.URL_DB;

const db = encodeURI(query);

mongoose.Promise = global.Promise;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connect success")).catch((error) => console.log(error));


// api mẫu
router.route('/get').get(async (req, res) => {
    try {
        const courses = await CourseModel.find();
        console.log(courses);
        res.setHeader('Access-Control-Allow-Origin', '*'); // set access
        res.json({data: courses, status: "success"});
    } catch (error) {
        console.log(error);
    }
});

router.route('/get/:value/by/:searchBy').get(async (req, res) => {
    try {
        const searchBy = req.params.searchBy;
        const value = req.params.value;
        const students = await StudentModel.find({
            [searchBy]: { $regex: value, $options: "i" } // Tìm kiếm không phân biệt hoa thường
        });
        res.setHeader('Access-Control-Allow-Origin', '*'); // set access
        if (students.length === 0) {
            res.json({data: [], status: "NOT FOUND"});
        } else {
            res.json({data: students, status: "success"});
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;