const express = require("express");
const { fetchOrderById, fetchOrders } = require("../services/tiendanube");

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
          code: "missing_number",
          message: "Query parameter 'number' is required"
        }
      });
    }

    let order = null;

    if (orderId) {
      order = await fetchOrderById(orderId);
    } else {
      const orders = await fetchOrders({ email });
      const normalizedNumber = String(orderNumber);
      const emailFilter = email ? String(email).toLowerCase() : null;
      const filteredOrders = emailFilter
        ? orders.filter((item) => String(item.customer?.email || "").toLowerCase() === emailFilter)
        : orders;

      order = filteredOrders.find((item) => String(item.number) === normalizedNumber) || null;
    }

    if (!order) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "tn_not_found",
          message: "Order not found"
        }
      });
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
