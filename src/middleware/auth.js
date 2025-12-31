module.exports = function auth(req, res, next) {
  const apiKey = req.header("x-api-key");
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    return res.status(500).json({
      ok: false,
      error: {
        code: "server_misconfigured",
        message: "API key not configured"
      }
    });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      ok: false,
      error: {
        code: "unauthorized",
        message: "Invalid or missing API key"
      }
    });
  }

  return next();
};
