# Build Stage
FROM node:latest AS build
WORKDIR /app

# Copy package files to the build stage
COPY package*.json ./
RUN npm install

# Copy the rest of the application code to the build stage
COPY . .

# Build the Next.js app
RUN npm run build

# Production Stage
FROM node:latest
WORKDIR /app

# Copy only necessary artifacts from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port that your application will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
