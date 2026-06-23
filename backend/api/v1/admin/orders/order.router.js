const router = require("express").Router();
const ctrl = require("./order.controller");

router.get("/", ctrl.getOrders);
router.post("/", ctrl.createOrder);
router.get("/:id", ctrl.getOrder);
router.patch("/:id/status", ctrl.updateOrderStatus);
router.patch("/:id/payment", ctrl.updatePaymentStatus);

module.exports = router;
