const logger = require("../helpers/logger");
const { User, validate } = require("../models/user");

const login = async (req, res, next) => {
  const { error } = validate(req.body);

  if (error) return res.status(422).send(error.details[0].message);

  const user = await User.findOne({ name: req.body.name }).exec();

  if (!user) return res.status(404).send("Invalid name or password");

  const isValidPassword = await user.comparePassword(req.body.password);

  if (!isValidPassword) return res.status(404).send("Invalid name or password");

  const token = user.generateAuthToken();

  // logger.info(`User ${JSON.stringify(user)} logged in`);
  logger.info(`User ${user.name} logged in`);
  res.status(200).json({
    token: token,
    expiresIn: 120, //sec
  });
};

const logout = async (req, res, next) => {
  /**
   * Logging out using JWT is not a trivial task,
   * There are some solutions to handle invalidating of the token,
   * such has refresh token,
   * For the sake of simplicity we just pass via server but
   * from the client side we remove the token from local storage
   */
  logger.info(`User logged out`);
  res.status(200).json({
    success: true,
    message: "user logged out successfully",
  });
};

module.exports = {
  login,
  logout,
};
