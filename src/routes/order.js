const express = require("express");
const { fetchOrder } = require("../services/tiendanube");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orderId = req.query.id;

    if (!orderId) {
      return res.status(400).json({
        ok: false,
        error: {
          code: "missing_id",
          message: "Query parameter 'id' is required"
        }
      });
    }

    const order = await fetchOrder(orderId);

    return res.status(200).json({
      ok: true,
      order
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
