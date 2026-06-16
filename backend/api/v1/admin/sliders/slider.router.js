const router = require("express").Router();
const ctrl = require("./slider.controller");
const upload = require("../../../../utils/upload");

router.get("/", ctrl.getSliders);
router.post("/", upload.single("image"), ctrl.createSlider);
router.get("/:id", ctrl.getSlider);
router.put("/:id", upload.single("image"), ctrl.updateSlider);
router.patch("/:id/status", ctrl.toggleStatus);
router.delete("/:id", ctrl.deleteSlider);

module.exports = router;
