const router = require("express").Router();
const ctrl = require("./auth.controller");
const customerAuth = require("../../../../middlewares/customerAuth.middleware");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", customerAuth, ctrl.getMe);

module.exports = router;
