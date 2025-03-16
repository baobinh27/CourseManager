const express = require("express");
const cors = require("cors");
const api = require('./api');
const app = express();
const PORT = 5000;

app.use(express.json()); // Xử lý JSON body
app.use(cors());

app.use('/api', api)

// Khởi động server
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));