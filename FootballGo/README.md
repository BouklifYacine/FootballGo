# FootballGo

FootballGo est une application web moderne pour la gestion d'équipes de football, incluant le suivi des joueurs, la planification d'événements, la gestion des présences et des statistiques.

## Technologies utilisées

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes, Server Actions
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js / Auth.js
- **Tests**: Vitest, React Testing Library
- **Validation de données**: Zod
- **Gestion des états**: TanStack Query, Zustand
- **Fonctionnalités supplémentaires**: Docker, TypeScript, React Hook Form

## Fonctionnalités principales

- 👤 **Authentification complète** (inscription, connexion, récupération de mot de passe)
- 👥 **Gestion des équipes** (création, modification, administration)
- 📅 **Planification d'événements** (matchs, entraînements)
- ✓ **Gestion des présences aux événements**
- 📊 **Statistiques des joueurs et des équipes**
- 💰 **Gestion des abonnements** (différents plans avec fonctionnalités)
- 📱 **Interface responsive** adaptée à tous les appareils

## Prérequis

- Node.js 20+
- Docker et Docker Compose (pour le développement avec conteneurs)
- NPM ou Yarn

## Installation avec Docker (recommandé)

1. Clonez le dépôt:
   ```bash
   git clone https://github.com/votre-username/FootballGo.git
   cd FootballGo
   ```

2. Créez un fichier `.env` à partir du modèle:
   ```bash
   cp env.exemple .env
   ```

3. Lancez l'application avec Docker Compose:
   ```bash
   docker compose up --build
   ```

4. L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000)

## Installation sans Docker

1. Clonez le dépôt:
   ```bash
   git clone https://github.com/votre-username/FootballGo.git
   cd FootballGo
   ```

2. Créez un fichier `.env` à partir du modèle:
   ```bash
   cp env.exemple .env
   ```

3. Installez les dépendances:
   ```bash
   npm install
   ```

4. Générez le client Prisma:
   ```bash
   npx prisma generate
   ```

5. Lancez les migrations de la base de données:
   ```bash
   npx prisma migrate dev
   ```

6. Démarrez le serveur de développement:
   ```bash
   npm run dev
   ```

7. L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
FootballGo/
├── app/                     # Pages et routes Next.js
│   ├── (actions)/           # Server actions
│   ├── api/                 # Routes API
│   ├── auth/                # Pages d'authentification
│   ├── dashboard/           # Interface principale
│   └── ...                  # Autres routes
├── components/              # Composants React réutilisables
├── hooks/                   # Hooks React personnalisés
├── lib/                     # Utilitaires et fonctions
├── prisma/                  # Modèles et migrations de base de données
│   └── schema.prisma        # Schéma de la base de données
└── public/                  # Fichiers statiques
```

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Lance l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run test` - Lance les tests unitaires
- `npm run test:ui` - Lance les tests avec une interface utilisateur



## Contribuer au projet

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. 