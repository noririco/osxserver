const express = require("express");
const logger = require("./helpers/logger");
const cors = require("cors");
const environment = require("./environment");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/auth.route");
const tenantRoutes = require("./routes/tenant.route");
const { User } = require("./models/user");

async function main() {
  const app = express();
  require("./helpers/config")();
  require("./helpers/exp")();

  //Change this to your own connection string
  await require("./helpers/db")("mongodb://localhost/osx");
  require("./helpers/validation")();

  app.use(express.json());

  //No limitation only for demonstration
  app.use(cors());

  app.use("/api", authRoutes);
  app.use("/api", tenantRoutes);

  app.use(errorHandler);

  //Use this to add a new user if not exist on the database
  // create a user a new user
  // var testUser = new User({
  //   name: "demo",
  //   password: "helloosx",
  // });

  // // save the user to database
  // testUser.save(function (err) {
  //   if (err) throw err;
  // });

  // start server
  await app.listen(environment.PORT, () => {
    logger.info(`app listeing on port: ${environment.PORT}`);
  });
}
main();
