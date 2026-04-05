// Simple logger utility for the backend.
// Can be later replaced with more robust loggers like 'winston' or 'pino'.

const log = (message, level = 'INFO') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
};

module.exports = {
  info: (msg) => log(msg, 'INFO'),
  error: (msg) => log(msg, 'ERROR'),
  warn: (msg) => log(msg, 'WARN')
};
