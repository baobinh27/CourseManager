const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/UserModel");

const router = express.Router();

// API USER:  /api/user
// signup: POST /signup (username, password, description)
// change-password: POST /change-password (username, oldPassword, newPassword)
// login: POST /login (username, password)

// Sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, password, description } = req.body;
 
        if (!username || !password || !description) {
            return res.status(400).json({ message: "All is required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password required at least 6 characters" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username is existed!" });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, description });
        await newUser.save();

        res.status(201).json({ message: "Sign up successful!" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error server!" });
    }
});

// Change password
router.post("/change-password", async (req, res) => {   
    try {
        const { username, oldPassword, newPassword } = req.body;

        if (!username || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "All is required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password required at least 6 characters" });
        }

        const user = await User.findOne({ username });
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
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All is required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Username or password is not correct!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Username or password is not correct!" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error server!", error: error.message });
    }
});


module.exports = router;


