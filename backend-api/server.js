const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(express.json()); // Xử lý JSON body
app.use(cors()); // Cho phép frontend truy cập API

// Danh sách người dùng giả lập
let users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com"}
];

// API lấy danh sách người dùng
app.get("/api/users", (req, res) => {
    res.json(users);
});


// Khởi động server
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));