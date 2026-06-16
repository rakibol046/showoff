const router = require("express").Router();
const ctrl = require("./dashboard.controller");

router.get("/stats", ctrl.getDashboardStats);

module.exports = router;
