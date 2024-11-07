const express = require("express");
const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");

const getSession = async (token) => {
    try {
      const email = await redisClient.get(`session:${token}`);
      return email;
    } catch (err) {
      console.error("Error fetching session from Redis:", err);
      throw err;
    }
  };

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    console.log("Token:", token);

    const decoded = jwt.verify(token, "JWT_SECRET");
    req.user = decoded;

    console.log("Decoded JWT:", decoded);

    const email = await getSession(token);

    console.log("Session email:", email);

    if (!email) {
      return res.status(401).json({ message: "Invalid session" });
    }

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = authMiddleware;
