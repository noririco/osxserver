const mongoose = require("mongoose");
const logger = require("./logger");
require("express-async-errors");

async function Connect(connString) {
  try {
    await mongoose
      .connect(connString, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => logger.info("Connected to mongodb.."));
  } catch (e) {
    logger.error("Connection to mongodb failed", e);
    process.exit(1);
  }
}

module.exports = Connect;
