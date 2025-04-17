const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/UserModel");

const router = express.Router();

// API USER:  /api/user
// signup: POST /signup (username, password, email)
// change-password: POST /change-password (email, oldPassword, newPassword)
// login: POST /login (email, password)

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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }
        // jwt after login
        const jwt = require("jsonwebtoken");

        // Sinh token kèm payload { userId }
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || "SECRET_KEY",
            { expiresIn: "1d" }
        );
        res.status(200).json(
            {   message: "Đăng nhập thành công!", 
                token,
            });    
        } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error server!", error: error.message });
    }
});


module.exports = router;


