const router = require("express").Router();
const ctrl = require("./dashboard.controller");

router.get("/stats", ctrl.getDashboardStats);
router.get("/sales-report", ctrl.getSalesReport);

module.exports = router;
