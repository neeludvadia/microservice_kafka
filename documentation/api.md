# 🔌 API Reference

## 7. API Reference

### User Service Endpoints

| Method | Endpoint | Description | Auth | Request Body |
|:-------|:---------|:------------|:-----|:-------------|
| POST | `/auth/register` | Register new user | No | `{ username, email, password }` |
| POST | `/auth/login` | Authenticate user | No | `{ email, password }` |
| GET | `/auth/validate` | Validate JWT token | Yes | - |

### Catalog Service Endpoints

| Method | Endpoint | Description | Auth | Request Body |
|:-------|:---------|:------------|:-----|:-------------|
| POST | `/products` | Create product | Yes | `{ name, description, price, stock }` |
| PATCH | `/products/:id` | Update product | Yes | `{ name?, description?, price?, stock? }` |
| GET | `/products` | List products | No | Query: `limit`, `offset`, `search` |
| GET | `/products/:id` | Get product by ID | No | - |
| DELETE | `/products/:id` | Delete product | Yes | - |

### Order Service Endpoints

| Method | Endpoint | Description | Auth | Request Body |
|:-------|:---------|:------------|:-----|:-------------|
| POST | `/cart` | Add item to cart | Yes | `{ productId, qty }` |
| GET | `/cart` | Get user's cart | Yes | - |
| PATCH | `/cart/:lineItemId` | Update cart item qty | Yes | `{ qty }` |
| DELETE | `/cart/:lineItemId` | Remove cart item | Yes | - |
| POST | `/orders` | Create order from cart | Yes | - |
| GET | `/orders` | Get user's orders | Yes | - |
| GET | `/order/:id` | Get order by ID | Yes | - |
| GET | `/orders/:id/checkout` | Get order for checkout | Yes | - |

### Payment Service Endpoints

| Method | Endpoint | Description | Auth | Request Body |
|:-------|:---------|:------------|:-----|:-------------|
| POST | `/create-payment` | Create Stripe payment intent | Yes | `{ orderNumber }` |
| POST | `/verify-payment/:id` | Verify payment status | Yes | - |
