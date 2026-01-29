# 📊 Observability & Monitoring

> **Note:** This section details the new observability features added to the platform.

## 🔭 Prometheus
**Prometheus** is configured to scrape metrics from all microservices every 15 seconds.

**Scrape Targets:**
- `order_service:9000`
- `payment_service:6002`
- `catalog_service:8000`
- `user_service:6000`

**Key Metrics Collected:**
- **HTTP Metrics**: Request duration, total requests, status codes.
- **Business Metrics**:
    - `orders_created_total`, `order_amount_total`
    - `payments_initiated_total`, `payments_completed_total`
    - `products_created_total`, `stock_updates_total`
- **Kafka Metrics**:
    - `kafka_messages_produced_total`
    - `kafka_messages_consumed_total`

## 📈 Grafana
**Grafana** visualize the data stored in Prometheus. A pre-configured dashboard **"Microservices Overview"** is provisioned automatically.

### Accessing the Dashboard:
1.  Open [http://localhost:2000](http://localhost:2000)
2.  Login with: `admin` / `admin`
3.  Go to Dashboards > **Microservices Overview**

### Panels Included:
- **Request Rates**: Real-time graph of HTTP traffic per service.
- **Business KPIs**: Total orders, payment volume, etc.
- **Kafka Throughput**: Message production and consumption rates.

## 🩺 Access Points
- **Grafana**: [http://localhost:2000](http://localhost:2000)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Service Metrics**:
  - Order Service: [http://localhost:9000/metrics](http://localhost:9000/metrics)
  - Payment Service: [http://localhost:6002/metrics](http://localhost:6002/metrics)
  - Catalog Service: [http://localhost:8000/metrics](http://localhost:8000/metrics)
  - User Service: [http://localhost:6000/metrics](http://localhost:6000/metrics)
