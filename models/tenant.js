const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const logger = require("../helpers/logger");

const nameMinLength = 2;
const phoneNumberMinLength = 9;
const phoneNumberMaxLength = 20;
const addressMinLength = 5;

const tenantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: nameMinLength,
    },
    phone_number: {
      type: String,
      required: true,
      minlength: phoneNumberMinLength,
      maxlength: phoneNumberMaxLength,
    },
    address: {
      type: String,
      required: true,
      minlength: addressMinLength,
    },
    debt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

tenantSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret.__v;
    return ret;
  },
};

// corresponds to the "tenants" collection
const Tenant = mongoose.model("Tenant", tenantSchema);

const validateTenant = (tenant) => {
  const schema = Joi.object({
    // _id: Joi.ObjectId(),
    name: Joi.string().min(nameMinLength).required(),
    phone_number: Joi.string()
      .min(phoneNumberMinLength)
      .max(phoneNumberMaxLength)
      .required(),
    address: Joi.string().min(addressMinLength).required(),
    debt: Joi.number(),
  });

  return schema.validate(tenant);
};

exports.Tenant = Tenant;
exports.validate = validateTenant;
