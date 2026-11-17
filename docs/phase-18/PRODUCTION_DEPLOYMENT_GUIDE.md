# NEXBUS PHASE 18 — PRODUCTION DEPLOYMENT & INFRASTRUCTURE MANUAL

**Application:** NEXBUS Urban Mobility Intelligence Platform  
**Target Environments:** Vercel, Node.js Docker Container, Kubernetes, On-Premise Municipal Cloud  
**Framework:** Next.js 16.4.6, React 19.3.0, TypeScript 5.8.2  
**Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Environment Configuration

Create a `.env.production` file with the following variables:

```bash
# Server Port & Host
PORT=3000
NODE_ENV=production

# Base URL for API calls
NEXT_PUBLIC_APP_URL=https://nexbus.delhi.gov.in

# Open Transit Data Delhi (OTD) Ingestion Credentials
OTD_API_KEY=your_otd_delhi_api_key_here
OTD_POLL_INTERVAL_SECONDS=15

# Rate Limiting & Edge Controls
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120

# Epistemological Model Version Flags
NEXT_PUBLIC_MODEL_VERSION=v1.4.2-stgnn
NEXT_PUBLIC_SAFETY_INVARIANT=READ-ONLY-PASSIVE-ADVISORY
```

---

## 2. Docker Containerization (`Dockerfile`)

```dockerfile
# Multi-stage Docker build for Next.js production deployment
FROM node:20-alpine AS base

# Stage 1: Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Production Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
```

---

## 3. Kubernetes Deployment Manifest (`k8s-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexbus-platform
  namespace: transit-intelligence
  labels:
    app: nexbus
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nexbus
  template:
    metadata:
      labels:
        app: nexbus
    spec:
      containers:
      - name: nexbus
        image: ghcr.io/mayyank04/nexbus:v1.0.0
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: nexbus-config
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1024Mi"
            cpu: "1000m"
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: nexbus-service
  namespace: transit-intelligence
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: nexbus
```

---

## 4. Health Check & Monitoring

NEXBUS exposes `/api/health` providing:
- Overall status (`"healthy"`)
- Process uptime in seconds
- System memory usage (RSS, Heap Total, Heap Used in MB)
- Dataset provenance checksum verification status
- Active provider connection states
- Cache control: `no-store, max-age=0`
