/* Chemins des routes de l'API
 * Projet intégrateur - Dev web 3
 * By : Leandre Kanmegne
 */

export default {
  Base: '/api',
  Livres: {
    Base: '/livres',
    GetAll: '/', // recupere tous les livres
    GetById: '/:id', // recupere un livre par son ID
    Add: '/', // ajoute un nouveau livre
    Update: '/:id', // met a jour un livre par son ID
    Delete: '/:id', // supprime un livre par son ID
    GetDisponibles: '/filtre/disponibles', // recupere tous les livres disponibles
    GetByCategorie: '/filtre/categorie/:categorie', // recupere les livres par categorie
  },
  Auth: {
    Base: '/auth',
    Register: '/register', // inscription d'un nouvel utilisateur
    Login: '/login', // connexion d'un utilisateur
  },
  Users: {
    Base: '/users',
    GetAll: '/', // recupere tous les users
    Add: '/', // ajoute un nouvel user
    Update: '/:id', // met a jour les donnees d'un user
    Delete: '/:id', // supprime un user par son ID
  },
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/', // genere un token d'authentification
  },
} as const;
