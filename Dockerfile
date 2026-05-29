# ==========================================
# Stage 1: Base image setup
# ==========================================
FROM node:20-alpine AS base
# Alpine Linux needs openssl and libc6-compat for Prisma to work correctly
RUN apk add --no-cache openssl libc6-compat

# ==========================================
# Stage 2: Install dependencies
# ==========================================
FROM base AS deps
WORKDIR /app

# Copy package files and prisma schema
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies cleanly
RUN npm ci

# ==========================================
# Stage 3: Build the application
# ==========================================
FROM base AS builder
WORKDIR /app

# Copy node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the Prisma client using the Alpine binaries
RUN npx prisma generate

# Build the Next.js app (Requires output: "standalone" in next.config.js)
RUN npm run build

# ==========================================
# Stage 4: Production runner
# ==========================================
FROM base AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security (Docker best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Create the .next directory and set permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone output and static files
# This drastically reduces the final image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port Next.js will run on
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the server using the standalone entrypoint
CMD ["node", "server.js"]