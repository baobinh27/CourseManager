const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/UserModel");

const router = express.Router();

// Đăng ký 
router.post("/signup", async (req, res) => {
    try {
        const { username, password, description } = req.body;

        // Kiểm tra dữ liệu đầu vào 
        if (!username || !password || !description) {
            return res.status(400).json({ message: "Tất cả các trường là bắt buộc!" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
        }

        // Kiểm tra username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username đã tồn tại!" });

        // Mã hoá mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({ username, password: hashedPassword, description });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// Đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra đầu vào
        if (!username || !password) {
            return res.status(400).json({ message: "Tên đăng nhập và mật khẩu là bắt buộc!" });
        }

        // Tìm người dùng theo username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        // Đăng nhập thành công
        res.status(200).json({ message: "Đăng nhập thành công!" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});


module.exports = router;


