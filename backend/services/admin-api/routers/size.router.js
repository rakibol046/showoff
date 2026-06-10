const express = require("express");
const router = express.Router();
const Size = require("../../../models/size.model");

// ─── GET all sizes ────────────────────────────────────────────────────────────
// GET /api/sizes
// Query params: ?status=true|false  (optional filter)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status !== undefined) {
      filter.status = req.query.status === "true";
    }

    const sizes = await Size.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: sizes.length,
      data: sizes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── GET single size ──────────────────────────────────────────────────────────
// GET /api/sizes/:id
router.get("/:id", async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) {
      return res
        .status(404)
        .json({ success: false, message: "Size not found" });
    }
    res.status(200).json({ success: true, data: size });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── CREATE size ──────────────────────────────────────────────────────────────
// POST /api/sizes
// Body: { name, label, measurements: { chest, waist, length }, status }
router.post("/", async (req, res) => {
  try {
    const { name, label, measurements, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Size name is required" });
    }

    const existing = await Size.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "A size with this name already exists" });
    }

    const size = await Size.create({ name, label, measurements, status });
    res.status(201).json({ success: true, data: size });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "A size with this name already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── UPDATE size ──────────────────────────────────────────────────────────────
// PUT /api/sizes/:id
// Body: any subset of { name, label, measurements, status }
router.put("/:id", async (req, res) => {
  try {
    const { name, label, measurements, status } = req.body;

    // If renaming, check for duplicate
    if (name) {
      const existing = await Size.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "A size with this name already exists" });
      }
    }

    const size = await Size.findByIdAndUpdate(
      req.params.id,
      { name, label, measurements, status },
      { new: true, runValidators: true }
    );

    if (!size) {
      return res
        .status(404)
        .json({ success: false, message: "Size not found" });
    }

    res.status(200).json({ success: true, data: size });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "A size with this name already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── TOGGLE status ────────────────────────────────────────────────────────────
// PATCH /api/sizes/:id/toggle-status
router.patch("/:id/toggle-status", async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) {
      return res
        .status(404)
        .json({ success: false, message: "Size not found" });
    }

    size.status = !size.status;
    await size.save();

    res.status(200).json({ success: true, data: size });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── DELETE size ──────────────────────────────────────────────────────────────
// DELETE /api/sizes/:id
router.delete("/:id", async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    if (!size) {
      return res
        .status(404)
        .json({ success: false, message: "Size not found" });
    }
    res.status(200).json({ success: true, message: "Size deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─── BULK DELETE ──────────────────────────────────────────────────────────────
// DELETE /api/sizes
// Body: { ids: ["id1", "id2", ...] }
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Provide an array of IDs to delete" });
    }

    const result = await Size.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} size(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;