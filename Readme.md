# 🧩 Microservices Architecture Project

A scalable **microservices-based backend system** built using **Node.js, TypeScript, Clean Architecture**, and **event-driven communication with Kafka**.  
Each service is independently deployable, follows best practices, and is designed for real-world production use.

---

## 📌 Overview

This project consists of **4 independent microservices**, each responsible for a specific domain.  
All services communicate asynchronously using **Apache Kafka** and follow **Clean Architecture principles**.

The system uses **Docker** to manage infrastructure components like **Kafka, Elasticsearch, and PostgreSQL databases**.

---

## 🏗️ Microservices Breakdown

### 1️⃣ Catalog Service
**Purpose:** Product catalog management & search  

**Key Features:**
- Elasticsearch integration for fast and scalable search
- Prisma ORM for database access
- Class-based programming approach
- Clean Architecture (Controller → Use Case → Domain → Infrastructure)
- Unit & integration tests using **Jest**

**Tech Stack:**
- Node.js + TypeScript
- Prisma ORM
- Elasticsearch
- PostgreSQL
- Jest

---

### 2️⃣ Order Service
**Purpose:** Order creation and processing  

**Key Features:**
- Drizzle ORM
- Functional programming style
- Clean Architecture
- Event-driven order processing via Kafka

**Tech Stack:**
- Node.js + TypeScript
- Drizzle ORM
- PostgreSQL
- Kafka

---

### 3️⃣ User Service
**Purpose:** User authentication & authorization  

**Key Features:**
- JWT-based authentication
- Secure token handling
- Clean Architecture
- Kafka-based communication with other services

**Tech Stack:**
- Node.js + TypeScript
- JWT
- PostgreSQL
- Kafka

---

### 4️⃣ Payment Service
**Purpose:** Payment processing  

**Key Features:**
- Stripe integration for payments
- Secure transaction handling
- Event-based payment confirmation using Kafka
- Clean Architecture

**Tech Stack:**
- Node.js + TypeScript
- Stripe API
- Kafka

---

## 🔄 Inter-service Communication

- **Apache Kafka** is used for asynchronous communication between services
- Each service publishes and consumes domain events
- Ensures loose coupling and scalability

---

## 🗄️ Databases & Infrastructure

- **PostgreSQL**  
  - Separate database per service (Database-per-service pattern)
  - 4 PostgreSQL containers:
    - Catalog DB
    - Order DB
    - User DB
    - Payment DB

- **Elasticsearch**
  - Used exclusively by Catalog Service for search

- **Kafka**
  - Message broker for event-driven communication

---

## 🐳 Docker Setup

All infrastructure services are containerized using Docker:

- Elasticsearch
- Kafka
- Zookeeper
- PostgreSQL (4 instances)

This allows easy local development and environment consistency.

---

## 🧠 Architecture Principles

- Clean Architecture
- Separation of concerns
- Domain-driven design (DDD-inspired)
- Event-driven microservices
- Database-per-service
- Loose coupling via Kafka

---

## 🚀 How to Run the Project

```bash
# Start infrastructure (Kafka, Elasticsearch, PostgreSQL)
docker-compose up -d

# Install dependencies
npm install

# Run individual services
npm run dev
