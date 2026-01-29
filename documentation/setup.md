# 🚀 Setup & Run Instructions

## Prerequisites
- **Docker** and **Docker Compose** installed.
- **Node.js** (v18+) and **npm** installed.

## 🐳 Docker Setup
All infrastructure is containerized. To start the environment:

```bash
# Start Kafka, Postgres, Redis, Elasticsearch, Prometheus, and Grafana
docker-compose up -d
```

## 🛠️ Local Development
You can run the services locally using `npm run dev`. Since they depend on the Docker infrastructure, ensure `docker-compose` is running first.

```bash
# Install dependencies for all services (run in root or each service folder)
npm install

# Run Service (Example: User Service)
cd user_service
npm run dev
```

## 🧪 Verification
1.  **Check Services**: Ensure all services are responding on their respective ports (6000, 8000, 9000, 6002).
2.  **Check Monitoring**: Visit [http://localhost:2000](http://localhost:2000) for Grafana.
3.  **Test Flow**: Create an order and verify it appears in the database and Grafana metrics.
