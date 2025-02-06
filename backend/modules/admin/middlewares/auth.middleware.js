const Admin = require("../../../models/admin.model");

module.exports = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
      status: error.message,
      error: true,
    });
  }
};
