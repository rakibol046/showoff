const express = require("express");
const router = express.Router();
const Color = require("../../../models/color.model");

// ─── Validate hex color ───────────────────────────────────────────────────────
const isValidHex = (hex) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);

// ─── GET all colors ───────────────────────────────────────────────────────────
// GET /api/colors
// Query params: ?status=true|false  (optional filter)
router.get("/", async (req, res) => {
    console.log("GET /api/colors called with query:");
  try {
    const filter = {};
    if (req.query.status !== undefined) {
      filter.status = req.query.status === "true";
    }

    const colors = await Color.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: colors.length,
      data: colors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── GET single color ─────────────────────────────────────────────────────────
// GET /api/colors/:id
router.get("/:id", async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    }
    res.status(200).json({ success: true, data: color });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── CREATE color ─────────────────────────────────────────────────────────────
// POST /api/colors
// Body: { name, value, hex, status }
router.post("/", async (req, res) => {
  try {
    const { name, value, hex, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Color name is required" });
    }
    if (!hex) {
      return res
        .status(400)
        .json({ success: false, message: "Hex code is required" });
    }
    if (!isValidHex(hex)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid hex color code (e.g. #FF0000)" });
    }

    const existing = await Color.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "A color with this name already exists" });
    }

    const color = await Color.create({ name, value, hex, status });
    res.status(201).json({ success: true, data: color });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "A color with this name already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── UPDATE color ─────────────────────────────────────────────────────────────
// PUT /api/colors/:id
// Body: any subset of { name, value, hex, status }
router.put("/:id", async (req, res) => {
  try {
    const { name, value, hex, status } = req.body;

    if (hex && !isValidHex(hex)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid hex color code (e.g. #FF0000)" });
    }

    if (name) {
      const existing = await Color.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "A color with this name already exists" });
      }
    }

    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { name, value, hex, status },
      { new: true, runValidators: true }
    );

    if (!color) {
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    }

    res.status(200).json({ success: true, data: color });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "A color with this name already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── TOGGLE status ────────────────────────────────────────────────────────────
// PATCH /api/colors/:id/toggle-status
router.patch("/:id/toggle-status", async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    }

    color.status = !color.status;
    await color.save();

    res.status(200).json({ success: true, data: color });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── DELETE color ─────────────────────────────────────────────────────────────
// DELETE /api/colors/:id
router.delete("/:id", async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) {
      return res
        .status(404)
        .json({ success: false, message: "Color not found" });
    }
    res.status(200).json({ success: true, message: "Color deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── BULK DELETE ──────────────────────────────────────────────────────────────
// DELETE /api/colors
// Body: { ids: ["id1", "id2", ...] }
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Provide an array of IDs to delete" });
    }

    const result = await Color.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} color(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;