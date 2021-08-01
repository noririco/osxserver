const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const { PORT, HOST, HOST_URL } = process.env;

assert(PORT, "POST required");
assert(HOST, "POST required");

module.exports = {
  PORT: PORT,
  HOST: HOST,
  HOST_URL: HOST_URL,
};
