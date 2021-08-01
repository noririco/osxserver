const logger = require("./logger");
require("express-async-errors");

module.exports = () => {
  process.on("uncaughtException", (e) => {
    logger.error(e.message, e);
    process.exit(1);
  });
  process.on("unhandledRejection", (e) => {
    logger.error(e.message, e);
    process.exit(1);
  });
};
