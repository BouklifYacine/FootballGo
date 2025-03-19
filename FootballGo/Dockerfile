FROM node:20-alpine

WORKDIR /app

# Installer les dépendances nécessaires pour Prisma et certains packages natifs
RUN apk add --no-cache libc6-compat python3 make g++

# Copier les fichiers de configuration
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json next.config.ts ./

# Installer les dépendances sans générer les fichiers Prisma pendant l'installation
RUN npm pkg delete scripts.postinstall
RUN npm ci --omit=dev --ignore-scripts

# Générer le client Prisma
RUN npx prisma generate

# Restaurer le script postinstall pour les futures installations
RUN npm pkg set scripts.postinstall="prisma generate"

# Copier le reste des fichiers de l'application
COPY . .

# Configurer les variables d'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Exposer le port sur lequel l'application sera accessible
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]