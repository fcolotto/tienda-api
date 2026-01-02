require("dotenv").config();

const express = require("express");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");

const app = express();

// Railway asigna un puerto dinámico en process.env.PORT
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[request] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

// Si tenés authMiddleware en tu proyecto, descomentá estas dos líneas:
// const authMiddleware = require("./middleware/auth");
// app.use(authMiddleware);

app.use("/product", productRouter);
app.use("/order", orderRouter);

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

// IMPORTANTE: bind a 0.0.0.0 para que Railway pueda enrutar al contenedor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[startup] Server listening on port ${PORT}`);
});

