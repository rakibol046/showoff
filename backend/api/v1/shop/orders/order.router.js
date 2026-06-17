const router = require("express").Router();
const ctrl = require("./order.controller");
const customerAuth = require("../../../../middlewares/customerAuth.middleware");

// Optional auth — guest checkout allowed; customer_id attached if token present
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return next();
  customerAuth(req, res, next);
};

router.post("/", optionalAuth, ctrl.placeOrder);
router.get("/my", customerAuth, ctrl.getMyOrders);
router.get("/:id", customerAuth, ctrl.getMyOrder);

module.exports = router;
