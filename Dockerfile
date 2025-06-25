# Build stage
FROM node:22-bookworm AS builder

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    libpng-dev \
    pkg-config \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies including devDependencies for building
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the React application
RUN npm run build

# Production stage
FROM node:22-bookworm-slim AS production

# Install runtime dependencies for Canvas and image processing
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    libpixman-1-0 \
    libpng16-16 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrender1 \
    libglib2.0-0 \
    fontconfig \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy package files and node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Copy client public directory for static assets
COPY --from=builder /app/client/public ./client/public

# Create non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /usr/src/app

# Switch to non-root user
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=3584"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

EXPOSE 3001

CMD ["node", "server/index.js"]