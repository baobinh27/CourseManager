const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const Authentication = require("../auth/Authentication");

const DraftCourses = require("../../models/DraftCourseModel");
const Courses = require("../../models/CourseModel");
const User = require("../../models/UserModel");


// API DRAFT COURSE:  /api/draftCourse

// create: POST /create (courseId, name, author, tags, description, content, price, banner)
// update: PUT /update/:courseId (name, author, tags, description, content, price, banner)
// delete: DELETE /delete/:courseId (courseId)
// get by courseId: GET /:courseId (courseId)
// get all: GET /all (no params)

// ADMIN API FOR DRAFT COURSE
// get all draft courses: GET /allDraftCourses (no params)
// approve: POST /approve/:courseId (courseId)
// reject: POST /reject/:courseId (courseId)

// User create a draft course
router.post('/create', authMiddleware, async (req, res) => {
    try {
      const { courseId, name, author, tags, description, content, price, banner } = req.body;
      const user = req.user;
      const auth = new Authentication(user);
  
      if (!auth.isLoggedIn()) {
        return res.status(403).json({ message: 'Forbidden: Not logged in' });
      }
  
      // Optional: prevent duplicate draft for same user & course
      const exists = await DraftCourse.findOne({ courseId, userId: user._id });
      if (exists) {
        return res.status(409).json({ message: 'Draft already exists for this course' });
      }
  
      const draft = new DraftCourse({ courseId, userId: user._id, name, author, tags, description, content, price, banner });
      await draft.save();
  
      res.status(201).json({ message: 'Draft course created successfully', draft });
    } catch (error) {
      console.error('Error creating draft course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// User update a draft course
router.put('/update/:courseId', authMiddleware, async (req, res) => {
    try {
      const { courseId } = req.params;
      const user = req.user;
      const auth = new Authentication(user);
  
      const draft = await DraftCourse.findOne({ courseId, userId: user._id });
      if (!draft) {
        return res.status(404).json({ message: 'Draft course not found' });
      }
  
      if (!auth.isDraftCourseCreator(draft)) {
        return res.status(403).json({ message: 'Forbidden: No permission' });
      }
  
      const updates = (({ name, author, tags, description, content, price, banner }) =>
        ({ name, author, tags, description, content, price, banner }))(req.body);
  
      const updated = await DraftCourse.findOneAndUpdate(
        { courseId, userId: user._id },
        updates,
        { new: true }
      );
  
      res.status(200).json({ message: 'Draft course updated successfully', draft: updated });
    } catch (error) {
      console.error('Error updating draft course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// User delete a draft course
  router.delete('/delete/:courseId', authMiddleware, async (req, res) => {
    try {
      const { courseId } = req.params;
      const user = req.user;
      const auth = new Authentication(user);
  
      const draft = await DraftCourse.findOne({ courseId, userId: user._id });
      if (!draft) {
        return res.status(404).json({ message: 'Draft course not found' });
      }
  
      if (!auth.isDraftCourseCreator(draft)) {
        return res.status(403).json({ message: 'Forbidden: No permission' });
      }
  
      await DraftCourse.deleteOne({ courseId, userId: user._id });
      res.status(200).json({ message: 'Draft course deleted successfully' });
    } catch (error) {
      console.error('Error deleting draft course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// User get a draft course by courseId
router.get('/:courseId', authMiddleware, async (req, res) => {
    try {
      const { courseId } = req.params;
      const user = req.user;
  
      const draft = await DraftCourse.findOne({ courseId, userId: user._id });
      if (!draft) {
        return res.status(404).json({ message: 'Draft course not found' });
      }
  
      res.status(200).json(draft);
    } catch (error) {
      console.error('Error fetching draft course:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

// User get all user's draft courses       
router.get('/all', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      const drafts = await DraftCourse.find({ userId: user._id });
  
      res.status(200).json(drafts);
    } catch (error) {
      console.error('Error fetching draft courses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// get all draft courses for admin
router.get('/allDraftCourses', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      const auth = new Authentication(user);
  
      if (!auth.isAdmin()) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
      }
  
      const drafts = await DraftCourse.find({});
      res.status(200).json(drafts);
    } catch (error) {
      console.error('Error fetching all draft courses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// admin approve a draft course
router.post('/approve/:courseId', authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = req.user;
        const auth = new Authentication(user);
    
        if (!auth.isAdmin()) {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
    
        const draft = await DraftCourse.findOne({ courseId });
        if (!draft) {
            return res.status(404).json({ message: 'Draft course not found' });
        }
    
        const course = new Course({
            courseId: draft.courseId,
            userId: draft.userId,
            name: draft.name,
            author: draft.author,
            tags: draft.tags,
            description: draft.description,
            content: draft.content,
            ratings: [],
            enrollCount: 0,
            price: draft.price,
            lastModified: new Date(),
            banner: draft.banner,
        });
        await course.save();
    
        // Update in user.createdCourses
        const courseOwner = await User.findById(draft.userId);
        if (courseOwner) {
            courseOwner.createdCourses.push(course._id);
            await courseOwner.save();
        }
        await DraftCourse.deleteOne({ courseId });

    
        res.status(201).json({ message: 'Draft course approved successfully', course });
    } catch (error) {
        console.error('Error approving draft course:', error);
        res.status(500).json({ message: 'Server error' });
    }
  });
// router.post("/approve/:courseId", async (req, res) => {
//     try {
//         const { courseId } = req.params;
//         const draftCourse = await DraftCourses.findOne({ courseId });
//         if (!draftCourse) {
//             return res.status(404).json({ message: "Draft course not found!" });
//         }

//         await DraftCourses.deleteOne({ courseId });        
//         // Update the courseId in created Courses by user
//         const user = await User.findById(draftCourse.userId);
//         if (user) {
//             user.createdCourses.push(newCourse._id);
//             await user.save();
//         } else {
//             console.error("User not found:", draftCourse.userId);
//         }
//         res.status(201).json({ message: "Draft course approved and moved to Courses!" });

//     }
//     catch (error) {
//          console.error("Error approving draft course:", error);
//          res.status(500).json({ message: "Server error!" });
//     }
// });

// admin reject a draft course
router.post('/reject/:courseId', authMiddleware, async (req, res) => {
    try {
      const { courseId } = req.params;
      const user = req.user;
      const auth = new Authentication(user);
  
      if (!auth.isAdmin()) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
      }
  
      const deleted = await DraftCourse.findOneAndDelete({ courseId });
      if (!deleted) {
        return res.status(404).json({ message: 'Draft course not found' });
      }
  
      res.status(200).json({ message: 'Draft course rejected and deleted' });
    } catch (error) {
      console.error('Error rejecting draft course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;