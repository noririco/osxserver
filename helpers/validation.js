const Joi = require("joi");

/**
 * If we want to validate ObjectId
 *
 * @example
 * const schema = Joi.object({
 * id: Joi.objectId(),
 * name: Joi.string().max(100),
 * date: Joi.date()
 *})
 */
module.exports = () => {
  Joi.objectId = require("joi-objectid")(Joi);
};
