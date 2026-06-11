import crypto from 'crypto';
import { appContext } from '../config/appContext.js';

export const activeTraces = new Map();

export function tracingMiddleware(req, res, next) {
  // Use existing header if provided (useful for tracing across services)
  // Otherwise, generate a new UUID for this request
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();

  // Expose on the request and response objects for immediate access if needed
  req.reqId = reqId;
  res.setHeader('X-Request-ID', reqId);

  const traceEntry = {
    reqId,
    method: req.method,
    url: req.originalUrl || req.url,
    startTime: Date.now(),
    queries: [],
    duration: 0
  };

  activeTraces.set(reqId, traceEntry);

  res.on('finish', () => {
    traceEntry.duration = Date.now() - traceEntry.startTime;
    // Bounded memory protection
    if (activeTraces.size > 500) {
      const oldestKey = activeTraces.keys().next().value;
      activeTraces.delete(oldestKey);
    }
  });

  // Wrap the remainder of the request execution within this context
  appContext.run({ reqId, traceEntry }, () => {
    next();
  });
}
