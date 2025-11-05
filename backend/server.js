require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);


app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

const { protect } = require("./middlewares/authMiddleware");
const { authorizeRole } = require("./middlewares/authMiddleware");

app.get("/api/driver/data", protect, authorizeRole("driver"), (req, res) => {
  res.json({ message: "driver content", user: req.user });
});

app.get(
  "/api/business/data",
  protect,
  authorizeRole("business"),
  (req, res) => {
    res.json({ message: "business content", user: req.user });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
