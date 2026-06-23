const router = require("express").Router();
const ctrl = require("./customer.controller");

router.get("/", ctrl.getCustomers);
router.get("/:id", ctrl.getCustomer);
router.patch("/:id/status", ctrl.toggleCustomerStatus);

module.exports = router;
