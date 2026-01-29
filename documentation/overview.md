# 📌 Project Overview

## 1. Executive Summary

This project implements a **microservices-based e-commerce backend** designed for scalability, maintainability, and loose coupling. The system handles user authentication, product catalog management, shopping cart operations, order processing, and payment integration via Stripe.

### Key Architectural Decisions

| Decision | Implementation |
|:---------|:---------------|
| **Communication** | Synchronous (REST) for user-facing APIs; Asynchronous (Kafka) for inter-service events |
| **Database Strategy** | Database-per-service pattern with PostgreSQL |
| **Search** | ElasticSearch for product catalog queries |
| **Authentication** | JWT-based stateless authentication |
| **Payment** | Stripe Payment Intents API |

---

## 2. System Architecture

### High-Level Overview

```mermaid
flowchart TB
    subgraph Client Layer
        WebApp[Web Application]
        MobileApp[Mobile App]
    end

    subgraph API Gateway Layer
        LB[Load Balancer]
    end

    subgraph Microservices
        US[User Service<br/>Port: 6000]
        CS[Catalog Service<br/>Port: 8000]
        OS[Order Service<br/>Port: 9000]
        PS[Payment Service<br/>Port: 6002]
    end

    subgraph Message Broker
        ZK[Zookeeper<br/>Port: 2181]
        KF[Kafka Broker<br/>Port: 9092]
    end

    subgraph Data Layer
        UserDB[(User DB<br/>Port: 5439)]
        CatalogDB[(Catalog DB<br/>Port: 5433)]
        OrderDB[(Order DB<br/>Port: 5437)]
        ES[(ElasticSearch)]
    end

    subgraph External Services
        Stripe[Stripe API]
    end

    WebApp --> LB
    MobileApp --> LB
    LB --> US
    LB --> CS
    LB --> OS
    LB --> PS

    US --> UserDB
    CS --> CatalogDB
    CS --> ES
    OS --> OrderDB
    PS --> Stripe

    OS -- "Publish: CREATE_ORDER" --> KF
    KF -- "Consume: CatalogEvents" --> CS
    PS -- "Publish: CREATE_PAYMENT" --> KF
    KF -- "Consume: OrderEvents" --> OS
    KF --> ZK
```

### Communication Patterns

```mermaid
sequenceDiagram
    participant Client
    participant OrderService
    participant Kafka
    participant CatalogService
    participant PaymentService

    Client->>OrderService: POST /orders (Create Order)
    OrderService->>OrderService: Save Order to DB
    OrderService->>Kafka: Publish CREATE_ORDER
    OrderService-->>Client: 200 OK (Order Number)
    
    Kafka->>CatalogService: Consume CREATE_ORDER
    CatalogService->>CatalogService: Deduct Product Stock
    
    Client->>PaymentService: POST /create-payment
    PaymentService->>OrderService: GET /orders/:id/checkout
    OrderService-->>PaymentService: Order Details
    PaymentService->>Stripe: Create Payment Intent
    Stripe-->>PaymentService: Client Secret
    PaymentService-->>Client: Payment Credentials
    
    Client->>PaymentService: POST /verify-payment/:id
    PaymentService->>Stripe: Retrieve Payment Intent
    PaymentService->>Kafka: Publish CREATE_PAYMENT
    Kafka->>OrderService: Consume OrderEvents
    OrderService->>OrderService: Update Order Status
```

---

## 8. Directory Structure

```
microservice_kafka/
├── broker/
│   └── docker-compose.yml     # Kafka & Zookeeper
│
├── db/
│   ├── docker-compose.yml     # PostgreSQL containers
│   └── db-data/               # Persistent volumes
│
├── user_service/
│   ├── app.ts
│   ├── config/
│   ├── routes/
│   ├── types/
│   ├── db.sql
│   ├── package.json
│   └── tsconfig.json
│
├── catalog_service/
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   ├── repository/
│   │   ├── dto/
│   │   ├── interface/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── expressApp.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
│
├── order_service/
│   ├── src/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   └── migrations/
│   │   ├── dto/
│   │   ├── utils/
│   │   ├── express-app.ts
│   │   └── server.ts
│   ├── drizzle.config.ts
│   ├── package.json
│
├── payment_service/
│   ├── src/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── utils/
│   │   ├── express-app.ts
│   │   └── server.ts
│   ├── package.json
```
