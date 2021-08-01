const config = require("config");

module.exports = () => {
  if (!config.get("jwtPKey")) {
    throw new Error("jwtPKey is not defined!");
  }
};
