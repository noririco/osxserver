const logger = require("../helpers/logger");

// simple error handler to catch global errors
module.exports = (err, req, res, next) => {
  logger.error(err);
  res.sendStatus(500).send("Internal Server Error");
};
