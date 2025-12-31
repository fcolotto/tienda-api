require("dotenv").config();

const express = require("express");
const productRouter = require("./routes/product");
const authMiddleware = require("./middleware/auth");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[request] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(authMiddleware);
app.use("/product", productRouter);

app.use((err, _req, res, _next) => {
  console.error("[error]", err);

  const status = err.statusCode || 500;
  const message = err.message || "Unexpected error";

  res.status(status).json({
    ok: false,
    error: {
      code: err.code || "internal_error",
      message
    }
  });
});

app.listen(PORT, () => {
  console.log(`[startup] Server listening on port ${PORT}`);
});
