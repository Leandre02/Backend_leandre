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
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/', // genere un token d'authentification
  },
} as const;
