const express = require("express");
const { fetchOrderById, fetchOrderByNumber } = require("../services/tiendanube");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orderId = req.query.id;
    const orderNumber = req.query.number;
    const email = req.query.email;

    if (!orderId && !orderNumber) {
      return res.status(400).json({
        ok: false,
        error: {
          code: "missing_id",
          message: "Query parameter 'id' or 'number' is required"
        }
      });
    }

    let order = null;

    if (orderId) {
      order = await fetchOrderById(orderId);
    } else {
      order = await fetchOrderByNumber({ number: orderNumber, email });
    }

    return res.status(200).json({
      ok: true,
      order: {
        id: order.id,
        number: order.number,
        status: order.status,
        created_at: order.created_at,
        total: order.total,
        shipping_tracking_number: order.shipping_tracking_number || null,
        shipping_tracking_url: order.shipping_tracking_url || null
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
