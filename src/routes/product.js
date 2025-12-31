const express = require("express");
const { fetchProducts } = require("../services/tiendanube");
const normalize = require("../utils/normalize");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        ok: false,
        error: {
          code: "missing_query",
          message: "Query parameter 'q' is required"
        }
      });
    }

    const normalizedQuery = normalize(query);
    const products = await fetchProducts();

    const results = products
      .filter((product) => {
        const name = normalize(product.name?.es || product.name);
        return name.includes(normalizedQuery);
      })
      .map((product) => {
        const firstVariant = Array.isArray(product.variants)
          ? product.variants[0]
          : null;

        return {
          id: product.id,
          name: product.name?.es || product.name,
          price: firstVariant?.price || product.price || null,
          url: product.permalink || product.canonical_url || null,
          stock: firstVariant?.stock ?? null
        };
      });

    return res.status(200).json({
      ok: true,
      results
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
