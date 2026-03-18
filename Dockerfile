# Use the official Bun image instead of Node
FROM oven/bun:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package*.json ./
# Copy lockfile if you have one (make it optional)
COPY bun.lockb* ./

# Install dependencies with Bun (removed --frozen-lockfile)
RUN bun install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Define healthcheck if you have a healthcheck script
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
#  CMD bun run healthcheck.js

# Set production environment
ENV NODE_ENV=development

# Start the application
CMD ["bun", "start"]
