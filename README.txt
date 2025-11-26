Ce document présente de manière détaillée les problèmes rencontrés lors du déploiement du backend Express/TypeScript sur Azure App Service, ainsi que les solutions mises en place pour corriger et stabiliser l’application.
Il couvre également les correctifs relatifs à Mongoose, aux variables d’environnement et au système de build.

1. Problème initial : l’application ne démarrait pas sur Azure (503 Service Unavailable)
Symptômes :
- Les requêtes vers Azure renvoyaient systématiquement une page d’erreur générique (503).
- Les logs Azure montraient des redémarrages continus du container.
- L’application n’exposait aucune route, même la route /health.

Cause identifiée

- La commande de démarrage exécutée sur Azure échouait : Error: Cannot find module 'module-alias/register'
Ce message indiquait que le package module-alias n’était pas installé dans l’environnement Azure.

Origine du problème

Dans le workflow GitHub Actions, la tâche de build comportait une étape qui supprimait le dossier node_modules ’artefact vers Azure.
Azure recevait donc un package sans dépendances, causant une erreur au lancement.

Correction apportée
- Suppression de l’étape qui supprimait node_modules dans le workflow GitHub Actions.
- Ajout d’une tâche propre pour installer les dépendances, builder le projet et envoyer l’ensemble du répertoire (code + dist + node_modules) à Azure.


2. Erreur secondaire : absence du dossier dist et plantage du build
Symptômes

- GitHub Actions échouait lors de l’exécution de npm run build.

L’erreur suivante apparaissait : ENOENT: no such file or directory, lstat './src/public'

Cause
- Le script scripts/build.ts copiait les dossiers src/public et src/views vers dist, mais ces dossiers n’existaient pas dans le dépôt (ils étaient vides localement et donc non suivis par Git).

Correction

- Ajout de dossiers src/public et src/views, chacun contenant un fichier .gitkeep afin qu’ils soient versionnés.
- Le build ts-node scripts/build.ts a pu s’exécuter correctement.

3. Erreur : variables d’environnement manquantes (NODE_ENV, PORT)
Symptômes
Des erreurs du type :
- The environment variable "NODE_ENV" was missing or invalid.

Causes
-Le chargement des variables d’environnement n’était pas prévu pour la production (Azure n’utilise pas .env).
-La configuration de jet-env exigeait que certaines variables soient présentes.

Correction

- Déclaration des variables d’environnement directement dans Azure App Service (Configuration > Paramètres d'application).
- Ajout d’une logique de fallback dans index.ts pour gérer les valeurs par défaut si nécessaire.

4. Problème critique : connexion MongoDB fonctionnelle mais aucune donnée renvoyée
Symptômes
- La route /api/livres renvoyait systématiquement : { "livres": [] }
- Aucun message d’erreur dans les logs.

Diagnostic détaillé
Grâce à l’ajout de logs dans index.ts :

MongoDB connecté: db="..."
Collections visibles: bibliotheque, users
Cela révélait que Mongoose utilisait la base de données bibliotheque alors que les données importées se trouvaient dans la base mycharacters.

Origine du problème

- Le modèle Mongoose Livre était configuré pour utiliser la collection bibliotheque.
- L’import Mongo avait été effectué dans mycharacters.livres.
- Les données étaient donc présentes dans une autre collection que celle réellement interrogée.

Correctifs

- Correction du modèle Livre pour utiliser explicitement la collection bibliotheque.

Exemple : export default model('Livre', LivreSchema, 'bibliotheque');

- Vérification de l’import MongoDB et réalignement de la collection ciblée.
- Réimportation des données dans la bonne collection lorsque nécessaire.
- Ajout d’un log dans la route /api/livres pour vérifier la collection utilisée :



5. Stabilisation du comportement au démarrage
Problème

- La ligne suivante provoquait un arrêt brutal de l’application en cas d’erreur de connexion MongoDB :
logger.err('Erreur de connexion MongoDB', true);


A savoir : Le deuxième paramètre indique à jet-logger de forcer la fermeture du processus.

Conséquence sur Azure

- En cas d’indisponibilité temporaire de MongoDB, Azure redémarrait l’application en boucle. Cela provoquait un 503 permanent.

Correction

- Passage du second paramètre à false pour éviter l’arrêt du processus :
- logger.err('Erreur de connexion MongoDB', false);
