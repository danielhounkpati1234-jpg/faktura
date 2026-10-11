import { NavItem, Invoice, Stat, UserProfile, Client, Transaction, WalletAccount } from "@/types";

export const navItems: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Factures", href: "/invoices", icon: "FileText" },
  { label: "Clients", href: "/clients", icon: "Users" },
];

export const stats: Stat[] = [
  {
    label: "Revenu total",
    value: "4 250 000 FCFA",
    change: 12.5,
    changeLabel: "vs. mois dernier",
    icon: "TrendingUp",
  },
  {
    label: "Factures envoyées",
    value: "24",
    change: 8.3,
    changeLabel: "vs. mois dernier",
    icon: "Send",
  },
  {
    label: "Factures payées",
    value: "18",
    change: 15.0,
    changeLabel: "vs. mois dernier",
    icon: "CheckCircle",
  },
  {
    label: "Factures en retard",
    value: "3",
    change: -25.0,
    changeLabel: "vs. mois dernier",
    icon: "Clock",
  },
];

export const clients: Client[] = [
  { id: "c1", name: "Entreprise Koffi & Fils", email: "contact@koffi-fils.com", phone: "+228 90 12 34 56", address: "Quartier Bè, Lomé, Togo" },
  { id: "c2", name: "Agence Cansaas", email: "cansaas.creatinf@gmail.com", phone: "+228 91 23 45 67", address: "123 Rue Mapple, Metropolis" },
  { id: "c3", name: "Studio Graphik Plus", email: "info@graphikplus.com", phone: "+228 92 34 56 78", address: "Avenue de la Libération, Lomé" },
  { id: "c4", name: "Digital Wave Agency", email: "hello@digitalwave.io", phone: "+229 97 45 67 89", address: "Boulevard Saint-Michel, Cotonou, Bénin" },
  { id: "c5", name: "Boulangerie Le Bon Pain", email: "commande@lebonpain.tg", phone: "+228 93 56 78 90", address: "Marché Adawlato, Lomé, Togo" },
  { id: "c6", name: "Transport Etoile du Sud", email: "facturation@etoiledusud.bj", phone: "+229 96 67 89 01", address: "Gare routière, Cotonou, Bénin" },
  { id: "c7", name: "Clinique Sainte-Marie", email: "admin@clinique-sm.com", phone: "+228 90 78 90 12", address: "Tokoin, Lomé, Togo" },
  { id: "c8", name: "Hotel Palm Beach", email: "reservation@palmbeach.tg", phone: "+228 91 89 01 23", address: "Route de Kpalimé, Lomé, Togo" },
  { id: "c9", name: "Supermarché Étoile", email: "achats@etoile-super.com", phone: "+228 90 11 22 33", address: "Hédzranawoé, Lomé, Togo" },
  { id: "c10", name: "Cabinet Juridique Mensah", email: "contact@mensah-law.com", phone: "+228 91 44 55 66", address: "Boulevard du 13 Janvier, Lomé" },
  { id: "c11", name: "Pharmacie Centrale", email: "pharma.centrale@gmail.com", phone: "+228 92 77 88 99", address: "Rue du Commerce, Lomé, Togo" },
  { id: "c12", name: "Auto-École Progrès", email: "info@ae-progres.tg", phone: "+228 93 00 11 22", address: "Agoè, Lomé, Togo" },
  { id: "c13", name: "Restaurant Le Bénin", email: "reservation@lebenin.bj", phone: "+229 97 33 44 55", address: "Ganhi, Cotonou, Bénin" },
  { id: "c14", name: "Imprimerie Moderne", email: "devis@imprimerie-moderne.tg", phone: "+228 90 66 77 88", address: "Zone Portuaire, Lomé, Togo" },
  { id: "c15", name: "Agence Immobilière Soleil", email: "contact@immo-soleil.com", phone: "+228 91 99 00 11", address: "Kodjoviakopé, Lomé, Togo" },
  { id: "c16", name: "Garage Mécanique Diallo", email: "garage.diallo@gmail.com", phone: "+228 92 22 33 44", address: "Baguida, Lomé, Togo" },
  { id: "c17", name: "École Privée Avenir", email: "direction@ecole-avenir.tg", phone: "+228 93 55 66 77", address: "Adidogomé, Lomé, Togo" },
  { id: "c18", name: "Boutique Mode Élégance", email: "elegance.mode@gmail.com", phone: "+228 90 88 99 00", address: "Grand Marché, Lomé, Togo" },
  { id: "c19", name: "Société Générale Bâtiment", email: "projets@sgb-construct.com", phone: "+229 96 11 22 33", address: "Akpakpa, Cotonou, Bénin" },
  { id: "c20", name: "Cyber Café Connect", email: "contact@cyberconnect.tg", phone: "+228 91 44 55 66", address: "Campus UL, Lomé, Togo" },
];

export const recentInvoices: Invoice[] = [
  {
    id: "1", number: "FAK-2026-0042", clientId: "c1",
    clientName: "Entreprise Koffi & Fils", clientEmail: "contact@koffi-fils.com",
    amount: 750000, status: "paid", issueDate: "2026-09-01", dueDate: "2026-09-30",
    lines: [
      { id: "l1", description: "Création logo", quantity: 1, unitPrice: 350000 },
      { id: "l2", description: "Charte graphique", quantity: 1, unitPrice: 285000 },
    ],
  },
  {
    id: "2", number: "FAK-2026-0041", clientId: "c2",
    clientName: "Agence Cansaas", clientEmail: "cansaas.creatinf@gmail.com",
    amount: 1250000, status: "sent", issueDate: "2026-09-15", dueDate: "2026-10-15",
    lines: [
      { id: "l3", description: "Brand Guidelines", quantity: 2, unitPrice: 250000 },
      { id: "l4", description: "Logo Usage", quantity: 3, unitPrice: 150000 },
      { id: "l5", description: "Color Palette", quantity: 1, unitPrice: 300000 },
    ],
  },
  {
    id: "3", number: "FAK-2026-0040", clientId: "c3",
    clientName: "Studio Graphik Plus", clientEmail: "info@graphikplus.com",
    amount: 320000, status: "overdue", issueDate: "2026-08-10", dueDate: "2026-09-10",
    lines: [
      { id: "l6", description: "Design flyer", quantity: 2, unitPrice: 85000 },
      { id: "l7", description: "Retouche photo", quantity: 3, unitPrice: 50000 },
    ],
  },
  {
    id: "4", number: "FAK-2026-0039", clientId: "c4",
    clientName: "Digital Wave Agency", clientEmail: "hello@digitalwave.io",
    amount: 2100000, status: "paid", issueDate: "2026-08-20", dueDate: "2026-09-20",
    lines: [
      { id: "l8", description: "Développement site web", quantity: 1, unitPrice: 1500000 },
      { id: "l9", description: "Hébergement annuel", quantity: 1, unitPrice: 250000 },
      { id: "l10", description: "Maintenance mensuelle", quantity: 2, unitPrice: 175000 },
    ],
  },
  {
    id: "5", number: "FAK-2026-0038", clientId: "c5",
    clientName: "Boulangerie Le Bon Pain", clientEmail: "commande@lebonpain.tg",
    amount: 185000, status: "draft", issueDate: "2026-10-01", dueDate: "2026-10-31",
    lines: [
      { id: "l11", description: "Design emballage", quantity: 1, unitPrice: 120000 },
      { id: "l12", description: "Impression étiquettes", quantity: 500, unitPrice: 130 },
    ],
  },
  {
    id: "6", number: "FAK-2026-0037", clientId: "c6",
    clientName: "Transport Etoile du Sud", clientEmail: "facturation@etoiledusud.bj",
    amount: 890000, status: "paid", issueDate: "2026-09-05", dueDate: "2026-10-05",
    lines: [
      { id: "l13", description: "Identité visuelle", quantity: 1, unitPrice: 500000 },
      { id: "l14", description: "Cartes de visite", quantity: 1000, unitPrice: 390 },
    ],
  },
  {
    id: "7", number: "FAK-2026-0036", clientId: "c7",
    clientName: "Clinique Sainte-Marie", clientEmail: "admin@clinique-sm.com",
    amount: 1450000, status: "sent", issueDate: "2026-09-25", dueDate: "2026-10-25",
    lines: [
      { id: "l15", description: "Application mobile", quantity: 1, unitPrice: 1200000 },
      { id: "l16", description: "Formation équipe", quantity: 1, unitPrice: 250000 },
    ],
  },
  {
    id: "8", number: "FAK-2026-0035", clientId: "c8",
    clientName: "Hotel Palm Beach", clientEmail: "reservation@palmbeach.tg",
    amount: 3200000, status: "overdue", issueDate: "2026-07-15", dueDate: "2026-08-15",
    lines: [
      { id: "l17", description: "Refonte site web", quantity: 1, unitPrice: 2000000 },
      { id: "l18", description: "Système réservation en ligne", quantity: 1, unitPrice: 800000 },
      { id: "l19", description: "Formation personnel", quantity: 2, unitPrice: 200000 },
    ],
  },
  {
    id: "9", number: "FAK-2026-0034", clientId: "c9",
    clientName: "Supermarché Étoile", clientEmail: "achats@etoile-super.com",
    amount: 450000, status: "paid", issueDate: "2026-08-01", dueDate: "2026-08-31",
    lines: [
      { id: "l20", description: "Catalogue produits", quantity: 1, unitPrice: 300000 },
      { id: "l21", description: "Photos produits", quantity: 50, unitPrice: 3000 },
    ],
  },
  {
    id: "10", number: "FAK-2026-0033", clientId: "c10",
    clientName: "Cabinet Juridique Mensah", clientEmail: "contact@mensah-law.com",
    amount: 680000, status: "sent", issueDate: "2026-09-20", dueDate: "2026-10-20",
    lines: [
      { id: "l22", description: "Site vitrine", quantity: 1, unitPrice: 500000 },
      { id: "l23", description: "Rédaction contenu", quantity: 1, unitPrice: 180000 },
    ],
  },
  {
    id: "11", number: "FAK-2026-0032", clientId: "c11",
    clientName: "Pharmacie Centrale", clientEmail: "pharma.centrale@gmail.com",
    amount: 275000, status: "draft", issueDate: "2026-10-05", dueDate: "2026-11-05",
    lines: [
      { id: "l24", description: "Flyers promotionnels", quantity: 1000, unitPrice: 150 },
      { id: "l25", description: "Bannière web", quantity: 5, unitPrice: 25000 },
    ],
  },
  {
    id: "12", number: "FAK-2026-0031", clientId: "c12",
    clientName: "Auto-École Progrès", clientEmail: "info@ae-progres.tg",
    amount: 520000, status: "paid", issueDate: "2026-07-20", dueDate: "2026-08-20",
    lines: [
      { id: "l26", description: "Logo et identité", quantity: 1, unitPrice: 350000 },
      { id: "l27", description: "Panneaux signalétiques", quantity: 4, unitPrice: 42500 },
    ],
  },
  {
    id: "13", number: "FAK-2026-0030", clientId: "c13",
    clientName: "Restaurant Le Bénin", clientEmail: "reservation@lebenin.bj",
    amount: 980000, status: "overdue", issueDate: "2026-07-01", dueDate: "2026-08-01",
    lines: [
      { id: "l28", description: "Design menu", quantity: 1, unitPrice: 180000 },
      { id: "l29", description: "Shooting photo plats", quantity: 1, unitPrice: 400000 },
      { id: "l30", description: "Site web réservation", quantity: 1, unitPrice: 400000 },
    ],
  },
  {
    id: "14", number: "FAK-2026-0029", clientId: "c14",
    clientName: "Imprimerie Moderne", clientEmail: "devis@imprimerie-moderne.tg",
    amount: 1100000, status: "paid", issueDate: "2026-08-15", dueDate: "2026-09-15",
    lines: [
      { id: "l31", description: "Catalogue annuel", quantity: 1, unitPrice: 800000 },
      { id: "l32", description: "Mise en page magazine", quantity: 1, unitPrice: 300000 },
    ],
  },
  {
    id: "15", number: "FAK-2026-0028", clientId: "c15",
    clientName: "Agence Immobilière Soleil", clientEmail: "contact@immo-soleil.com",
    amount: 1750000, status: "sent", issueDate: "2026-09-10", dueDate: "2026-10-10",
    lines: [
      { id: "l33", description: "Plateforme immobilière", quantity: 1, unitPrice: 1500000 },
      { id: "l34", description: "Photos immobilières", quantity: 10, unitPrice: 25000 },
    ],
  },
  {
    id: "16", number: "FAK-2026-0027", clientId: "c16",
    clientName: "Garage Mécanique Diallo", clientEmail: "garage.diallo@gmail.com",
    amount: 195000, status: "draft", issueDate: "2026-10-08", dueDate: "2026-11-08",
    lines: [
      { id: "l35", description: "Carte de visite", quantity: 500, unitPrice: 190 },
      { id: "l36", description: "Enseigne extérieure", quantity: 1, unitPrice: 100000 },
    ],
  },
  {
    id: "17", number: "FAK-2026-0026", clientId: "c17",
    clientName: "École Privée Avenir", clientEmail: "direction@ecole-avenir.tg",
    amount: 2400000, status: "paid", issueDate: "2026-06-15", dueDate: "2026-07-15",
    lines: [
      { id: "l37", description: "Site web école", quantity: 1, unitPrice: 1200000 },
      { id: "l38", description: "Portail parents", quantity: 1, unitPrice: 800000 },
      { id: "l39", description: "Application mobile", quantity: 1, unitPrice: 400000 },
    ],
  },
  {
    id: "18", number: "FAK-2026-0025", clientId: "c18",
    clientName: "Boutique Mode Élégance", clientEmail: "elegance.mode@gmail.com",
    amount: 560000, status: "paid", issueDate: "2026-08-25", dueDate: "2026-09-25",
    lines: [
      { id: "l40", description: "Boutique en ligne", quantity: 1, unitPrice: 400000 },
      { id: "l41", description: "Photos collection", quantity: 40, unitPrice: 4000 },
    ],
  },
  {
    id: "19", number: "FAK-2026-0024", clientId: "c19",
    clientName: "Société Générale Bâtiment", clientEmail: "projets@sgb-construct.com",
    amount: 3500000, status: "sent", issueDate: "2026-09-28", dueDate: "2026-10-28",
    lines: [
      { id: "l42", description: "Site corporate", quantity: 1, unitPrice: 2000000 },
      { id: "l43", description: "Vidéo entreprise", quantity: 1, unitPrice: 1000000 },
      { id: "l44", description: "Drone chantier", quantity: 2, unitPrice: 250000 },
    ],
  },
  {
    id: "20", number: "FAK-2026-0023", clientId: "c20",
    clientName: "Cyber Café Connect", clientEmail: "contact@cyberconnect.tg",
    amount: 145000, status: "draft", issueDate: "2026-10-10", dueDate: "2026-11-10",
    lines: [
      { id: "l45", description: "Logo simple", quantity: 1, unitPrice: 100000 },
      { id: "l46", description: "Page Facebook", quantity: 1, unitPrice: 45000 },
    ],
  },
];

export const transactions: Transaction[] = [
  { id: "t1", description: "Paiement facture FAK-2026-0042", amount: 750000, type: "income", category: "Factures", date: "2026-09-28", clientName: "Entreprise Koffi & Fils", invoiceNumber: "FAK-2026-0042", paymentMethod: "Virement bancaire" },
  { id: "t2", description: "Paiement facture FAK-2026-0039", amount: 2100000, type: "income", category: "Factures", date: "2026-09-18", clientName: "Digital Wave Agency", invoiceNumber: "FAK-2026-0039", paymentMethod: "Virement bancaire" },
  { id: "t3", description: "Abonnement Adobe Creative Cloud", amount: 35000, type: "expense", category: "Logiciels", date: "2026-10-01", paymentMethod: "Carte bancaire" },
  { id: "t4", description: "Paiement facture FAK-2026-0037", amount: 890000, type: "income", category: "Factures", date: "2026-10-03", clientName: "Transport Etoile du Sud", invoiceNumber: "FAK-2026-0037", paymentMethod: "Mobile Money" },
  { id: "t5", description: "Loyer bureau octobre", amount: 250000, type: "expense", category: "Loyer", date: "2026-10-01", paymentMethod: "Virement bancaire" },
  { id: "t6", description: "Achat matériel informatique", amount: 480000, type: "expense", category: "Équipement", date: "2026-09-22", paymentMethod: "Carte bancaire" },
  { id: "t7", description: "Paiement facture FAK-2026-0034", amount: 450000, type: "income", category: "Factures", date: "2026-08-29", clientName: "Supermarché Étoile", invoiceNumber: "FAK-2026-0034", paymentMethod: "Chèque" },
  { id: "t8", description: "Facture électricité", amount: 45000, type: "expense", category: "Charges", date: "2026-09-15", paymentMethod: "Mobile Money" },
  { id: "t9", description: "Paiement facture FAK-2026-0031", amount: 520000, type: "income", category: "Factures", date: "2026-08-18", clientName: "Auto-École Progrès", invoiceNumber: "FAK-2026-0031", paymentMethod: "Virement bancaire" },
  { id: "t10", description: "Abonnement hébergement web", amount: 15000, type: "expense", category: "Logiciels", date: "2026-10-05", paymentMethod: "Carte bancaire" },
  { id: "t11", description: "Paiement facture FAK-2026-0029", amount: 1100000, type: "income", category: "Factures", date: "2026-09-12", clientName: "Imprimerie Moderne", invoiceNumber: "FAK-2026-0029", paymentMethod: "Virement bancaire" },
  { id: "t12", description: "Fournitures de bureau", amount: 28000, type: "expense", category: "Fournitures", date: "2026-09-08", paymentMethod: "Espèces" },
  { id: "t13", description: "Paiement facture FAK-2026-0026", amount: 2400000, type: "income", category: "Factures", date: "2026-07-12", clientName: "École Privée Avenir", invoiceNumber: "FAK-2026-0026", paymentMethod: "Virement bancaire" },
  { id: "t14", description: "Assurance professionnelle", amount: 120000, type: "expense", category: "Assurance", date: "2026-09-01", paymentMethod: "Virement bancaire" },
  { id: "t15", description: "Paiement facture FAK-2026-0025", amount: 560000, type: "income", category: "Factures", date: "2026-09-22", clientName: "Boutique Mode Élégance", invoiceNumber: "FAK-2026-0025", paymentMethod: "Mobile Money" },
  { id: "t16", description: "Internet fibre optique", amount: 35000, type: "expense", category: "Charges", date: "2026-10-03", paymentMethod: "Mobile Money" },
  { id: "t17", description: "Formation design UX", amount: 150000, type: "expense", category: "Formation", date: "2026-09-10", paymentMethod: "Carte bancaire" },
  { id: "t18", description: "Salaire développeur freelance", amount: 400000, type: "expense", category: "Sous-traitance", date: "2026-09-30", paymentMethod: "Virement bancaire" },
  { id: "t19", description: "Paiement partiel FAK-2026-0035", amount: 1500000, type: "income", category: "Factures", date: "2026-08-10", clientName: "Hotel Palm Beach", invoiceNumber: "FAK-2026-0035", paymentMethod: "Chèque" },
  { id: "t20", description: "Déplacement client Cotonou", amount: 85000, type: "expense", category: "Déplacements", date: "2026-09-18", paymentMethod: "Espèces" },
];

export const walletAccounts: WalletAccount[] = [
  { id: "w1", name: "Compte principal", bank: "Ecobank Togo", balance: 3450000, accountNumber: "****4521", type: "checking" },
  { id: "w2", name: "Compte épargne", bank: "BSIC Togo", balance: 1800000, accountNumber: "****7893", type: "savings" },
  { id: "w3", name: "Compte Mobile Money", bank: "Flooz / T-Money", balance: 285000, accountNumber: "****9012", type: "checking" },
];

export const currentUser: UserProfile = {
  name: "Daniel Hounkpati",
  email: "daniel@faktura.io",
  avatarInitials: "DH",
};
