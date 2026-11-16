# Maison Moderne

Boutique de démonstration construite avec React, TypeScript, React Query et Supabase.

## Configuration Supabase

1. Créez un projet Supabase.
2. Dans le SQL Editor du projet, exécutez `supabase/migrations/20261116143000_create_shop_schema.sql`.
3. Exécutez `supabase/seed.sql` pour importer le catalogue de démonstration.
4. Copiez `.env.example` vers `.env.local` et renseignez l’URL du projet et sa clé `anon` publique.
5. Activez le fournisseur Email dans Authentication. Pour une inscription immédiate pendant le TP, désactivez la confirmation d’adresse.

La clé `service_role` ne doit jamais être utilisée dans le navigateur. Les tables `orders` et `order_items` ont la RLS activée et restent inaccessibles tant que leurs policies utilisateur ne sont pas ajoutées au jalon 3.

## Démarrer

```sh
npm install
npm run dev
```

## Parcours disponibles

- `/` : accueil et sélection de produits
- `/products` : catalogue complet
- `/products/:slug` : détail d'un produit
- `/orders` : commandes accessibles selon les policies RLS
- `/login` et `/signup` : authentification par e-mail
- `/account` : espace personnel protégé
- Toute autre URL : page 404

Les données du catalogue sont chargées depuis Supabase avec React Query. Les produits sont publiquement lisibles; les commandes restent protégées par défaut. Les routes de compte nécessitent une session Supabase.

## Vérifier le projet

```sh
npm run build
npm run lint
```
