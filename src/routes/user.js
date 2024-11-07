const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redisClient = require("../redisClient");
const authMiddleware = require("../middleware/authMiddleware");

const users = {};

const userRoute = express.Router();

userRoute.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (users[email]) {
    return res.status(400).json({ message: "Email already registered" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users[email] = { password: hashedPassword };

  res.status(201).json({ message: "User created successfully" });
});

console.log(users);

userRoute.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = users[email];
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const decodedPassword = await bcrypt.compare(password, user.password);
  if (!decodedPassword) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ email }, "JWT_SECRET", { expiresIn: "1h" });

  redisClient.setEx(`session:${token}`, 3600, email, (err, reply) => {
    if (err) {
      console.error("Error setting session:", err);
    } else {
      console.log("Session set:", reply);
    }
  });

  res.json({ message: "Login successful", token });
});

userRoute.post("/logout", authMiddleware, (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(`Logging out user with token: ${token}`);

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  redisClient.del(`session:${token}`, (err, reply) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    if (reply === 0) {
      console.log(`Session not found for token: ${token}`);
      return res.status(400).json({ message: "No session found" });
    }
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = userRoute;
