let winston = require("winston");
let logsPath = "./";
const { timestamp } = winston.format;

let options = {
  file: {
    format: timestamp(),
    level: "info",
    filename: logsPath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: true,
  },
  console: {
    format: timestamp(),
    level: "info",
    json: true,
    colorize: true,
    handleExceptions: true,
  },
};

const logger = winston.createLogger({
  transports: [
    // new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
});

module.exports.logger = logger;
