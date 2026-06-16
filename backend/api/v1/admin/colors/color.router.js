const router = require("express").Router();
const ctrl = require("./color.controller");

router.get("/", ctrl.getColors);
router.post("/", ctrl.createColor);
router.delete("/bulk", ctrl.bulkDeleteColors);
router.get("/:id", ctrl.getColor);
router.put("/:id", ctrl.updateColor);
router.patch("/:id/status", ctrl.toggleStatus);
router.delete("/:id", ctrl.deleteColor);

module.exports = router;
