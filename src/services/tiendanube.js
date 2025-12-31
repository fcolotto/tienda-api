const BASE_URL = "https://api.tiendanube.com/v1";

async function fetchProducts() {
  const storeId = process.env.TN_STORE_ID;
  const accessToken = process.env.TN_ACCESS_TOKEN;
  const userAgent = process.env.TN_USER_AGENT;

  if (!storeId || !accessToken || !userAgent) {
    const error = new Error("Tienda Nube credentials are not configured");
    error.statusCode = 500;
    error.code = "tn_not_configured";
    throw error;
  }

  const url = `${BASE_URL}/${storeId}/products?per_page=200`;

  const response = await fetch(url, {
    headers: {
      "Authentication": `bearer ${accessToken}`,
      "User-Agent": userAgent
    }
  });

  if (!response.ok) {
    const error = new Error(`Tienda Nube request failed with status ${response.status}`);
    error.statusCode = response.status >= 500 ? 502 : 500;
    error.code = "tn_request_failed";
    throw error;
  }

  return response.json();
}

module.exports = {
  fetchProducts
};
