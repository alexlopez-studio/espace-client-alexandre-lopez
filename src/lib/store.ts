import { AppState, DocumentItem, ViewingReport, SalesStep, BuyerOffer, PortalStat, ClientRecord, AdvisorInfo } from '../types';
import { clientInfo, advisorInfo, propertyDetails, pointsForts, pointsDefendre, cadastralParcels, marketPriceRanges, soldComparables } from '../data';

// Helper to generate dynamic dates relative to today
const getDateDaysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const defaultDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Diagnostic de Performance Énergétique (DPE)',
    category: 'Diagnostic',
    size: '2.4 MB',
    dateAdded: getDateDaysAgo(3),
    status: 'Valide',
    uploadedBy: 'Conseiller',
    fileUrl: '#'
  },
  {
    id: 'doc-2',
    name: 'Plan Local d\'Urbanisme (PLU) - Extrait Cadastral',
    category: 'Urbanisme',
    size: '5.1 MB',
    dateAdded: getDateDaysAgo(2),
    status: 'Valide',
    uploadedBy: 'Conseiller',
    fileUrl: '#'
  },
  {
    id: 'doc-3',
    name: 'Titre de Propriété Officiel',
    category: 'Titre de Propriété',
    size: '8.2 MB',
    dateAdded: getDateDaysAgo(1),
    status: 'À valider',
    uploadedBy: 'Vendeur',
    fileUrl: '#'
  },
  {
    id: 'doc-4',
    name: 'Taxe Foncière Municipale 2025',
    category: 'Taxes',
    size: '1.1 MB',
    dateAdded: getDateDaysAgo(2),
    status: 'Valide',
    uploadedBy: 'Vendeur',
    fileUrl: '#'
  },
  {
    id: 'doc-5',
    name: 'Avis d\'Imposition sur le Revenu',
    category: 'Taxes',
    size: '0 KB',
    dateAdded: '',
    status: 'Manquant',
    uploadedBy: 'Vendeur'
  },
  {
    id: 'doc-6',
    name: 'Rapport d\'Électricité & d\'Assainissement',
    category: 'Diagnostic',
    size: '3.6 MB',
    dateAdded: getDateDaysAgo(0),
    status: 'À valider',
    uploadedBy: 'Conseiller',
    fileUrl: '#'
  }
];

export const defaultViewings: ViewingReport[] = [
  {
    id: 'view-1',
    date: getDateDaysAgo(1),
    buyerName: 'M. & Mme Laurent',
    rating: 4,
    solvencyStatus: 'Validée',
    comment: 'Coup de cœur pour l\'emplacement, la vue dégagée et le calme de l\'impasse. Quelques réserves sur l\'accès avec les escaliers de l\'entrée, mais le grand garage est un énorme plus. Ils étudient le financement pour formuler une offre.',
    interestLevel: 'Élevé'
  },
  {
    id: 'view-2',
    date: getDateDaysAgo(2),
    buyerName: 'Famille Delmas (Fabrice et Sophie)',
    rating: 5,
    solvencyStatus: 'Validée',
    comment: 'Parfaitement adapté à leurs besoins. Ont adoré la maison principale ainsi que la chambre indépendante en sous-sol qui convient parfaitement pour leur fils adolescent. Offre écrite déposée directement au prix recommandé.',
    interestLevel: 'Offre formulée'
  },
  {
    id: 'view-3',
    date: getDateDaysAgo(4),
    buyerName: 'M. Thomas',
    rating: 2,
    solvencyStatus: 'En cours',
    comment: 'Trouve que le terrain en plusieurs restanques est trop contraignant pour de jeunes enfants en bas âge. Ils cherchent un jardin plat.',
    interestLevel: 'Faible'
  },
  {
    id: 'view-4',
    date: getDateDaysAgo(6),
    buyerName: 'Mme Dupuis Martine',
    rating: 3,
    solvencyStatus: 'Validée',
    comment: 'Apprécie beaucoup le calme et l\'état de la maison. Craint cependant l\'exposition est/ouest pour le vent (Mistral). Doit réaliser une contre-visite technique pour estimer un projet paysager sur les terrasses.',
    interestLevel: 'Moyen'
  }
];

export const defaultSalesSteps: SalesStep[] = [
  {
    id: 'step-1',
    order: 1,
    title: 'Estimation & Conseil',
    description: 'Réalisation de l\'avis de valeur certifié basé sur le marché local de Marseille 11e.',
    status: 'Terminé',
    completedDate: getDateDaysAgo(2),
    responsible: 'Conseiller'
  },
  {
    id: 'step-2',
    order: 2,
    title: 'Signature du Mandat de Vente',
    description: 'Validation du mandat exclusif de confiance iad pour lancer la mise en marché.',
    status: 'Terminé',
    completedDate: getDateDaysAgo(1),
    responsible: 'Tous'
  },
  {
    id: 'step-3',
    order: 3,
    title: 'Constitution du Dossier Technique',
    description: 'Rassemblement des diagnostics immobiliers obligatoires (DPE, électricité, amiante) et documents légaux.',
    status: 'En cours',
    responsible: 'Tous'
  },
  {
    id: 'step-4',
    order: 4,
    title: 'Prise de Photos Professionnelle',
    description: 'Reportage haute définition par un photographe partenaire pour sublimer les atouts (vue dégagée, pièces).',
    status: 'A faire',
    responsible: 'Conseiller'
  },
  {
    id: 'step-5',
    order: 5,
    title: 'Diffusion Multi-Portails',
    description: 'Lancement de l\'annonce sur SeLoger, Leboncoin, iad France et plus de 100 portails.',
    status: 'A faire',
    responsible: 'Conseiller'
  },
  {
    id: 'step-6',
    order: 6,
    title: 'Qualification des Acheteurs',
    description: 'Vérification systématique de la solvabilité financière de chaque acquéreur avant d\'organiser les visites.',
    status: 'A faire',
    responsible: 'Conseiller'
  },
  {
    id: 'step-7',
    order: 7,
    title: 'Visites Physiques & Débriefing',
    description: 'Organisation des visites avec les acquéreurs qualifiés et transmission d\'un compte rendu systématique.',
    status: 'A faire',
    responsible: 'Conseiller'
  },
  {
    id: 'step-8',
    order: 8,
    title: 'Négociation & Réception d\'Offres',
    description: 'Collecte des offres d\'achat écrites et négociation rigoureuse pour préserver la valeur de votre bien.',
    status: 'A faire',
    responsible: 'Conseiller'
  },
  {
    id: 'step-9',
    order: 9,
    title: 'Signature de l\'Avant-Contrat',
    description: 'Rédaction et signature du compromis de vente chez le notaire.',
    status: 'A faire',
    responsible: 'Tous'
  },
  {
    id: 'step-10',
    order: 10,
    title: 'Acte Authentique & Remise des Clés',
    description: 'Signature de l\'acte de vente final chez le notaire et libération des fonds sous 3 mois.',
    status: 'A faire',
    responsible: 'Tous'
  }
];

export const defaultOffers: BuyerOffer[] = [
  {
    id: 'offer-1',
    buyerName: 'Famille Delmas (Fabrice et Sophie)',
    price: 405000,
    date: getDateDaysAgo(2),
    financingType: 'Emprunt Bancaire',
    financingDetails: 'Apport de 85 000 € (vente de leur ancien bien signée) + Prêt de 320 000 € validé par courtier.',
    solvencyCertificate: true,
    status: 'Reçue',
    comments: 'Offre écrite formulée au prix de 405 000 € honoraires inclus. Profil d\'acquéreurs d\'une excellente solvabilité avec dossier courtier au vert.'
  },
  {
    id: 'offer-2',
    buyerName: 'Mme Dupuis Martine',
    price: 385000,
    date: getDateDaysAgo(4),
    financingType: 'Mixte',
    financingDetails: 'Crédit relais sur un appartement en cours, apport de 150 000 €.',
    solvencyCertificate: false,
    status: 'Refusée',
    comments: 'Offre jugée trop basse et assortie de conditions de vente en cascade complexes.'
  }
];

export const defaultPortalStats: PortalStat[] = [
  {
    portalName: 'Leboncoin.fr',
    views: 1840,
    detailedViews: 320,
    contacts: 14,
    phoneClicks: 22,
    performanceIndex: 88,
    history: [
      { date: 'Sem 1', views: 420, detailedViews: 70, contacts: 2, phoneClicks: 4 },
      { date: 'Sem 2', views: 510, detailedViews: 90, contacts: 4, phoneClicks: 6 },
      { date: 'Sem 3', views: 430, detailedViews: 75, contacts: 3, phoneClicks: 5 },
      { date: 'Sem 4', views: 480, detailedViews: 85, contacts: 5, phoneClicks: 7 }
    ]
  },
  {
    portalName: 'SeLoger.com',
    views: 1240,
    detailedViews: 240,
    contacts: 11,
    phoneClicks: 15,
    performanceIndex: 82,
    history: [
      { date: 'Sem 1', views: 280, detailedViews: 50, contacts: 2, phoneClicks: 3 },
      { date: 'Sem 2', views: 320, detailedViews: 65, contacts: 3, phoneClicks: 4 },
      { date: 'Sem 3', views: 310, detailedViews: 60, contacts: 2, phoneClicks: 3 },
      { date: 'Sem 4', views: 330, detailedViews: 65, contacts: 4, phoneClicks: 5 }
    ]
  },
  {
    portalName: 'iad France',
    views: 820,
    detailedViews: 190,
    contacts: 8,
    phoneClicks: 12,
    performanceIndex: 90,
    history: [
      { date: 'Sem 1', views: 150, detailedViews: 35, contacts: 1, phoneClicks: 2 },
      { date: 'Sem 2', views: 220, detailedViews: 50, contacts: 2, phoneClicks: 3 },
      { date: 'Sem 3', views: 210, detailedViews: 48, contacts: 2, phoneClicks: 3 },
      { date: 'Sem 4', views: 240, detailedViews: 57, contacts: 3, phoneClicks: 4 }
    ]
  },
  {
    portalName: 'Logic-Immo',
    views: 420,
    detailedViews: 60,
    contacts: 3,
    phoneClicks: 4,
    performanceIndex: 65,
    history: [
      { date: 'Sem 1', views: 90, detailedViews: 12, contacts: 0, phoneClicks: 1 },
      { date: 'Sem 2', views: 110, detailedViews: 16, contacts: 1, phoneClicks: 1 },
      { date: 'Sem 3', views: 100, detailedViews: 14, contacts: 1, phoneClicks: 1 },
      { date: 'Sem 4', views: 120, detailedViews: 18, contacts: 1, phoneClicks: 1 }
    ]
  }
];

export const defaultClients: ClientRecord[] = [
  {
    id: 'client-verger',
    clientInfo: {
      names: "Mme et M. Verger Alain / Yvette",
      address: "30 Boulevard des Catacholis, 13011 Marseille",
      date: "10 juillet 2026",
      projectTitle: "Dossier de commercialisation & Suivi de vente"
    },
    propertyDetails: {
      surface: 125,
      rooms: 5,
      floors: 1,
      landSurface: 350,
      bedrooms: 4,
      year: 1940,
      address: "30 Boulevard des Catacholis, 13011 Marseille",
      description: "Maison de 5 pièces de 125 m² environ sur 350 m² de parcelle (contenance cadastrale 343 m²). Elle comprend 3 chambres dans la maison principale et une chambre supplémentaire aménagée dans l'ancienne cave. Elle bénéficie d'un grand garage, d'une cheminée, de double vitrage, et de belles prestations générales dans un quartier calme."
    },
    pointsForts: [
      { text: "VUE DÉGAGÉE", description: "Une vue panoramique exceptionnelle sur les collines environnantes, offrant un cadre de vie particulièrement agréable et apaisant." },
      { text: "CALME ABSOLU", description: "Nichée dans une impasse d'un quartier résidentiel de Marseille 11e, à l'écart des bruits de circulation urbaine." },
      { text: "PAS DE TRAVAUX REQUIS", description: "Le bien est dans un excellent état général de conservation, avec des menuiseries récentes et des prestations de qualité." },
      { text: "GRAND GARAGE", description: "Un espace de stationnement et de stockage spacieux, un atout rare et très recherché dans le secteur de Marseille." },
      { text: "TRÈS LUMINEUX", description: "Exposition idéale permettant de bénéficier d'une luminosité naturelle optimale tout au long de la journée." }
    ],
    pointsDefendre: [
      { text: "ESCALIER D'ACCÈS", description: "La topographie du terrain et l'accès à la maison nécessitent d'emprunter des escaliers, ce qui peut gêner les personnes à mobilité réduite." },
      { text: "TERRAIN EN PLUSIEURS RESTANQUES", description: "Le jardin de 350 m² est aménagé sur plusieurs paliers (restanques traditionnelles provençales), ce qui fragmente l'espace extérieur plat." },
      { text: "CHAMBRE EN SOUS-SOL (NON DÉCLARÉE)", description: "La 4ème chambre, aménagée dans l'ancienne cave, n'est pas déclarée en surface habitable officielle d'un point de vue réglementaire." }
    ],
    documents: defaultDocuments,
    viewings: defaultViewings,
    salesSteps: defaultSalesSteps,
    offers: defaultOffers,
    portalStats: defaultPortalStats,
    cadastralParcels: cadastralParcels,
    marketPriceRanges: marketPriceRanges,
    soldComparables: soldComparables,
    recommendedPriceRange: { low: 400000, high: 420000 }
  },
  {
    id: 'client-girard',
    clientInfo: {
      names: "Mme et M. Girard Pierre / Catherine",
      address: "12 Avenue de l'Annonciade, 13008 Marseille",
      date: "11 juillet 2026",
      projectTitle: "Dossier d'accompagnement & Suivi de vente"
    },
    propertyDetails: {
      surface: 95,
      rooms: 4,
      floors: 3,
      landSurface: 120,
      bedrooms: 2,
      year: 2012,
      address: "12 Avenue de l'Annonciade, 13008 Marseille",
      description: "Appartement de standing T4 de 95 m² dans une résidence sécurisée de 2012. Balcon-terrasse de 15 m² exposé Sud-Ouest, cuisine ouverte équipée, deux chambres lumineuses, deux places de parking en sous-sol."
    },
    pointsForts: [
      { text: "RÉSIDENCE RÉCENTE (2012)", description: "Construction moderne sous garantie décennale, aucune charge de copropriété exceptionnelle à prévoir." },
      { text: "TERRASSE EXPOSÉE SUD-OUEST", description: "Espace extérieur d'angle de 15 m² offrant un ensoleillement optimal en après-midi et soirée." },
      { text: "PARKING SÉCURISÉ DOUBLE", description: "Deux places boxées en sous-sol, un atout très recherché dans le 8ème arrondissement." }
    ],
    pointsDefendre: [
      { text: "CHARGES DE COPROPRIÉTÉ ÉLEVÉES", description: "Présence d'un gardien, ascenseur et entretien des espaces verts de la résidence." },
      { text: "PROXIMITÉ RUE PASSANTE", description: "Légères nuisances sonores aux heures de pointe sur le balcon." }
    ],
    documents: [
      {
        id: 'doc-g1',
        name: 'Diagnostic de Performance Énergétique (DPE)',
        category: 'Diagnostic' as const,
        size: '1.8 MB',
        dateAdded: getDateDaysAgo(2),
        status: 'Valide' as const,
        uploadedBy: 'Conseiller' as const,
        fileUrl: '#'
      },
      {
        id: 'doc-g2',
        name: 'Procès-verbaux d\'Assemblées Générales',
        category: 'Copropriété' as const,
        size: '4.2 MB',
        dateAdded: getDateDaysAgo(3),
        status: 'Valide' as const,
        uploadedBy: 'Conseiller' as const,
        fileUrl: '#'
      },
      {
        id: 'doc-g3',
        name: 'Règlement de Copropriété Complet',
        category: 'Copropriété' as const,
        size: '6.5 MB',
        dateAdded: getDateDaysAgo(4),
        status: 'Valide' as const,
        uploadedBy: 'Vendeur' as const,
        fileUrl: '#'
      },
      {
        id: 'doc-g4',
        name: 'Titre de Propriété Officiel',
        category: 'Titre de Propriété' as const,
        size: '0 KB',
        dateAdded: '',
        status: 'Manquant' as const,
        uploadedBy: 'Vendeur' as const
      }
    ],
    viewings: [
      {
        id: 'view-g1',
        date: getDateDaysAgo(1),
        buyerName: 'M. Giraud Antoine',
        rating: 4,
        solvencyStatus: 'Validée' as const,
        comment: 'Idéal pour son projet professionnel et personnel. Adore le balcon d\'angle et la grande luminosité générale. Proximité immédiate des commerces du 8ème arrondissement.',
        interestLevel: 'Élevé' as const
      },
      {
        id: 'view-g2',
        date: getDateDaysAgo(3),
        buyerName: 'Mme Laroche Nicole',
        rating: 2,
        solvencyStatus: 'En cours' as const,
        comment: 'Trouve les charges de copropriété trop élevées par rapport à son budget mensuel serré, malgré un coup de cœur pour l\'agencement.',
        interestLevel: 'Faible' as const
      }
    ],
    salesSteps: defaultSalesSteps.map(step => {
      if (step.order <= 2) {
        return { ...step, status: 'Terminé' as const, completedDate: getDateDaysAgo(3) };
      }
      if (step.order === 3) {
        return { ...step, status: 'En cours' as const };
      }
      return { ...step, status: 'A faire' as const };
    }),
    offers: [
      {
        id: 'offer-g1',
        buyerName: 'M. Giraud Antoine',
        price: 390000,
        date: getDateDaysAgo(1),
        financingType: 'Emprunt Bancaire' as const,
        financingDetails: 'Apport de 60 000 € + Crédit de 330 000 € avec accord de principe de la banque.',
        solvencyCertificate: true,
        status: 'Reçue' as const,
        comments: 'Offre écrite d\'achat à 390k€ honoraires inclus (mandat à 410k€). Financement particulièrement solide.'
      }
    ],
    portalStats: defaultPortalStats.map(portal => ({
      ...portal,
      views: Math.round(portal.views * 0.75),
      detailedViews: Math.round(portal.detailedViews * 0.8),
      contacts: Math.round(portal.contacts * 0.6),
      phoneClicks: Math.round(portal.phoneClicks * 0.7)
    })),
    cadastralParcels: [
      { section: "A", prefixe: "124", numero: "45", superficie: 120 }
    ],
    marketPriceRanges: {
      low: 4100,
      median: 4800,
      high: 5600,
      currentReferencePrice: 400000,
      currentReferencePricePerSqm: 4210
    },
    soldComparables: [
      {
        id: "comp-g1",
        title: "Appartement standing T4 92 m²",
        price: 395000,
        pricePerSqm: 4293,
        surface: 92,
        landSurface: 0,
        rooms: 4,
        bedrooms: 2,
        address: "10 Avenue de l'Annonciade, 13008 Marseille",
        soldDate: "il y a 3 mois"
      },
      {
        id: "comp-g2",
        title: "Appartement T4 98 m²",
        price: 412000,
        pricePerSqm: 4204,
        surface: 98,
        landSurface: 0,
        rooms: 4,
        bedrooms: 3,
        address: "Avenue de Hambourg, 13008 Marseille",
        soldDate: "il y a 6 mois"
      }
    ],
    recommendedPriceRange: { low: 390000, high: 410000 }
  }
];

const LOCAL_STORAGE_KEY = 'iad_estimation_app_state_v1';
const MULTI_CLIENT_STORAGE_KEY = 'iad_estimation_multi_client_state_v1';

export interface MultiClientState {
  currentClientId: string;
  clients: ClientRecord[];
  advisorInfo: AdvisorInfo;
}

export const getMultiClientState = (): MultiClientState => {
  const saved = localStorage.getItem(MULTI_CLIENT_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.clients && parsed.clients.length > 0) {
        return {
          currentClientId: parsed.currentClientId || 'client-verger',
          clients: parsed.clients,
          advisorInfo: parsed.advisorInfo || advisorInfo
        };
      }
    } catch (e) {
      console.error('Error parsing multi-client state', e);
    }
  }

  // Fallback / First time setup
  // Let's migrate single-client saved data if it exists!
  const legacySaved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (legacySaved) {
    try {
      const parsed = JSON.parse(legacySaved);
      const migratedClients = [
        {
          id: 'client-verger',
          clientInfo: parsed.clientInfo || defaultClients[0].clientInfo,
          propertyDetails: parsed.propertyDetails || defaultClients[0].propertyDetails,
          pointsForts: parsed.pointsForts || defaultClients[0].pointsForts,
          pointsDefendre: parsed.pointsDefendre || defaultClients[0].pointsDefendre,
          documents: parsed.documents || defaultClients[0].documents,
          viewings: parsed.viewings || defaultClients[0].viewings,
          salesSteps: parsed.salesSteps || defaultClients[0].salesSteps,
          offers: parsed.offers || defaultClients[0].offers,
          portalStats: parsed.portalStats || defaultClients[0].portalStats
        },
        defaultClients[1] // Keep the preloaded 2nd client for testing switching!
      ];
      return {
        currentClientId: 'client-verger',
        clients: migratedClients,
        advisorInfo: parsed.advisorInfo || advisorInfo
      };
    } catch (e) {
      console.error('Error migrating single client state', e);
    }
  }

  return {
    currentClientId: 'client-verger',
    clients: defaultClients,
    advisorInfo: advisorInfo
  };
};

export const saveMultiClientState = (state: MultiClientState): void => {
  localStorage.setItem(MULTI_CLIENT_STORAGE_KEY, JSON.stringify(state));
};

export const getInitialState = (): AppState => {
  const multiState = getMultiClientState();
  const currentClient = multiState.clients.find(c => c.id === multiState.currentClientId) || multiState.clients[0];
  return {
    clientInfo: currentClient.clientInfo,
    advisorInfo: multiState.advisorInfo,
    propertyDetails: currentClient.propertyDetails,
    pointsForts: currentClient.pointsForts,
    pointsDefendre: currentClient.pointsDefendre,
    documents: currentClient.documents,
    viewings: currentClient.viewings,
    salesSteps: currentClient.salesSteps,
    offers: currentClient.offers,
    portalStats: currentClient.portalStats,
    cadastralParcels: currentClient.cadastralParcels || [],
    marketPriceRanges: currentClient.marketPriceRanges || { low: 3000, median: 4000, high: 5000, currentReferencePrice: 400000, currentReferencePricePerSqm: 3200 },
    soldComparables: currentClient.soldComparables || [],
    recommendedPriceRange: currentClient.recommendedPriceRange || { low: 380000, high: 420000 }
  };
};

export const saveAppState = (state: AppState): void => {
  // Save both for safety, but primarily we will handle multi-client saving inside the app component.
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

export const clearAppState = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(MULTI_CLIENT_STORAGE_KEY);
};
