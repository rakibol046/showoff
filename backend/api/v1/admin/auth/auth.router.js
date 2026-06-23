const router = require("express").Router();
const ctrl = require("./auth.controller");
const adminAuth = require("../../../../middlewares/auth.middleware");
const upload = require("../../../../utils/upload");

router.post("/signin", ctrl.signIn);
router.get("/profile", adminAuth, ctrl.getProfile);
router.patch("/profile", adminAuth, upload.single("profile_picture"), ctrl.updateProfile);
router.patch("/password", adminAuth, ctrl.changePassword);

module.exports = router;
