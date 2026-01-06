# CMS Backend Containerfile
# Multi-stage build for Node.js backend application

FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY src/backend/package*.json ./
RUN npm install --omit=dev

# Copy application code
COPY src/backend/ ./

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]

