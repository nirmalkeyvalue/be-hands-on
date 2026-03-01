# -------- Build stage --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# -------- Production stage --------
FROM node:20-alpine

WORKDIR /app

# Only copy needed files
COPY package*.json ./
RUN npm install --only=production

# Copy built output from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5001

CMD ["npm", "run", "start"]