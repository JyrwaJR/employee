import { http } from '@utils/api';

/** Severity levels supported by the logger. */
type ErrorType = 'ERROR' | 'INFO' | 'WARN' | 'LOG';

/**
 * Sends a log entry to the remote logging server.
 *
 * The entry includes the severity type, message, serialised content, and a
 * timestamp. Failures are silently caught to avoid disrupting the app flow.
 *
 * @param type    - The severity level.
 * @param message - A short identifier or summary for the log entry.
 * @param content - The serialised log data (JSON string).
 */
const sendLogToServer = async (type: ErrorType, message: string, content: string) => {
  const logEntry = {
    type,
    message,
    content,
    timestamp: new Date().toISOString(),
  };

  try {
    console.log(logEntry);
    await http.post('/logs', logEntry);
  } catch (error) {
    console.log('Failed to send logs to server', error);
  }
};

/**
 * Formats log arguments into a structured string with timestamp and severity.
 *
 * Supports one or two arguments: a single value (logged as-is or JSON-stringified),
 * or a pair consisting of a message and a data object.
 *
 * @param type - The severity level.
 * @param args - One or two arguments: a value, or (message, data) pair.
 * @returns A formatted log line.
 */
const formatData = (type: ErrorType, ...args: any[]): string => {
  const timestamp = new Date().toISOString();
  let content: string;
  if (args.length === 1) {
    content = typeof args[0] === 'string' ? args[0] : JSON.stringify(args[0], null, 3);
  } else {
    const [message, data] = args;
    content =
      typeof message === 'string'
        ? `${message} ${data ? JSON.stringify(data, null, 3) : ''}`
        : JSON.stringify(message, null, 3);
  }
  return `[${timestamp}] [${type}]: ${content}`;
};

/**
 * Core logging method that dispatches to both the console and the remote server.
 *
 * - In **development**, logs are written to the console.
 * - In **production**, only non-`LOG` levels (`ERROR`, `INFO`, `WARN`) are sent
 *   to the remote logging server.
 *
 * @param type - The severity level.
 * @param args - Arguments forwarded from the public logger methods.
 */
const logMethod = async (type: ErrorType, ...args: any[]): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    console.log(formatData(type, ...args));
  }

  if (process.env.NODE_ENV === 'production' && type !== 'LOG') {
    try {
      let message: string;
      let content: string;

      if (args.length === 0) {
        message = '';
        content = '';
      } else if (args.length === 1) {
        if (typeof args[0] === 'string') {
          message = args[0];
          content = args[0];
        } else {
          const json = JSON.stringify(args[0]);
          message = json;
          content = json;
        }
      } else {
        const [msg, data] = args;
        message = typeof msg === 'string' ? msg : JSON.stringify(msg);
        content = JSON.stringify(data);
      }

      await sendLogToServer(type, message, content);
    } catch {
      console.log(`Failed to send ${type.toLowerCase()} logs to server`);
    }
  }
};

/**
 * Application-wide logger with remote server support.
 *
 * Provides `error`, `info`, `warn`, and `log` methods. In development mode
 * output goes to the console; in production, `ERROR`, `INFO`, and `WARN`
 * entries are also sent to the remote logging endpoint.
 *
 * @example
 * ```ts
 * logger.error('Payment failed', { orderId: '123' });
 * logger.info('User logged in', userId);
 * ```
 */
export const logger = {
  /** Logs an error-level message. */
  error: (...args: any[]) => logMethod('ERROR', ...args),
  /** Logs an info-level message. */
  info: (...args: any[]) => logMethod('INFO', ...args),
  /** Logs a warning-level message. */
  warn: (...args: any[]) => logMethod('WARN', ...args),
  /** Logs a debug-level message (console-only in development). */
  log: (...args: any[]) => logMethod('LOG', ...args),
};
