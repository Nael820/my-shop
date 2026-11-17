# Maison Moderne

Boutique de démonstration construite avec React, TypeScript, React Query et Supabase.

## Configuration Supabase

1. Créez un projet Supabase.
2. Dans le SQL Editor du projet, exécutez tous les fichiers de `supabase/migrations` dans l’ordre de leur nom.
3. Exécutez `supabase/seed.sql` pour importer le catalogue de démonstration.
4. Copiez `.env.example` vers `.env.local` et renseignez l’URL du projet et sa clé `anon` publique.
5. Activez le fournisseur Email dans Authentication. Pour une inscription immédiate pendant le TP, désactivez la confirmation d’adresse.

La clé `service_role` ne doit jamais être utilisée dans le navigateur. Les tables `orders` et `order_items` sont protégées par RLS : chaque utilisateur ne peut lire que ses commandes. Le passage de commande utilise une fonction SQL transactionnelle.

Pour donner les droits administrateur au premier compte, inscris-toi puis exécute dans le SQL Editor Supabase :

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'VOTRE_EMAIL');
```

Cette opération est réservée au SQL Editor; aucun utilisateur ne peut modifier son propre rôle depuis le site.

## Démarrer

```sh
npm install
npm run dev
```

## Parcours disponibles

- `/` : accueil et sélection de produits
- `/products` : catalogue complet
- `/products/:slug` : détail d'un produit
- `/orders` : historique de commandes personnel protégé
- `/login` et `/signup` : authentification par e-mail
- `/account` : espace personnel protégé
- `/admin` : tableau de bord et gestion du catalogue, réservé aux administrateurs
- Toute autre URL : page 404

Les données du catalogue et les commandes sont chargées depuis Supabase avec React Query. Les produits sont publiquement lisibles; les routes de compte et le passage de commande nécessitent une session Supabase.

## Vérifier le projet

```sh
npm run build
npm run lint
npm test
npm run test:watch
npm run test:coverage
```

Le rapport de couverture est généré dans `coverage/` (résumé dans le terminal, rapport HTML et fichier lcov).

### Couverture mesurée

Dernière mesure avec `npm run test:coverage` : **13,19 % des lignes** (13,41 % des instructions, 13,78 % des branches et 14,59 % des fonctions). La couverture reste faible à l'échelle de l'application : les écrans d'administration, les commandes, l'authentification et plusieurs pages ne sont pas encore exercés par les tests unitaires/RTL. `ProductCard` est couvert à 100 % des lignes, tandis que `CartPanel` atteint 90 % et `LoginPage` 81,81 %. Le détail par fichier est disponible dans `coverage/index.html`.
