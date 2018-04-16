/**
 * @fileOverview Logger Utility monitors and logs all output to info.log
 * for debugging and app control
 */
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf } = format;

/**
 * @constant {string} Format - This is the format fo logs piped into info.log
 */
const myFormat = printf(info => `
  ${info.timestamp} [${info.label}] ${info.level}: ${info.message}
`);

/**
 * @description
 * Export the logger object to log outputs to `${info.log}
 * @exports Logger.createLogger
 */
export default createLogger({
  format: combine(
    label({ label: 'Log to File' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({filename: 'info.log'})
  ]
});