# ⚙️ API Bibliothèque Personnelle / Personal Library API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)

> 🇫🇷 API REST de gestion de bibliothèque personnelle avec authentification JWT, déployée sur Azure App Service.
>
> 🇬🇧 REST API for personal library management with JWT authentication, deployed on Azure App Service.

📖 **API Docs (Swagger):** [bibliothequeapi-hmc6h5cfd3hsazau.canadacentral-01.azurewebsites.net/api-docs](https://bibliothequeapi-hmc6h5cfd3hsazau.canadacentral-01.azurewebsites.net/api-docs/)

> 🔗 **Frontend repo:** [Leandre02/projetfinal-frontend](https://github.com/Leandre02/Frontend_leandre.git)

---

## 📖 Description

### 🇫🇷 Français

**API Bibliothèque Personnelle** est une API REST développée en Node.js/Express pour gérer une collection de livres. Elle utilise **MongoDB** comme base de données et sécurise les routes d'écriture via des tokens **JWT**. L'API est documentée avec **Swagger** et déployée sur **Azure App Service**.

> 📚 Projet Final — Cours Développement Web 3, session Automne 2025

### 🇬🇧 English

**Personal Library API** is a Node.js/Express REST API for managing a book collection. It uses **MongoDB** as its database and secures write routes via **JWT** tokens. The API is documented with **Swagger** and deployed on **Azure App Service**.

> 📚 Final Project — Web Development 3 course, Fall 2025

---

## 🌐 Endpoints principaux / Main Endpoints

| Méthode | Route | Auth | Description 🇫🇷 | Description 🇬🇧 |
|---|---|---|---|---|
| `GET` | `/api/livres` | ❌ | Lister tous les livres | List all books |
| `GET` | `/api/livres/:id` | ❌ | Détail d'un livre | Book details |
| `POST` | `/api/livres` | ✅ JWT | Ajouter un livre | Add a book |
| `PUT` | `/api/livres/:id` | ✅ JWT | Modifier un livre | Edit a book |
| `DELETE` | `/api/livres/:id` | ✅ JWT | Supprimer un livre | Delete a book |
| `POST` | `/api/auth/register` | ❌ | Créer un compte | Register |
| `POST` | `/api/auth/login` | ❌ | Se connecter / obtenir JWT | Login / get JWT |

> 📄 Documentation complète / Full documentation : **[Swagger UI](https://bibliothequeapi-hmc6h5cfd3hsazau.canadacentral-01.azurewebsites.net/api-docs/)**

---

## 🚀 Installation (local)

### 1. Cloner le projet / Clone the project
```bash
git clone https://github.com/Leandre02/Backend_leandre.git
cd Backend_leandre
```

### 2. Importer les données / Import data
```bash
# Importer bibliotheque.json dans votre base MongoDB
# Import bibliotheque.json into your MongoDB database
mongoimport --db bibliotheque --collection livres --file bibliotheque.json --jsonArray
```

### 3. Installer les dépendances / Install dependencies
```bash
npm install
```

### 4. Configurer les variables d'environnement / Set up environment variables
```bash
cp .env.example .env
# Remplir les variables / Fill in the variables :
# MONGODB_URI=...
# JWT_SECRET=...
# PORT=...
```

### 5. Lancer le serveur / Start the server
```bash
npm run dev
```

### 6. Créer un utilisateur de test / Create a test user
```bash
# Via Swagger UI ou Bruno / Via Swagger UI or Bruno :
# POST /api/auth/register
```

---

## 🧪 Tester l'API / Testing the API

### Option A — Swagger UI *(recommandé / recommended)*
> 🔗 [Swagger UI en ligne / Online](https://bibliothequeapi-hmc6h5cfd3hsazau.canadacentral-01.azurewebsites.net/api-docs/)

### Option B — Bruno
> 📁 Voir le dossier / See the folder : `Bruno_leandre/`
> Importer la collection dans Bruno et configurer l'URL de base.
> Import the collection in Bruno and set the base URL.

---

## 🏗️ Architecture

```
📦 Backend (API REST)                  📦 Frontend (React)
  ☁️ Azure App Service          ←→       ☁️ Azure Static Web Apps
  [Backend_leandre]                       [Leandre02/projetfinal-frontend]
        ↕
  🍃 MongoDB Atlas
```

---

## 🔗 Liens / Links

| | Lien / Link |
|---|---|
| 📖 Swagger Docs | [API Documentation](https://bibliothequeapi-hmc6h5cfd3hsazau.canadacentral-01.azurewebsites.net/api-docs/) |
| 🌐 Frontend live | [brave-rock-074e1840f.3.azurestaticapps.net](https://brave-rock-074e1840f.3.azurestaticapps.net) |
| 💻 Frontend repo | [Leandre02/projetfinal-frontend](https://github.com/Leandre02/Frontend_leandre.git) |

---

## 👤 Auteur / Author

**Leandre Kanmegne** — [GitHub](https://github.com/Leandre02)
