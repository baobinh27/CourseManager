const express = require("express");
const router = express.Router();
const Courses = require("../../models/CourseModel");


const authMiddleware = require("../authMiddleware");
const Authentication = require("../auth/Authentication");

const optionalAuthMiddleware = require("../optionalAuthMiddleware")

const User = require("../../models/UserModel");
const Orders = require("../../models/OrderModel");

const test_api = require('../test_api');


// API COURSE:  /api/course

// get all for searching: GET /search?query= (name)
// get by tags for searching: GET /search/tags?tag= (tag)
// get by courseId: GET courseId/:courseId (courseId)  coursecreatorId hoặc isEnrolled mới có quyền
 
// get by author: (bỏ) Trong user có Array createdCourses chứa các 
// các courseId của người đó tạo, truy vấn bằng courseID

// Get list of all courses, sau đó người dùng muốn truy cập vào course --> GET courseId/:courseId
// User get all created courses by user: GET /myCreatedCourse (no params)
// User get all enrolled courses by user: GET /myEnrolledCourse (no params)
// Trả về danh sách khoá đã tạo/enroll của người dùng, không kiểm tra phân quyền vì quá nhiều courses trả về, 
// phía frontend chỗ này cần hiển thị các thông tin của khoá, sau đó khi người dùng click vào khoá thì gọi tới API Get courseId/:courseId

// User delete a created course: DELETE /delete/:courseId (courseId)
// User update a created course: PUT /update/:courseId (courseId)
   
// User enroll in a course: POST /enroll (courseId)  + gọi tới Order API

// search courses: phục vụ cho hàm tìm kiếm cho tất cả người dùng, kể cả không đăng nhập
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        let filter = {};
    
        if (query && query.trim().length > 0) {
            const regex = new RegExp(query.trim(), 'i');
            filter.name = { $regex: regex };
        }
    
        const courses = await Courses.find(filter).sort({ createdAt: -1 });
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found!" });
        }
        return res.status(200).json(courses);
    } catch (error) {
        console.error("Error searching courses:", error);
        return res.status(500).json({ message: "Server error while searching courses." });
    }
});

// get courses by tags for searching. 
router.get("/search/tags", async (req, res) => {
    try {
      const { tag } = req.query;
      let filter = {};
  
      if (tag && tag.trim().length > 0) {
        filter.tags = { $elemMatch: { $regex: new RegExp(tag.trim(), 'i') } };
      }
  
      const courses = await Courses.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error searching courses by tag:", error);
  return res.status(500).json({ message: "Server error while searching by tag." });
    }
  });

// get by courseId
router.get("/courseId/:courseId", optionalAuthMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = req.user || null;

        const course = await Courses.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        let isAuthorized = false;

        console.log("user:", user);
        

        if (user) {
            const auth = new Authentication(user);
            isAuthorized = auth.isCourseCreator(course) || auth.isEnrolled(courseId);
        }

        const courseObject = course;

        if (!isAuthorized) {
            courseObject.content = courseObject.content.map(section => ({
                sectionTitle: section.sectionTitle,
                sectionContent: section.sectionContent.map(video => ({
                    title: video.title,
                    duration: video.duration
                }))
            }));
        }

        res.status(200).json(courseObject);
    }
    catch (error) {
        console.error("Error getting course:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// User get all created courses by user
router.get("/myCreatedCourse", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId).populate({ path: 'createdCourses', model: Courses.modelName }); 
        if (!user){
            return res.status(404).json({ message: "User not found!" });
        }
        return res.status(200).json(user.createdCourses || []);
    }
    catch (error) {
        console.error("Error getting created courses:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// User get all enrolled courses by user
router.get("/myEnrolledCourse", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({ path: 'ownedCourses.courseId', model: Courses.modelName });
    
        if (!user) {
          return res.status(404).json({ message: "User not found!" });
        }
    
        const enrolled = user.ownedCourses.map(item => ({
          course: item.courseId,
          progress: item.progress,
          lastWatchedVideo: item.lastWatchedVideo,
          completedVideos: item.completedVideos,
          enrolledAt: item.enrolledAt
        }));
    
        return res.status(200).json(enrolled);
    } catch (error) {
        console.error("Error getting enrolled courses:", error);
        return res.status(500).json({ message: "Server error while fetching enrolled courses." });
    }
});


// Delete a created course by user
router.delete("/delete/:courseId", authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = req.user;
        const auth = new Authentication(user);

        if (!auth.isCourseCreator(courseId)) {
            return res.status(403).json({ message: "No permission!!" });
        }
        const course = await Courses.findOneAndDelete({ courseId });
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }
        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// Update a created course by user
router.put("/update/:courseId", test_api, async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = req.user;
        const auth = new Authentication(user);

        if (!auth.isCourseCreator(courseId)) {
            return res.status(403).json({ message: "No permission!!" });
        }
        const updatedCourse = await Courses.findOneAndUpdate(
            { courseId },
            req.body,
            { new: true }
        );
        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found!" });
        }
        res.status(200).json({ message: "Course updated successfully!" });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Server error!" });
    }
});



// User enroll in a course
router.post("/enroll", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, paymentMethod, amount, note } = req.body;
        const user = req.user;
        const auth = new Authentication(user);

        if (!auth.logined()) {
            return res.status(403).json({ message: "No permission!!" });
        }
        if (auth.isEnrolled(courseId)) {
            return res.status(400).json({ message: "You are already enrolled in this course!" });
        }
        const course = await Courses.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }
        const order = new Orders({
            userId,
            courseId,
            amount,
            paymentMethod,
            note
          });
          await order.save();
        // ownedCourses: [
        //     {
        //       courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
        //       progress: Number, // số video đã hoàn thành
        //       lastWatchedVideo: String, // videoId cuối cùng xem
        //       completedVideos: [String], // danh sách videoId đã hoàn thành
        //       enrolledAt: { type: Date, default: Date.now }
        //     }
        //   ],
        res.status(201).json({ message: "Enrollment request created. Please wait for admin approval.", order });

    } catch (error) {
        console.error("Error enrolling in course:", error);
        res.status(500).json({ message: "Server error!" });
    }
});



module.exports = router;