const express = require("express");
const authenticate = require("../middlewares/auth");
const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/tenant.controller");
const router = express.Router();

router.post("/tenant", authenticate, create);
router.get("/tenants", authenticate, getAll);
router.get("/tenant/:id", authenticate, getOne);
router.put("/tenant/:id", authenticate, update);
router.delete("/tenant/:id", authenticate, remove);

// // Add Tenant
// router.route("/create").post((req, res, next) => {
//   Tenant.create(req.body, authenticate, (error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

// // Get All Tenants
// router.route("/").get((req, res) => {
//   Tenant.find((error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

// // Get single Tenant
// router.route("/read/:id").get((req, res) => {
//   Tenant.findById(req.params.id, (error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

// // Update Tenant
// router.route("/update/:id").put((req, res, next) => {
//   Tenant.findByIdAndUpdate(
//     req.params.id,
//     {
//       $set: req.body,
//     },
//     (error, data) => {
//       if (error) {
//         return next(error);
//         console.log(error);
//       } else {
//         res.json(data);
//         console.log("Data updated successfully");
//       }
//     }
//   );
// });

// // Delete Tenant
// router.route("/delete/:id").delete((req, res, next) => {
//   Tenant.findOneAndRemove(req.params.id, (error, data) => {
//     if (error) {
//       return next(error);
//     } else {
//       res.status(200).json({
//         msg: data,
//       });
//     }
//   });
// });

module.exports = router;
