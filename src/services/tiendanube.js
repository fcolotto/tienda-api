const BASE_URL = "https://api.tiendanube.com/v1";

function getCredentials() {
  const storeId = process.env.TN_STORE_ID;
  const accessToken = process.env.TN_ACCESS_TOKEN;
  const userAgent = process.env.TN_USER_AGENT;

  if (!storeId || !accessToken || !userAgent) {
    const error = new Error("Tienda Nube credentials are not configured");
    error.statusCode = 500;
    error.code = "tn_not_configured";
    throw error;
  }

  return { storeId, accessToken, userAgent };
}

async function fetchProducts() {
  const { storeId, accessToken, userAgent } = getCredentials();
  const url = `${BASE_URL}/${storeId}/products?per_page=200`;

  const response = await fetch(url, {
    headers: {
      Authentication: `bearer ${accessToken}`,
      "User-Agent": userAgent
    }
  });

  if (!response.ok) {
    const error = new Error(
      `Tienda Nube request failed with status ${response.status}`
    );
    error.statusCode = response.status >= 500 ? 502 : 500;
    error.code = "tn_request_failed";
    throw error;
  }

  return response.json();
}

async function fetchOrderById(orderId) {
  const { storeId, accessToken, userAgent } = getCredentials();

  const encodedId = encodeURIComponent(orderId);
  const url = `${BASE_URL}/${storeId}/orders/${encodedId}`;

  const response = await fetch(url, {
    headers: {
      Authentication: `bearer ${accessToken}`,
      "User-Agent": userAgent
    }
  });

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Tienda Nube unauthorized");
    error.statusCode = 403;
    error.code = "tn_unauthorized";
    throw error;
  }

  if (response.status === 404) {
    const error = new Error("Tienda Nube order not found");
    error.statusCode = 404;
    error.code = "tn_not_found";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      `Tienda Nube request failed with status ${response.status}`
    );
    error.statusCode = 500;
    error.code = "tn_request_failed";
    throw error;
  }

  return response.json();
}

function buildNotFoundError() {
  const error = new Error("Tienda Nube order not found");
  error.statusCode = 404;
  error.code = "tn_not_found";
  return error;
}

async function fetchOrders({ email, perPage = 100 } = {}) {
  const { storeId, accessToken, userAgent } = getCredentials();
  const params = new URLSearchParams();

  if (perPage) params.set("per_page", perPage);
  if (email) params.set("email", email);

  const url = `${BASE_URL}/${storeId}/orders?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authentication: `bearer ${accessToken}`,
      "User-Agent": userAgent
    }
  });

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Tienda Nube unauthorized");
    error.statusCode = 403;
    error.code = "tn_unauthorized";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      `Tienda Nube request failed with status ${response.status}`
    );
    error.statusCode = 500;
    error.code = "tn_request_failed";
    throw error;
  }

  return response.json();
}

async function fetchOrderByNumber({ number, email }) {
  const orders = await fetchOrders({ email, perPage: 100 });
  const normalizedNumber = String(number);
  const emailFilter = email ? String(email).toLowerCase() : null;

  const filteredOrders = emailFilter
    ? orders.filter(
        (item) => String(item.customer?.email || "").toLowerCase() === emailFilter
      )
    : orders;

  const match = filteredOrders.find((item) => {
    const orderNumber = item.number ?? item.order_number;
    return String(orderNumber) === normalizedNumber;
  });

  if (!match) throw buildNotFoundError();
  return match;
}

module.exports = {
  fetchProducts,
  fetchOrderById,
  fetchOrders,
  fetchOrderByNumber
};
