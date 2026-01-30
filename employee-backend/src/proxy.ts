import { stackMiddlewares } from "./utils/middleware/middleware";
import { withApiAuth } from "./utils/middleware/withApiAuth";
import { withCORS } from "./utils/middleware/withCORS";
import { withLogging } from "./utils/middleware/withLogging";
import { withRateLimiting } from "./utils/middleware/withRateLimiting";
import { withSecurityHeaders } from "./utils/middleware/withSecurityHeader";

const middlewares = [
  withCORS,
  withRateLimiting,
  withSecurityHeaders,
  withApiAuth,
  withLogging,
];

export default stackMiddlewares(middlewares);

export const config = {
  matcher: "/api/:path*",
};
