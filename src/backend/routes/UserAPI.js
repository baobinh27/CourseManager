const express = require("express");
const jwt     = require('jsonwebtoken');

const bcrypt = require("bcrypt");
const User = require("../../models/UserModel");

const router = express.Router();
const authMiddleware = require("../authMiddleware");

const mongoose = require('mongoose');

// API USER:  /api/user
// signup: POST /signup (username, password, email)
// change-password: POST /change-password (email, oldPassword, newPassword)
// login: POST /login (email, password)

// POST /account/refresh-token

const ACCESS_SECRET  = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, password, email } = req.body;
 
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
        }   
        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu cần có ít nhất 6 ký tự." });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, email, description: "" });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error server!" });
    }
});

// Change password
router.post("/change-password", async (req, res) => {   
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "All is required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password required at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Username not found!" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect!" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Change password successful!" });
    } catch (error) {
        console.error("Error during change password:", error);
        res.status(500).json({ message: "Error server!", error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            ACCESS_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
            REFRESH_SECRET,
            { expiresIn: '30d' }
        );
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.status(200).json(
            {   message: "Đăng nhập thành công!", 
                accessToken,
                refreshToken
            });    
        } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error server!", error: error.message });
    }
});

// POST /account/refresh-token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      ACCESS_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
});


router.post("/progress", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, videoId } = req.body;
  
        if (!courseId || !videoId) {
            return res.status(400).json({ message: "courseId và videoId là bắt buộc." });
        }

        const courseObjectId = new mongoose.Types.ObjectId(courseId);
  
        const user = await User.findOne({
            _id: userId,
            "ownedCourses.courseId": courseObjectId,
        });

        if (!user) {
            return res.status(404).json({ message: "User chưa đăng ký khóa học này." });
        }

        // Thêm videoId nếu chưa có & cập nhật lastWatchedVideo
        await User.updateOne(
            {
                _id: userId,
                "ownedCourses.courseId": courseObjectId,
                "ownedCourses.completedVideos": { $ne: videoId }, // đảm bảo chưa có videoId
            },
            {
                $push: { "ownedCourses.$.completedVideos": videoId },
                $set: { "ownedCourses.$.lastWatchedVideo": videoId },
            }
        );

        await User.updateOne(
            {
                _id: userId,
                "ownedCourses.courseId": courseObjectId,
            },
            {
                $set: { "ownedCourses.$.lastWatchedVideo": videoId },
            }
        );
  
        res.status(200).json({ message: "Cập nhật tiến độ thành công." });
    } catch (error) {
        console.error("Lỗi khi cập nhật tiến độ:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
  });

// Get User Info
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId});

        res.status(200).json(user);
    } catch (error) {
        console.log("Error getting user:", error);
        res.status(500).json({ message: "Server error!", error: error.message});
    }
})



module.exports = router;


