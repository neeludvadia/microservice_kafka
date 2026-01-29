# 🏗️ Service Specifications

## 4.1 User Service

> **Location:** `user_service/`  
> **Port:** 6000  
> **Database:** PostgreSQL (Raw `pg` client)

### Purpose
Handles user registration, authentication, and JWT token management.

### Technology Stack
| Component | Technology |
|:----------|:-----------|
| Framework | Express.js 5.x |
| Database | `pg` (node-postgres) |
| Auth | `bcryptjs`, `jsonwebtoken` |
| Validation | Manual |

### Core Functions

| Function | Location | Description |
|:---------|:---------|:------------|
| `generateToken(user)` | `authRoutes.routes.ts:10` | Creates JWT with user ID and email |
| `POST /register` | `authRoutes.routes.ts:16` | Hashes password with bcrypt, saves user |
| `POST /login` | `authRoutes.routes.ts:39` | Validates credentials, returns JWT |
| `GET /validate` | `authRoutes.routes.ts:61` | Verifies JWT from Authorization header |

---

## 4.2 Catalog Service

> **Location:** `catalog_service/`  
> **Port:** 8000  
> **Database:** PostgreSQL (Prisma ORM) + ElasticSearch

### Purpose
Manages product inventory, CRUD operations, and full-text search. Consumes Kafka events to update stock after orders are placed.

### Technology Stack
| Component | Technology |
|:----------|:-----------|
| Framework | Express.js 5.x |
| ORM | Prisma 6.x |
| Search | ElasticSearch 8.x |
| Message Queue | KafkaJS |
| Validation | `class-validator` |

### Core Functions

| Function | Location | Description |
|:---------|:---------|:------------|
| `createProduct(input)` | `catalog.service.ts:15` | Creates product in DB, emits ElasticSearch sync event |
| `updateProduct(input)` | `catalog.service.ts:28` | Updates product, syncs to ElasticSearch |
| `getProducts(limit, offset, search)` | `catalog.service.ts:43` | Queries ElasticSearch for products |
| `getProductStock(ids)` | `catalog.service.ts:65` | Bulk stock lookup for cart validation |
| `handleBrokerMessage(message)` | `catalog.service.ts:73` | **Kafka Consumer** - Deducts stock on order creation |

---

## 4.3 Order Service

> **Location:** `order_service/`  
> **Port:** 9000  
> **Database:** PostgreSQL (Drizzle ORM)

### Purpose
Manages shopping carts, order creation, and order lifecycle. Publishes events to Kafka when orders are created or cancelled.

### Technology Stack
| Component | Technology |
|:----------|:-----------|
| Framework | Express.js 5.x |
| ORM | Drizzle ORM 0.44.x |
| Validation | `ajv` (JSON Schema) |
| Message Queue | KafkaJS |

### Core Functions

| Function | Location | Description |
|:---------|:---------|:------------|
| `CreateCart(input, repo)` | `cart.service.ts:8` | Validates stock via Catalog Service, creates/updates cart |
| `GetCart(id, repo)` | `cart.service.ts:35` | Returns cart with real-time stock availability |
| `CreateOrder(userId, repo, cartRepo)` | `order.service.ts:7` | Converts cart to order, **publishes CREATE_ORDER to Kafka** |
| `CheckoutOrder(orderNumber, repo)` | `order.service.ts:101` | Retrieves order for payment processing |
| `SendCreateOrderMessage(data)` | `broker.service.ts:26` | Publishes order data to `CatalogEvents` topic |

---

## 4.4 Payment Service

> **Location:** `payment_service/`  
> **Port:** 6002  
> **Database:** None (stateless, uses Stripe)

### Purpose
Handles payment processing via Stripe. Creates payment intents, verifies payments, and publishes payment events to update order status.

### Technology Stack
| Component | Technology |
|:----------|:-----------|
| Framework | Express.js 5.x |
| Payment | Stripe SDK 20.x |
| Message Queue | KafkaJS |

### Core Functions

| Function | Location | Description |
|:---------|:---------|:------------|
| `CreatePayment(userId, orderNumber, gateway)` | `payment.service.ts:6` | Fetches order, creates Stripe PaymentIntent |
| `VerifyPayment(paymentId, gateway)` | `payment.service.ts:40` | Retrieves payment status, **publishes to Kafka** |
| `createPayment(amount, metadata)` | `stripePayment.ts:8` | Stripe API: Creates payment intent |
| `getPayment(paymentId)` | `stripePayment.ts:25` | Stripe API: Retrieves payment status |
