# Faktura - Instructions pour IA (Claude)

## Vue d'ensemble

Faktura est une application SaaS de facturation conçue pour le marché ouest-africain (UEMOA/CEDEAO). L'application utilise le franc CFA (XOF) comme devise principale et le format de date DD/MM/YYYY. L'interface est entièrement en français.

**Stack technique** : Next.js 14.2.35 (App Router) + TypeScript + Tailwind CSS 3.4 + lucide-react (icônes)

**Aucune base de données** pour l'instant. Tout l'état est géré côté client via React Context (`AppProvider`). La prochaine étape sera l'intégration de Supabase.

---

## Architecture du projet

```
src/
├── app/                          # Pages (App Router)
│   ├── layout.tsx                # Layout racine : ThemeProvider > AppProvider
│   ├── page.tsx                  # Redirige vers /dashboard
│   ├── globals.css               # Variables CSS (light/dark), animations
│   ├── dashboard/
│   │   ├── layout.tsx            # Utilise DashboardLayout (sidebar + main)
│   │   └── page.tsx              # "use client", affiche profil.firstName, StatsGrid, InvoicesTable
│   ├── invoices/
│   │   ├── layout.tsx            # DashboardLayout
│   │   ├── page.tsx              # Liste des factures avec menu action (3 points), edit modal, delete
│   │   ├── create/
│   │   │   └── page.tsx          # Formulaire création/édition facture (~1000 lignes)
│   │   └── [id]/
│   │       └── page.tsx          # Détail facture, changement statut, suppression
│   ├── clients/
│   │   ├── layout.tsx
│   │   └── page.tsx              # CRUD clients avec modale
│   ├── transactions/
│   │   ├── layout.tsx
│   │   └── page.tsx              # Transactions + Portefeuille combinés, recherche par ticket
│   ├── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx              # 6 onglets : Profil, Entreprise, Facturation, Notifications, Sécurité, Régional
│   ├── wallet/
│   │   ├── layout.tsx
│   │   └── page.tsx              # Page wallet (obsolète, fonctionnalité fusionnée dans /transactions)
│   └── help/
│       ├── layout.tsx
│       └── page.tsx              # FAQ et support
│
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx   # Sidebar responsive + main content area
│   ├── sidebar/
│   │   ├── Sidebar.tsx           # Navigation principale, logo, recherche, dark mode toggle
│   │   ├── SidebarNavItem.tsx    # Item de navigation avec badge optionnel
│   │   ├── UserProfile.tsx       # Initiales + nom/email depuis le store
│   │   └── DarkModeToggle.tsx    # Toggle light/dark
│   ├── dashboard/
│   │   ├── StatsGrid.tsx         # 4 cartes statistiques
│   │   ├── StatCard.tsx          # Carte stat individuelle
│   │   ├── StatusBadge.tsx       # Badge coloré (paid/sent/draft/overdue)
│   │   └── InvoicesTable.tsx     # Tableau des 10 dernières factures (lecture seule)
│   └── ui/
│       └── Pagination.tsx        # Composant pagination réutilisable
│
├── lib/
│   ├── app-store.tsx             # AppProvider context : invoices, profile, company, regional
│   ├── data.ts                   # Données statiques initiales (clients, invoices, transactions, walletAccounts)
│   ├── theme.tsx                 # ThemeProvider : dark mode via class sur <html>
│   └── utils.ts                  # formatFCFA(), formatDate(), cn()
│
└── types/
    └── index.ts                  # Invoice, InvoiceLine, InvoiceStatus, Client, Transaction, WalletAccount, etc.
```

---

## État partagé (AppProvider)

Le fichier `src/lib/app-store.tsx` est le coeur de l'application. Il expose via React Context :

| Donnée | Type | Usage |
|--------|------|-------|
| `profile` | `ProfileInfo` | Nom, email, téléphone, rôle. Affiché dans sidebar, dashboard, factures |
| `company` | `CompanyInfo` | Nom entreprise, NIF, adresse, email facturation, téléphone, mentions légales. Apparaît sur les factures |
| `regional` | `RegionalSettings` | Pays, taux TVA, devise, préfixe facture, délai paiement |
| `invoices` | `Invoice[]` | Liste complète des factures. CRUD via `addInvoice`, `updateInvoice`, `deleteInvoice` |
| `countryTvaRates` | `Record<string, number>` | Mapping pays -> taux TVA (Togo: 18%, Ghana: 15%, Nigeria: 7.5%, etc.) |

**Toutes les pages lisent depuis le store.** Quand on modifie les paramètres, les changements se reflètent immédiatement sur les factures, la sidebar, le dashboard.

---

## Fonctionnalités implémentées

### Dashboard (`/dashboard`)
- Message d'accueil personnalisé ("Bienvenue, {prénom}")
- 4 cartes statistiques (revenu, envoyées, payées, en retard)
- Tableau des 10 dernières factures avec liens cliquables

### Factures (`/invoices`)
- Liste paginée (8/page) avec filtres par statut et recherche par client/numéro
- **Menu action (3 points)** sur chaque ligne : Modifier, Changer le statut (sous-menu), Supprimer
- Modale d'édition complète (dates, lignes, notes, calcul automatique TVA)
- Modale de confirmation de suppression

### Création de facture (`/invoices/create`)
- Sélecteur de client avec recherche (dropdown filtrable par nom/email)
- Sélecteur de facture existante pour édition
- Lignes de facturation dynamiques (ajout/suppression)
- Champs numériques : `value={val || ""}` avec `onFocus` pour éviter le "0" devant
- Calcul automatique sous-total, TVA (depuis `regional.tvaRate`), total TTC
- Prévisualisation en temps réel (panneau droit)
- 4 boutons d'action : Annuler, Enregistrer, Télécharger PDF, Envoyer
- Protection contre les doublons : après le premier `addInvoice`, `linkedInvoice` est set pour que les clics suivants fassent `updateInvoice`
- **Téléchargement PDF** : ouvre une fenêtre d'impression avec HTML stylé (pas de lib externe)
- Modale de succès avec messages contextuels par action

### Détail facture (`/invoices/[id]`)
- Vue complète avec infos émetteur (depuis `company`) et client
- Changement de statut inline
- Suppression avec confirmation

### Clients (`/clients`)
- Liste paginée avec recherche
- CRUD complet via modales

### Transactions (`/transactions`)
- **Page combinée** Transactions + Portefeuille
- Cartes wallet en haut (solde total gradient + 3 comptes)
- Stats résumées (solde net, revenus, dépenses)
- Tableau avec colonne "Ticket" (numéro de facture associé)
- Recherche par description, client, numéro de facture, catégorie
- Pagination 10/page

### Paramètres (`/settings`)
- 6 onglets : Profil, Entreprise, Facturation, Notifications, Sécurité, Régional
- Tous les champs sont des **controlled inputs** (`value` + `onChange`)
- **Modale personnalisée** de confirmation à l'enregistrement (pas de `alert()` ou dialog navigateur)
- Changement de pays = TVA auto-mise à jour via `countryTvaRates`
- Les modifications se propagent en temps réel sur les factures et la sidebar

### Thème sombre
- `darkMode: "class"` dans Tailwind
- Variables CSS redéfinies dans `.dark {}` (globals.css)
- Toggle dans la sidebar
- Persistance via `localStorage("faktura-theme")`

---

## Design system

### Couleurs
- **Brand** : `#1A7A6D` (teal/vert foncé) - `brand-500`
- **Statuts** : paid `#16A34A`, sent `#EA580C`, draft `#6B7280`, overdue `#DC2626`
- **Texte** : heading `#111827`, body `#4B5563`, muted `#9CA3AF`

### Patterns récurrents

```
// Carte
bg-card rounded-2xl shadow-card

// Modale overlay
fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in

// Modale contenu
bg-card rounded-2xl shadow-lg max-w-{size} w-full p-6 animate-fade-in-up

// Input
border border-gray-200 rounded-lg text-sm text-heading
focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400

// Bouton primaire
bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600

// Bouton danger
text-status-overdue hover:bg-status-overdue-bg

// Dropdown menu
bg-card border border-gray-200 rounded-lg shadow-lg z-20 py-1
items: px-4 py-2 text-sm hover:bg-gray-50
```

### Animations
- `animate-fade-in` : opacity 0->1 (0.3s)
- `animate-fade-in-up` : opacity + translateY 8px->0 (0.4s)
- `.stagger-1` à `.stagger-4` : animation-delay incrémental

### Icônes
Toujours depuis `lucide-react`. Taille standard : `size={16}` à `size={20}`.

---

## Conventions de code

### Langue
- **UI** : tout en français (labels, placeholders, messages)
- **Code** : variables et fonctions en anglais (camelCase)
- **Types** : PascalCase, définis dans `src/types/index.ts`

### Patterns importants
- Chaque page sous `app/` a son propre `layout.tsx` qui wrap avec `DashboardLayout`
- Les pages sont `"use client"` quand elles utilisent le store ou des hooks
- Utiliser `useAppStore()` pour accéder à l'état global, jamais `currentUser` de `data.ts` (obsolète)
- `formatFCFA()` pour formater les montants, `formatDate()` pour les dates
- `cn()` pour conditionner les classes Tailwind

### Ce qu'il ne faut PAS faire
- Ne pas utiliser `alert()`, `confirm()` ou `prompt()` — utiliser des modales custom
- Ne pas utiliser `defaultValue` pour des champs liés au store — utiliser `value` + `onChange`
- Ne pas hardcoder le taux TVA (0.18) — utiliser `regional.tvaRate / 100`
- Ne pas importer `currentUser` depuis `data.ts` — utiliser `profile` depuis le store

---

## Prochaines étapes (non implémentées)

1. **Intégration Supabase** : auth, stockage des factures/clients/transactions en BDD
2. **Envoi de factures par email** : le bouton "Envoyer" change le statut mais n'envoie rien encore
3. **Génération PDF réelle** : actuellement via `window.print()`, à remplacer par une lib (jsPDF ou Puppeteer côté serveur)
4. **Internationalisation** : support anglais en plus du français
5. **Tableau de bord analytique** : graphiques revenus/dépenses

---

## Commandes

```bash
npm run dev      # Serveur de développement (port 3000)
npm run build    # Build de production (vérifie TypeScript + ESLint)
npm run lint     # Linting seul
```
