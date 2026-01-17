const Admin = require("../../../models/admin.model");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Authorization Header not found");
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authorization Token not found");
    }

    const decodeToken =
      req.decodeToken || (await jwt.verify(token, process.env.JWT_SECRET));
    if (!decodeToken) {
      throw new Error("Token is not valid, add valid token");
    }

    const _id = decodeToken.id;
    const email = decodeToken.email;

    const adminData = {
      email: email,
      id: _id,
    };

    let adminExist = await Admin.findOne({ _id, email });

    if (!adminExist) {
      throw new Error("You don't have access!");
    }
    console.log("auth check successful");

    req.adminData = adminData;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
      status: error.message,
      error: true,
    });
  }
};
