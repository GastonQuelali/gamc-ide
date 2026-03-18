# --- Etapa de Construcción ---
FROM node:20-alpine AS build-stage
WORKDIR /app

# Copiamos solo archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Argumento para la URL de la API (se puede sobreescribir en el docker-compose)
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Aumentamos el heap a 4GB (4096MB) para que ArcGIS y Vite respiren
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Generamos el build de Vite
RUN npm run build

# --- Etapa de Producción ---
FROM nginx:stable-alpine AS production-stage

# Copiamos el build a la ruta por defecto de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiamos una configuración de Nginx personalizada para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]