# ------------ Base image for frontend build ------------
    FROM node:slim AS frontend

    WORKDIR /client
    
    COPY client/package*.json ./
    RUN npm install
    
    COPY client/ ./
    RUN npm run build
    
    # ------------ Base image for backend run ------------
    FROM node:slim AS backend
    
    WORKDIR /server
    
    # Install backend dependencies
    COPY server/package*.json ./
    RUN npm install
    
    # Copy backend code
    COPY server/ ./
    
    # Copy built frontend into backend public folder
    COPY --from=frontend /client/build ./public
    
    # Expose port (adjust if needed)
    EXPOSE 8080
    
    # Start the backend server
    CMD ["node", "index.js"]
    