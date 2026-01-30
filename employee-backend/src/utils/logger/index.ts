// import { addLogsToDB } from "@services/logs/addLogsToDB";
import http from "../http";

type ErrorType = "ERROR" | "INFO" | "WARN" | "LOG";

// Send logs to server for frontend usage
export const sendLogToServer = async <T>(type: ErrorType, data: T) => {
  const logEntry = {
    type,
    content: typeof data === "string" ? data : JSON.stringify(data),
    timestamp: new Date().toISOString(),
  };

  try {
    await http.post("/logs", logEntry); // send object; HTTP client converts to JSON
  } catch (error) {
    console.error("Failed to send logs to server", error);
  }
};

// Compose content combining string message and optional object argument
// eslint-disable-next-line
const formatData = (type: ErrorType, ...args: any[]): string => {
  const timestamp = new Date().toISOString();
  let content: string;
  if (args.length === 1) {
    content =
      typeof args[0] === "string" ? args[0] : JSON.stringify(args[0], null, 3);
  } else {
    const [message, data] = args;
    content =
      typeof message === "string"
        ? `${message} ${data ? JSON.stringify(data, null, 3) : ""}`
        : JSON.stringify(message, null, 3);
  }
  return `[${timestamp}] [${type}]: ${content}`;
};

// eslint-disable-next-line
const logMethod = async (type: ErrorType, ...args: any[]): Promise<void> => {
  if (process.env.NODE_ENV === "development") {
    console.log(formatData(type, ...args));
  }

  if (process.env.NODE_ENV === "production") {
    try {
      let message: string;
      let content: string;

      if (args.length === 1) {
        message =
          typeof args[0] === "string" ? args[0] : JSON.stringify(args[0]);
        content = message; // if no extra data, content = message
      } else {
        const [msg, data] = args;
        message = typeof msg === "string" ? msg : JSON.stringify(msg);
        content = data ? JSON.stringify(data) : message; // content is just the extra data or fallback
      }

      if (type !== "LOG") {
        // Logging to server
      }
    } catch (error) {
      console.error("Failed to save logs to database");
    }
  }
};

export const logger = {
  // eslint-disable-next-line
  error: (...args: any[]) => logMethod("ERROR", ...args),
  // eslint-disable-next-line
  info: (...args: any[]) => logMethod("INFO", ...args),
  // eslint-disable-next-line
  warn: (...args: any[]) => logMethod("WARN", ...args),
  // eslint-disable-next-line
  log: (...args: any[]) => logMethod("LOG", ...args),
};
