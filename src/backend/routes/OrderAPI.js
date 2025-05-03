const express = require("express");
const router = express.Router();
const Courses = require("../../models/CourseModel");
const Orders = require("../../models/OrderModel");
const User = require("../../models/UserModel");


const authMiddleware = require("../authMiddleware");
const Authentication = require("../auth/Authentication");

const test_api = require('../test_api');


// API ORDER:  /api/order
// 