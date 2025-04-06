const express = require("express");
const router = express.Router();
const Courses = require("../../models/CourseModel");

// API COURSE:  /api/course
// get by courseId: GET /:courseId (courseId)
// get all: GET /all (no params)
// get by tag: GET /tag/:tag (tag)
// get by name: GET /name/:name (name)
// get by author: GET /author/:author (author)

// get course by courseId
router.get("/:courseId", async (req, res) => {
    try {
         const { courseId } = req.params;
         const course = await Courses.findOne({ courseId });
         if (!course) {
             return res.status(404).json({ message: "Course not found!" });
         }
         res.status(200).json(course);
    }
    catch (error) {
         console.error("Error getting course:", error);
         res.status(500).json({ message: "Server error!" });
    }
});

// get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Courses.find({});
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found!" });
        }
        res.status(200).json(courses);
}
    catch (error) {
            console.error("Error getting courses:", error);
            res.status(500).json({ message: "Server error!" });
        }
    });

// get courses by tags
router.get("/tags/:tag", async (req, res) => {
    try {
         const { tag } = req.params;
         const courses = await Courses.find({ tag });
         if (!courses || courses.length === 0) {
             return res.status(404).json({ message: "No courses found!" });
         }
         res.status(200).json(courses);
    }
    catch (error) {
         console.error("Error getting courses:", error);
         res.status(500).json({ message: "Server error!" });
    }
});

// get courses by name
router.get("/name/:name", async (req, res) => {
    try {
         const { name } = req.params;
         const courses = await Courses.find({ name });
         if (!courses || courses.length === 0) {
             return res.status(404).json({ message: "No courses found!" });
         }
         res.status(200).json(courses);
    }
    catch (error) {
         console.error("Error getting courses:", error);
         res.status(500).json({ message: "Server error!" });
    }
});

// get courses by author
router.get("/author/:author", async (req, res) => {
    try {
         const { author } = req.params;
         const courses = await Courses.find({ author });
         if (!courses || courses.length === 0) {
             return res.status(404).json({ message: "No courses found!" });
         }
         res.status(200).json(courses);
    }
    catch (error) {
         console.error("Error getting courses:", error);
         res.status(500).json({ message: "Server error!" });
    }
});

module.exports = router;