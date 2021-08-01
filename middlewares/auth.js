const jwt = require("jsonwebtoken");
const config = require("config");
const logger = require("../helpers/logger");

/**
 * Middleware to handle authrazation on protected routes
 */
module.exports = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied! no token provided");
  }

  try {
    const decodedToken = jwt.verify(token, config.get("jwtPKey"));
    req.user = decodedToken;
    next();
  } catch (e) {
    res.status(400).send("Invalid token");
  }
};
