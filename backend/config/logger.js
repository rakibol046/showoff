const isDev = process.env.NODE_ENV !== "production";

const LEVELS = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };

const COLORS = {
  error: "\x1b[31m",   // red
  warn:  "\x1b[33m",   // yellow
  info:  "\x1b[32m",   // green
  http:  "\x1b[36m",   // cyan
  debug: "\x1b[35m",   // magenta
  reset: "\x1b[0m",
  dim:   "\x1b[2m",
};

const pad = (n) => String(n).padStart(2, "0");

const timestamp = () => {
  const d = new Date();
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

const format = (level, message) => {
  if (!isDev) {
    return JSON.stringify({ level, message, timestamp: new Date().toISOString() });
  }
  const color = COLORS[level] || "";
  const label = level.toUpperCase().padEnd(5);
  return `${COLORS.dim}[${timestamp()}]${COLORS.reset} ${color}${label}${COLORS.reset}  ${message}`;
};

const activeLevel = LEVELS[process.env.LOG_LEVEL] ?? (isDev ? LEVELS.debug : LEVELS.info);

const logger = {
  error: (msg) => LEVELS.error <= activeLevel && console.error(format("error", msg)),
  warn:  (msg) => LEVELS.warn  <= activeLevel && console.warn(format("warn",  msg)),
  info:  (msg) => LEVELS.info  <= activeLevel && console.log(format("info",   msg)),
  http:  (msg) => LEVELS.http  <= activeLevel && console.log(format("http",   msg)),
  debug: (msg) => LEVELS.debug <= activeLevel && console.log(format("debug",  msg)),
};

module.exports = logger;
