const router = require("express").Router();
const ctrl = require("./size.controller");

router.get("/", ctrl.getSizes);
router.post("/", ctrl.createSize);
router.delete("/bulk", ctrl.bulkDeleteSizes);
router.get("/:id", ctrl.getSize);
router.put("/:id", ctrl.updateSize);
router.patch("/:id/status", ctrl.toggleStatus);
router.delete("/:id", ctrl.deleteSize);

module.exports = router;
