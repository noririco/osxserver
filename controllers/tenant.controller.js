const logger = require("../helpers/logger");

const { Tenant, validate } = require("../models/tenant");
const { User } = require("../models/user");

const create = async (req, res, next) => {
  const { error } = validate(req.body);

  if (error) return res.status(422).send(error.details[0].message);

  const _tenant = req.body;
  // logger.info(`create tenant ${JSON.stringify(_tenant)}`);

  const tenant = new Tenant({
    name: _tenant.name,
    phone_number: _tenant.phone_number,
    address: _tenant.address,
  });

  if (_tenant.debt) {
    tenant.debt = _tenant.debt;
  }

  // logger.info(`create tenant ${JSON.stringify(tenant)}`);

  const user = await User.findOne({ _id: req.user._id });

  user.tenants.push(tenant);

  const userUpdatedWithTenant = await user.save();

  if (!userUpdatedWithTenant) return res.status(404).send("User was not saved");
  // logger.info(`create tenant2 ${JSON.stringify(userUpdatedWithTenant)}`);

  const savedTenant = await tenant.save();
  if (!savedTenant) return res.status(404).send("Tenant was not saved");
  // // returns tenant that have the User's id.
  // logger.info(`create tenant2 ${JSON.stringify(savedTenant)}`);

  res.json(savedTenant);
};

const getAll = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate("tenants");

    if (!user) res.status(404).send("User wasnt found");

    // logger.info(`getAll _ts ${JSON.stringify(user)}`);

    res.json(user.tenants);
  } catch (err) {
    logger.error(`getAll fail ${err}`);
  }
};

const getOne = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: "tenants",
      match: { _id: { $eq: req.params.id } },
    });

    if (!user) res.status(404).send("User wasnt found");
    logger.info(`getOne ${JSON.stringify(user)}`);

    if (user.tenants.length === 0 || user.tenants.length > 1)
      res.status(404).send("Tenant wasnt found");
    res.json(user.tenants[0]);
  } catch (error) {
    logger.error(`getOne fail ${error}`);
  }
};

/**
 * retrieve the tenant from the user
 * update its fields
 * save to db
 */
const update = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: "tenants",
      match: { _id: { $eq: req.params.id } },
    });

    if (!user) res.status(404).send("User wasnt found");

    if (user.tenants.length === 0 || user.tenants.length > 1)
      res.status(404).send("Tenant wasnt found");

    const tenant = user.tenants[0];

    const partial = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      address: req.body.address,
      debt: req.body.debt,
    };
    const { error } = validate(partial);

    if (error)
      return res.status(422).json({
        success: false,
        message: error.details[0].message,
      });

    tenant.name = req.body.name;
    tenant.phone_number = req.body.phone_number;
    tenant.address = req.body.address;
    tenant.debt = req.body.debt;

    const updated = await tenant.save();
    res.json(updated);
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      message: "tenant was not saved",
    });
  }
};

/**
 * remove the ref to the tenant from the User tenants array
 * remove the tenant
 */
const remove = async (req, res, next) => {
  logger.info(`delete tenant ${req.params.id}`);
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: {
          tenants: req.params.id,
        },
      }
    );

    const del = await Tenant.deleteOne({
      _id: req.params.id,
    });
    logger.info(`delete tenant ${JSON.stringify(del)}`);
    if (del.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "tenant was not deleted",
      });
    }
    res.json({
      success: true,
      message: "tenant deleted successfully",
    });
  } catch (error) {
    logger.error(`delete tenant ${err}`);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
