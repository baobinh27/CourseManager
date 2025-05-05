const jwt = require("jsonwebtoken");
const User = require('../models/UserModel');

const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Token không hợp lệ, tiếp tục như khách.");
            return next();
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not defined in environment');

        // Verify token
        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.userId).select('-password');

        if (user) {
            req.user = user;
        } else {
            console.log("Token hợp lệ nhưng người dùng không tồn tại, tiếp tục như khách.");
        }
        // req.user = user;   // add user to request object
    } catch (err) {
        console.log("Token không hợp lệ, tiếp tục như khách.");
    }
    next();
};

module.exports = optionalAuthMiddleware;
