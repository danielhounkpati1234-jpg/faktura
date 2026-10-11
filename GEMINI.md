# Faktura - Instructions pour IA (Gemini)

## Qu'est-ce que Faktura ?

Faktura est une application web de facturation SaaS destinée aux entreprises d'Afrique de l'Ouest (zone UEMOA/CEDEAO). Elle permet de créer, gérer et suivre des factures en franc CFA (XOF), avec une interface entièrement en français et un design moderne adapté au marché africain.

**URL locale** : `http://localhost:3000` (redirige vers `/dashboard`)

---

## Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 14.2.35 | Framework React avec App Router |
| **TypeScript** | ^5 | Typage statique |
| **Tailwind CSS** | ^3.4.1 | Styles utilitaires |
| **lucide-react** | ^1.55.0 | Bibliothèque d'icônes |
| **React** | ^18 | UI composants |
| **Geist Font** | locale | Typographie (sans + mono) |

**Pas de base de données** actuellement. L'état est entièrement client-side via React Context. L'intégration Supabase est prévue.

---

## Structure des fichiers

```
faktura/
├── package.json
├── tailwind.config.ts          # darkMode: "class", couleurs custom via CSS vars
├── tsconfig.json
├── CLAUDE.md                   # Instructions IA (Claude)
├── GEMINI.md                   # Instructions IA (Gemini) - ce fichier
│
└── src/
    ├── app/
    │   ├── layout.tsx          # Root: <html lang="fr"> → ThemeProvider → AppProvider
    │   ├── page.tsx            # redirect("/dashboard")
    │   ├── globals.css         # Variables CSS light/dark, keyframes animations
    │   ├── fonts/              # GeistVF.woff, GeistMonoVF.woff
    │   │
    │   ├── dashboard/          # Tableau de bord principal
    │   │   ├── layout.tsx      # → DashboardLayout (sidebar + content)
    │   │   └── page.tsx        # Stats, factures récentes, salutation personnalisée
    │   │
    │   ├── invoices/           # Gestion des factures
    │   │   ├── layout.tsx
    │   │   ├── page.tsx        # Liste + filtres + menu action (modifier/statut/supprimer)
    │   │   ├── create/page.tsx # Création avec prévisualisation, PDF, 4 boutons d'action
    │   │   └── [id]/page.tsx   # Détail individuel d'une facture
    │   │
    │   ├── clients/            # Gestion clients (CRUD)
    │   ├── transactions/       # Transactions + Portefeuille (page combinée)
    │   ├── settings/           # Paramètres (6 onglets)
    │   ├── wallet/             # Page portefeuille (obsolète, fusionnée dans transactions)
    │   └── help/               # Aide et support (FAQ)
    │
    ├── components/
    │   ├── layout/DashboardLayout.tsx    # Sidebar responsive + zone de contenu
    │   ├── sidebar/                      # Sidebar, navigation, profil, dark mode
    │   ├── dashboard/                    # StatsGrid, StatCard, StatusBadge, InvoicesTable
    │   └── ui/Pagination.tsx             # Composant pagination réutilisable
    │
    ├── lib/
    │   ├── app-store.tsx       # IMPORTANT: État global (React Context)
    │   ├── data.ts             # Données initiales (mock data)
    │   ├── theme.tsx           # ThemeProvider (light/dark via class)
    │   └── utils.ts            # formatFCFA(), formatDate(), cn()
    │
    └── types/index.ts          # Tous les types TypeScript
```

---

## État global — AppProvider (`src/lib/app-store.tsx`)

C'est le fichier le plus important. Il fournit via React Context :

### ProfileInfo
```typescript
{ firstName, lastName, email, phone, role }
```
Utilisé dans : sidebar (UserProfile), dashboard (salutation), factures.

### CompanyInfo
```typescript
{ name, nif, address, sector, website, billingEmail, phone, legalText }
```
Utilisé dans : en-tête des factures, page détail facture, PDF généré.

### RegionalSettings
```typescript
{ country, tvaRate, currency, invoicePrefix, paymentDelay }
```
- `tvaRate` : utilisé pour tous les calculs de TVA (ne jamais hardcoder 0.18)
- `invoicePrefix` : préfixe du numéro de facture (ex: "FAK")
- Mapping `countryTvaRates` : change la TVA automatiquement quand on change de pays

### Invoices (CRUD)
```typescript
invoices: Invoice[]
addInvoice(invoice)
updateInvoice(id, partialData)
deleteInvoice(id)
```
Toutes les pages (dashboard, liste, détail) lisent depuis ce tableau partagé.

---

## Fonctionnalités détaillées

### 1. Dashboard
- Salutation personnalisée avec `profile.firstName`
- 4 StatCards avec variation vs mois précédent
- Tableau des 10 dernières factures (lien vers détail)

### 2. Factures — Liste (`/invoices`)
- Filtres : Tous, Brouillon, Envoyée, Payée, En retard
- Recherche par nom client ou numéro de facture
- Pagination 8 éléments par page
- **Menu action (MoreHorizontal)** sur chaque ligne :
  - Modifier → ouvre une modale d'édition complète
  - Changer le statut → sous-menu avec 4 statuts
  - Supprimer → modale de confirmation
- Click-outside ferme le menu (useRef + useEffect)

### 3. Factures — Création (`/invoices/create`)
- **Sélecteur client** : dropdown avec recherche par nom/email
- **Sélecteur facture** : charger une facture existante pour édition
- **Lignes dynamiques** : ajout/suppression, description + quantité + prix unitaire
- **Champs numériques** : `value={val || ""}` + `onFocus` clear le 0
- **Calcul auto** : sous-total, TVA (`regional.tvaRate`), total TTC
- **Prévisualisation** : panneau droit mis à jour en temps réel
- **4 boutons** :
  - Annuler → retour à `/invoices`
  - Enregistrer → crée/met à jour en brouillon
  - Télécharger PDF → enregistre + ouvre fenêtre impression HTML
  - Envoyer → enregistre avec statut "sent"
- **Anti-doublon** : `linkedInvoice` empêche la création multiple
- **Modale de succès** avec message contextuel

### 4. Factures — Détail (`/invoices/[id]`)
- Vue complète avec émetteur (`company`) et destinataire
- Actions : changer statut, supprimer
- TVA dynamique depuis le store

### 5. Clients (`/clients`)
- Liste paginée avec recherche
- CRUD via modales (ajout, édition, suppression)
- 20 clients de démonstration

### 6. Transactions (`/transactions`)
- **Page combinée** avec wallet
- En haut : carte solde total (gradient) + 3 comptes bancaires
- Ligne de stats : solde net, revenus, dépenses
- Tableau avec colonne "Ticket" (numéro facture lié)
- Recherche multi-critères (description, client, ticket, catégorie)
- Pagination 10/page

### 7. Paramètres (`/settings`)
- **Profil** : prénom, nom, email, téléphone, poste
- **Entreprise** : nom, NIF, adresse, secteur, site web, email facturation, téléphone, mentions légales
- **Facturation** : devise, TVA, préfixe facture, délai paiement
- **Notifications** : toggles pour chaque type d'alerte
- **Sécurité** : changement mot de passe, 2FA, sessions actives
- **Régional** : langue, fuseau, format date/nombres, pays (TVA auto)
- **Modale personnalisée** à l'enregistrement (pas de dialog navigateur)
- Tous les champs sont des controlled inputs

### 8. Thème sombre
- Toggle dans la sidebar
- CSS variables redéfinies dans `.dark {}`
- Persistance `localStorage("faktura-theme")`

---

## Design system — Règles à respecter

### Couleurs
```
Brand principal : #1A7A6D (brand-500)
Brand clair    : #EDF5F3 (brand-50)
Texte titre    : #111827 (text-heading)
Texte corps    : #4B5563 (text-body)
Texte discret  : #9CA3AF (text-muted)
```

### Statuts
```
Payée    : #16A34A (status-paid)     bg: status-paid-bg
Envoyée  : #EA580C (status-sent)     bg: status-sent-bg
Brouillon: #6B7280 (status-draft)    bg: status-draft-bg
En retard: #DC2626 (status-overdue)  bg: status-overdue-bg
```

### Patterns UI réutilisables
```css
/* Carte */
bg-card rounded-2xl shadow-card

/* Overlay modale */
fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in

/* Contenu modale */
bg-card rounded-2xl shadow-lg max-w-{taille} w-full p-6 animate-fade-in-up

/* Input */
border border-gray-200 rounded-lg text-sm text-heading
focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400

/* Bouton primaire */
bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600

/* Bouton secondaire */
border border-gray-200 rounded-lg text-sm font-medium text-body hover:bg-gray-50

/* Bouton danger */
text-status-overdue hover:bg-status-overdue-bg

/* Dropdown */
bg-card border border-gray-200 rounded-lg shadow-lg z-20 py-1
```

### Icônes
Toujours `lucide-react`. Tailles : 14-20px selon le contexte.

---

## Règles impératives

1. **Langue UI** : tout en français. Code en anglais (camelCase).
2. **Devise** : utiliser `formatFCFA(montant)` — jamais formater manuellement.
3. **Dates** : utiliser `formatDate(isoString)` — format DD/MM/YYYY.
4. **TVA** : toujours `regional.tvaRate / 100` — jamais `0.18` en dur.
5. **État** : utiliser `useAppStore()` — jamais `currentUser` de `data.ts`.
6. **Inputs** : toujours `value` + `onChange` (controlled) — jamais `defaultValue`.
7. **Modales** : composants custom — jamais `alert()`, `confirm()`, `prompt()`.
8. **Classes** : utiliser `cn()` pour les conditions — jamais de ternaire dans className.
9. **Layouts** : chaque page a un `layout.tsx` qui wrap avec `DashboardLayout`.
10. **Types** : définis dans `src/types/index.ts` — ne pas créer de types inline.

---

## Données de démonstration

- **20 clients** : entreprises togolaises et béninoises réalistes
- **20 factures** : montants en FCFA, statuts variés, lignes multiples
- **20 transactions** : revenus (factures payées) et dépenses (loyer, logiciels, etc.)
- **3 comptes wallet** : Ecobank, BSIC, Mobile Money (Flooz/T-Money)

---

## Commandes

```bash
npm run dev      # Dev server (http://localhost:3000)
npm run build    # Build production + vérification TypeScript/ESLint
npm run lint     # Lint seul
```

---

## Prochaines étapes prévues

1. **Supabase** : authentification, base de données, stockage
2. **Envoi email** : le bouton "Envoyer" ne fait que changer le statut pour l'instant
3. **PDF serveur** : remplacer `window.print()` par génération côté serveur
4. **i18n** : support anglais
5. **Analytics** : graphiques revenus/dépenses sur le dashboard
6. **Notifications push** : alertes factures en retard
