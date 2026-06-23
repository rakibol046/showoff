const mongoose = require("mongoose");
const logger = require("./logger");

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.info("MongoDB connected");
};

mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
mongoose.connection.on("reconnected",  () => logger.info("MongoDB reconnected"));
mongoose.connection.on("error",        (err) => logger.error(`MongoDB error: ${err.message}`));

module.exports = { connect };
