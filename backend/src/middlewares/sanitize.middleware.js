import mongoSanitize from 'express-mongo-sanitize';

/**
 * Custom XSS prevention middleware
 * Sanitizes user inputs to prevent XSS attacks
 */
export const xssClean = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeData(req.body);
  }

  // Sanitize request query
  if (req.query) {
    req.query = sanitizeData(req.query);
  }

  // Sanitize request params
  if (req.params) {
    req.params = sanitizeData(req.params);
  }

  next();
};

/**
 * Recursively sanitize data to prevent XSS
 * Removes common XSS patterns
 */
function sanitizeData(data) {
  if (typeof data === 'string') {
    return data
      .replace(/script/gi, '')
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim();
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  if (data !== null && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeData(value);
    }
    return sanitized;
  }

  return data;
}

/**
 * Export mongo sanitize middleware
 * Prevents injection attacks by removing $ and . from keys
 */
export const mongoSanitizer = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    // Log sanitization attempts
    console.warn(`Sanitized key: ${key}`);
  },
});
