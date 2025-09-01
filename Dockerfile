
# Multi-stage build for Crypto Beacon Trading Platform
# This Dockerfile creates an optimized production image

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Install serve for serving static files
RUN npm install -g serve

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["serve", "-s", "dist", "-l", "3000"]

# Development stage (for development with hot reload)
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Expose port for development
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Testing stage
FROM builder AS testing

# Install additional testing dependencies
RUN npx playwright install-deps
RUN npx playwright install

# Copy test files
COPY tests/ ./tests/

# Run tests
RUN npm run test
RUN npm run test:e2e

# Security scanning stage
FROM builder AS security

# Install security scanning tools
RUN npm install -g audit-ci @lhci/cli

# Run security scans
RUN npm audit --audit-level moderate
RUN audit-ci --moderate

# Final production image with multi-architecture support
FROM node:18-alpine AS final

# Metadata
LABEL maintainer="Crypto Beacon Team <support@crypto-beacon.com>"
LABEL version="2.0.0"
LABEL description="Crypto Beacon Trading Platform - Production Image"

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    tzdata

# Set timezone
ENV TZ=Australia/Sydney

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy application files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Install serve globally
RUN npm install -g serve@14

# Create data directory for SQLite (if needed)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Switch to non-root user
USER nextjs

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Volume for persistent data
VOLUME ["/app/data"]

# Start the application with proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["serve", "-s", "dist", "-l", "3000", "--cors"]
