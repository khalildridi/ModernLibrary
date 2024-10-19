# Utiliser Node.js 16 comme base
FROM node:16

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Installer @angular/cli globalement
RUN npm install -g @angular/cli@13.3.5

# Exposer le port 4200 (port par défaut pour ng serve)
EXPOSE 4200

# Commande pour démarrer l'application
CMD ["ng", "serve", "--host", "0.0.0.0"]