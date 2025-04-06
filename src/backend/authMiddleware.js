const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    // Gán userId vào req.user để các API sau có thể truy cập
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");

// Sau khi xác thực thành công:
// const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "1d" });
// res.json({ token });
