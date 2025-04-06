const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// const api = require('./api');

dotenv.config();

connectDB();

const app = express();
app.use(express.json()); 
app.use(cors());

// Routes
app.use("/api/user", require("./routes/UserAPI"));

const PORT = process.env.PORT_BE;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
