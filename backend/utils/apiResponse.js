const sendSuccess = (res, data = null, message = "Success", meta = null, statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const sendError = (res, statusCode = 500, message = "Internal server error", error = null) => {
  const payload = { success: false, message };
  if (error && process.env.NODE_ENV !== "production") payload.error = error;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
