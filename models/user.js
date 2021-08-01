const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const logger = require("../helpers/logger");

const nameMinLength = 3;
const nameMaxLength = 128;
const passwordMinLength = 8;
const passwordMaxLength = 1024;

const userSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
      minlength: nameMinLength,
      maxlength: nameMaxLength,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
      minlength: passwordMinLength,
      maxlength: passwordMaxLength,
    },
    tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tenant" }],
  },
  { timestamps: true }
);

//https://stackoverflow.com/questions/14588032/mongoose-password-hashing
//Used to generate a User in the database instead of registeration
userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// define custom methods
userSchema.methods.generateAuthToken = function () {
  //   logger.info(`generateAuthToken ${this._id}`);
  const token = jwt.sign({ _id: this._id }, config.get("jwtPKey"), {
    expiresIn: 120,
  });
  return token;
};

userSchema.methods.comparePassword = async function comparePassword(data) {
  return bcrypt.compare(data, this.password);
};

// corresponds to the "users" collection
const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(nameMinLength).max(nameMaxLength).required(),
    password: Joi.string()
      .min(passwordMinLength)
      .max(passwordMaxLength)
      .required(),
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
