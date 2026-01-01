# Tienda Nube Chatbot API

API Express lista para buscar productos en Tienda Nube y servirlos a un chatbot.

## Requisitos

- Node.js 18+ (LTS)

## Configuración

1. Copiá el archivo de ejemplo y completá las variables:

```bash
cp .env.example .env
```

Variables obligatorias:

- `PORT`: puerto del servidor (ej. 3000).
- `TN_STORE_ID`: ID de la tienda en Tienda Nube.
- `TN_ACCESS_TOKEN`: access token de Tienda Nube.
- `TN_USER_AGENT`: user agent requerido por Tienda Nube (ej. `MiApp (email@dominio.com)`).

## Decisiones técnicas

- Endpoint Tienda Nube: `GET https://api.tiendanube.com/v1/{store_id}/products?per_page=200`.
- Headers requeridos:
  - `Authentication: bearer <TN_ACCESS_TOKEN>`
  - `User-Agent: <TN_USER_AGENT>`
- El filtro se aplica en el backend con normalización (minúsculas, sin tildes).
- Precio y stock se toman del primer variant si existe.

## Ejecución

Instalación:

```bash
npm install
```

Desarrollo:

```bash
npm run dev
```

Producción:

```bash
npm start
```

## Endpoints

### Health

```bash
curl http://localhost:3000/health
```

Respuesta:

```json
{ "ok": true }
```

### Buscar productos

```bash
curl "http://localhost:3000/product?q=camisa"
```

Respuesta exitosa:

```json
{
  "ok": true,
  "results": [
    {
      "id": 123,
      "name": "Camisa",
      "price": "1999.00",
      "url": "https://mitienda.com.ar/camisa",
      "stock": 10
    }
  ]
}
```

Errores comunes:

- Sin `q` → `400`.
- Error con Tienda Nube → `500` o `502`.

### Consultar pedidos

Por número de pedido:

```bash
curl "http://localhost:3000/order?number=5273"
```

Por email y número:

```bash
curl "http://localhost:3000/order?email=cliente@dominio.com&number=5273"
```

Por ID interno (fallback):

```bash
curl "http://localhost:3000/order?id=123456"
```
