import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register });

// ============= HTTP Metrics =============

// Create a histogram for HTTP request duration
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5],
});

// Create a counter for total HTTP requests
const httpRequestTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

// ============= Order Business Metrics =============

// Counter for orders created
export const ordersCreatedTotal = new client.Counter({
    name: 'orders_created_total',
    help: 'Total number of orders created',
    labelNames: ['status'],
});

// Counter for order checkouts
export const ordersCheckoutTotal = new client.Counter({
    name: 'orders_checkout_total',
    help: 'Total number of order checkouts',
    labelNames: ['status'],
});

// Counter for order amount
export const orderAmountTotal = new client.Counter({
    name: 'order_amount_total',
    help: 'Total order amount processed',
});

// Counter for cart operations
export const cartOperationsTotal = new client.Counter({
    name: 'cart_operations_total',
    help: 'Total cart operations',
    labelNames: ['operation'], // add, remove, clear
});

// ============= Kafka Metrics =============

export const kafkaMessagesProducedTotal = new client.Counter({
    name: 'kafka_messages_produced_total',
    help: 'Total Kafka messages produced',
    labelNames: ['topic'],
});

export const kafkaMessagesConsumedTotal = new client.Counter({
    name: 'kafka_messages_consumed_total',
    help: 'Total Kafka messages consumed',
    labelNames: ['topic'],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(ordersCreatedTotal);
register.registerMetric(ordersCheckoutTotal);
register.registerMetric(orderAmountTotal);
register.registerMetric(cartOperationsTotal);
register.registerMetric(kafkaMessagesProducedTotal);
register.registerMetric(kafkaMessagesConsumedTotal);

// Middleware to track request duration
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route?.path || req.path || 'unknown';

        httpRequestDuration.observe(
            { method: req.method, route, status_code: res.statusCode },
            duration
        );

        httpRequestTotal.inc({ method: req.method, route, status_code: res.statusCode });
    });

    next();
};

// Handler for /metrics endpoint
export const metricsHandler = async (_req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
};

export { register };
