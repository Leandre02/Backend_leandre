/* Chemins des routes de l'API
 * Projet intégrateur - Dev web 3
* By : Leandre Kanmegne
 */

export default {
  Base: '/api',
  Livres: {
    Base: '/livres',
    GetAll: '/',
    GetById: '/:id',
    Add: '/',
    Update: '/:id',
    Delete: '/:id',
    GetDisponibles: '/filtre/disponibles',
    GetByCategorie: '/filtre/categorie/:categorie',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/',
  },
} as const;
