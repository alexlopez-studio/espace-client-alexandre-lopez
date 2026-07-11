import { 
  ClientInfo, 
  AdvisorInfo, 
  CadastralParcel, 
  PropertyPoint, 
  ComparableProperty, 
  MarketHistoryItem, 
  CompetitorProperty, 
  ClientReview, 
  SoldPropertyByIad 
} from './types';

export const clientInfo: ClientInfo = {
  names: "Mme et M. Verger Alain / Yvette",
  address: "30 Boulevard des Catacholis, 13011 Marseille",
  date: "10 juillet 2026",
  projectTitle: "Dossier de commercialisation & Suivi de vente"
};

export const advisorInfo: AdvisorInfo = {
  name: "OLIVIER GOMEZ",
  title: "Conseiller immobilier iad",
  phone: "06 59 91 20 07",
  email: "olivier.gomez@iadfrance.fr",
  avatar: "/src/assets/images/advisor_avatar_1783766797924.jpg"
};

export const cadastralParcels: CadastralParcel[] = [
  { section: "D", prefixe: "865", numero: "111", superficie: 276 },
  { section: "D", prefixe: "865", numero: "548", superficie: 67 }
];

export const propertyDetails = {
  surface: 125,
  rooms: 5,
  floors: 1,
  landSurface: 350,
  bedrooms: 4,
  year: 1940,
  address: "30 Boulevard des Catacholis, 13011 Marseille",
  description: "Maison de 5 pièces de 125 m² environ sur 350 m² de parcelle (contenance cadastrale 343 m²). Elle comprend 3 chambres dans la maison principale et une chambre supplémentaire aménagée dans l'ancienne cave. Elle bénéficie d'un grand garage, d'une cheminée, de double vitrage, et de belles prestations générales dans un quartier calme.",
};

export const pointsForts: PropertyPoint[] = [
  { 
    text: "VUE DÉGAGÉE", 
    description: "Une vue panoramique exceptionnelle sur les collines environnantes, offrant un cadre de vie particulièrement agréable et apaisant." 
  },
  { 
    text: "CALME ABSOLU", 
    description: "Nichée dans une impasse d'un quartier résidentiel de Marseille 11e, à l'écart des bruits de circulation urbaine." 
  },
  { 
    text: "PAS DE TRAVAUX REQUIS", 
    description: "Le bien est dans un excellent état général de conservation, avec des menuiseries récentes et des prestations de qualité." 
  },
  { 
    text: "GRAND GARAGE", 
    description: "Un espace de stationnement et de stockage spacieux, un atout rare et très recherché dans le secteur de Marseille." 
  },
  { 
    text: "TRÈS LUMINEUX", 
    description: "Exposition idéale permettant de bénéficier d'une luminosité naturelle optimale tout au long de la journée." 
  }
];

export const pointsDefendre: PropertyPoint[] = [
  { 
    text: "ESCALIER D'ACCÈS", 
    description: "La topographie du terrain et l'accès à la maison nécessitent d'emprunter des escaliers, ce qui peut gêner les personnes à mobilité réduite." 
  },
  { 
    text: "TERRAIN EN PLUSIEURS RESTANQUES", 
    description: "Le jardin de 350 m² est aménagé sur plusieurs paliers (restanques traditionnelles provençales), ce qui fragmente l'espace extérieur plat." 
  },
  { 
    text: "CHAMBRE EN SOUS-SOL (NON DÉCLARÉE)", 
    description: "La 4ème chambre, aménagée dans l'ancienne cave, n'est pas déclarée en surface habitable officielle d'un point de vue réglementaire." 
  }
];

export const marketPriceRanges = {
  low: 3493,
  median: 4143,
  high: 5145,
  currentReferencePrice: 400000,
  currentReferencePricePerSqm: 3200
};

export const marketHistory: MarketHistoryItem[] = [
  { quarter: "T2 2022", medianPrice: 4200, highPrice: 5100, lowPrice: 3400, changePercent: 3.51 },
  { quarter: "T3 2022", medianPrice: 4100, highPrice: 4950, lowPrice: 3350, changePercent: -2.27 },
  { quarter: "T4 2022", medianPrice: 4160, highPrice: 5050, lowPrice: 3420, changePercent: 1.48 },
  { quarter: "T1 2023", medianPrice: 4330, highPrice: 5200, lowPrice: 3550, changePercent: 4.14 },
  { quarter: "T2 2023", medianPrice: 4010, highPrice: 4850, lowPrice: 3300, changePercent: -7.36 },
  { quarter: "T3 2023", medianPrice: 3660, highPrice: 4400, lowPrice: 3050, changePercent: -8.76 },
  { quarter: "T4 2023", medianPrice: 3370, highPrice: 4100, lowPrice: 2800, changePercent: -8.00 },
  { quarter: "T1 2024", medianPrice: 3320, highPrice: 4050, lowPrice: 2750, changePercent: -1.50 },
  { quarter: "T2 2024", medianPrice: 3430, highPrice: 4200, lowPrice: 2850, changePercent: 3.43 },
  { quarter: "T3 2024", medianPrice: 3670, highPrice: 4500, lowPrice: 3050, changePercent: 6.91 },
  { quarter: "T4 2024", medianPrice: 3750, highPrice: 4620, lowPrice: 3100, changePercent: 2.18 },
  { quarter: "T1 2025", medianPrice: 3820, highPrice: 4700, lowPrice: 3150, changePercent: 1.87 },
  { quarter: "T2 2025", medianPrice: 3780, highPrice: 4650, lowPrice: 3110, changePercent: -1.05 },
  { quarter: "T3 2025", medianPrice: 3880, highPrice: 4780, lowPrice: 3200, changePercent: 2.65 },
  { quarter: "T4 2025", medianPrice: 3850, highPrice: 4750, lowPrice: 3180, changePercent: -0.77 },
  { quarter: "T1 2026", medianPrice: 3950, highPrice: 4880, lowPrice: 3250, changePercent: 2.60 },
  { quarter: "T2 2026", medianPrice: 4143, highPrice: 5145, lowPrice: 3493, changePercent: 4.89 }
];

export const marketDelays = {
  fast: 6,
  median: 100,
  slow: 364
};

export const soldComparables: ComparableProperty[] = [
  {
    id: "comp-1",
    title: "Maison 7 p. 121 m²",
    price: 431600,
    pricePerSqm: 3567,
    surface: 121,
    landSurface: 849,
    rooms: 7,
    bedrooms: 4,
    parcelId: "Parcelles 8650d - 213",
    address: "4 Vallon des Eaux Vives, 13011 Marseille",
    soldDate: "il y a 10 mois",
    underCompromise: false
  },
  {
    id: "comp-2",
    title: "Maison 6 p. 133 m²",
    price: 439000,
    pricePerSqm: 3301,
    surface: 133,
    landSurface: 849,
    rooms: 6,
    bedrooms: 3,
    stairs: 2,
    garage: 1,
    year: 1970,
    address: "4 Vallon des Eaux Vives, 13011 Marseille",
    soldDate: "il y a 10 mois",
    underCompromise: false
  },
  {
    id: "comp-3",
    title: "Maison 5 p. 110 m²",
    price: 359000,
    pricePerSqm: 3264,
    surface: 110,
    landSurface: 810,
    rooms: 5,
    bedrooms: 3,
    stairs: 1,
    year: 1949,
    address: "122 Chemin du Vallon des Escourtines, 13011 Marseille",
    soldDate: "il y a un an",
    underCompromise: true,
    energyLabel: "D"
  },
  {
    id: "comp-4",
    title: "Maison 6 p. 96 m²",
    price: 373000,
    pricePerSqm: 3885,
    surface: 96,
    landSurface: 1377,
    rooms: 6,
    bedrooms: 3,
    parcelId: "Parcelles 8650d - 69",
    address: "66 Chemin des Escourtines, 13011 Marseille",
    soldDate: "il y a 8 mois",
    underCompromise: false
  },
  {
    id: "comp-5",
    title: "Maison 4 p. 104 m²",
    price: 435000,
    pricePerSqm: 4183,
    surface: 104,
    landSurface: 596,
    rooms: 4,
    bedrooms: 3,
    year: 1900,
    address: "6 Chemin du Vallon des Eaux Vives, 13011 Marseille",
    soldDate: "il y a un an",
    underCompromise: false,
    energyLabel: "C"
  },
  {
    id: "comp-6",
    title: "Maison 5 p. 97 m²",
    price: 395000,
    pricePerSqm: 4072,
    surface: 97,
    landSurface: 472,
    rooms: 5,
    bedrooms: 3,
    parcelId: "Parcelles 8650i - 62",
    address: "15 Bd Frederic Chevillon, 13011 Marseille",
    soldDate: "il y a un an",
    underCompromise: false
  }
];

export const iadSoldProperties: SoldPropertyByIad[] = [
  {
    id: "iad-1",
    title: "Maison 5 p. 110 m²",
    address: "122 Chemin du Vallon des Escourtines, Marseille",
    price: 359000,
    pricePerSqm: 3264,
    soldDate: "il y a un an",
    type: "Maison"
  },
  {
    id: "iad-2",
    title: "Maison 4 p. 86 m²",
    address: "23 Boulevard des Vignes, Aubagne",
    price: 399000,
    pricePerSqm: 4640,
    soldDate: "il y a un an",
    type: "Maison"
  },
  {
    id: "iad-3",
    title: "Maison 4 p. 70 m²",
    address: "31 Boulevard des Libérateurs, Marseille",
    price: 350000,
    pricePerSqm: 5000,
    soldDate: "il y a 5 mois",
    type: "Maison"
  },
  {
    id: "iad-4",
    title: "Maison 4 p. 84 m²",
    address: "6 Boulevard des Libérateurs, Marseille",
    price: 290000,
    pricePerSqm: 3452,
    soldDate: "il y a 7 mois",
    type: "Maison"
  },
  {
    id: "iad-5",
    title: "Appartement 5 p. 152 m²",
    address: "182 Boulevard de la Valbarelle, Marseille",
    price: 339500,
    pricePerSqm: 2234,
    soldDate: "il y a 7 mois",
    type: "Appartement"
  },
  {
    id: "iad-6",
    title: "Maison 4 p. 80 m²",
    address: "13400 Aubagne",
    price: 270000,
    pricePerSqm: 3375,
    soldDate: "il y a un mois",
    type: "Maison"
  },
  {
    id: "iad-7",
    title: "Appartement 3 p. 63 m²",
    address: "18 Rue Joseph Clérissy, Marseille",
    price: 265000,
    pricePerSqm: 4206,
    soldDate: "il y a 7 mois",
    type: "Appartement"
  },
  {
    id: "iad-8",
    title: "Appartement 3 p. 64 m²",
    address: "3 Avenue de la Figone, Marseille",
    price: 229000,
    pricePerSqm: 3578,
    soldDate: "il y a 6 mois",
    type: "Appartement"
  },
  {
    id: "iad-9",
    title: "Appartement 3 p. 66 m²",
    address: "61 Chemin des Passons, Aubagne",
    price: 199000,
    pricePerSqm: 3015,
    soldDate: "il y a 3 mois",
    type: "Appartement"
  }
];

export const clientReviews: ClientReview[] = [
  {
    id: "review-1",
    author: "Jessica R",
    date: "3 juillet 2026",
    rating: 5,
    title: "Sympathique et bienveillant",
    comment: "Olivier s’est occupé de la vente de mon appartement, il a été très compétent, il a veillé à ce que mes intérêts soient pris en compte tout en étant à l’écoute des attentes des acquéreurs. Très sympathique et à l’écoute il sait satisfaire ses clients afin de conclure une vente dans les règles de l’art. Merci à lui pour son professionnalisme."
  },
  {
    id: "review-2",
    author: "Morgane M",
    date: "17 juin 2026",
    rating: 5,
    title: "Accompagnement de qualité",
    comment: "De la première visite jusqu’à l’acquisition du bien, Monsieur Gomez s’est montré disponible, à l’écoute et de très bon conseil. Son professionnalisme et sa réactivité ont contribué à faciliter chaque étape du projet. Il a su répondre à mes attentes avec sérieux et efficacité. Je recommande vivement ses services pour tout projet immobilier."
  },
  {
    id: "review-3",
    author: "Fabien",
    date: "17 juin 2026",
    rating: 5,
    title: "Exceptionnel",
    comment: "Olivier a vendu mon bien en seulement une semaine, avec cinq visites et trois offres au prix demandé ! J’avais auparavant essayé de vendre avec une agence, au même prix, sans aucun succès. La différence a été flagrante. Je recommande vivement Olivier pour son professionnalisme, sa disponibilité et surtout sa stratégie sur mesure qui lui permet d’obtenir les meilleurs résultats. Son accompagnement a été irréprochable de A à Z."
  },
  {
    id: "review-4",
    author: "Anastasiya",
    date: "3 juin 2026",
    rating: 5,
    title: "Agent immobilier très professionnel et disponible !",
    comment: "Très bon accompagnement pour l’achat de notre maison. Olivier Gomez a été extrêmement disponible, réactif et professionnel tout au long du processus. Il a su répondre à toutes nos questions avec clarté et nous guider à chaque étape. Nous recommandons donc vivement ses services. Merci !"
  },
  {
    id: "review-5",
    author: "Manon R",
    date: "18 mai 2026",
    rating: 5,
    title: "À l’écoute et disponible",
    comment: "Olivier a su cerner rapidement ma demande, a été à l’écoute et a su réagir chaque fois avec professionnalisme et rigueur. Est ouvert à la discussion et sait rondement bien mener une négociation. Je le recommande vivement pour tous vos projets de vente."
  },
  {
    id: "review-6",
    author: "Julie",
    date: "15 février 2026",
    rating: 5,
    title: "Toujours ravie",
    comment: "Deuxième fois que je fais appel à Olivier et tout est toujours parfait, rapide, il communique bien et a toujours le sourire. C'est un réel plaisir de confier un projet immobilier à une personne de confiance aussi dynamique."
  }
];

export const competitorProperties: CompetitorProperty[] = [
  { id: "prop-1", surface: 120, price: 384000, status: "vente", title: "Maison 5 pièces 120m²" },
  { id: "prop-2", surface: 125, price: 400000, status: "vendu", title: "30 Bd des Catacholis (Votre bien)" }, // reference
  { id: "prop-3", surface: 130, price: 416000, status: "vente", title: "Maison 6 pièces 130m²" },
  { id: "prop-4", surface: 110, price: 359000, status: "vendu", title: "Maison 5p 110m²" },
  { id: "prop-5", surface: 121, price: 431600, status: "vendu", title: "Maison 7p 121m²" },
  { id: "prop-6", surface: 133, price: 439000, status: "vendu", title: "Maison 6p 133m²" },
  { id: "prop-7", surface: 96, price: 373000, status: "vendu", title: "Maison 6p 96m²" },
  { id: "prop-8", surface: 104, price: 435000, status: "vendu", title: "Maison 4p 104m²" },
  { id: "prop-9", surface: 97, price: 395000, status: "vendu", title: "Maison 5p 97m²" },
  { id: "prop-10", surface: 115, price: 399000, status: "vente", title: "Maison 5 pièces 115m²" },
  { id: "prop-11", surface: 140, price: 540000, status: "vente", title: "Maison 6 pièces 140m²" },
  { id: "prop-12", surface: 128, price: 460000, status: "vente", title: "Villa 5p 128m²" },
  { id: "prop-13", surface: 122, price: 415000, status: "vente", title: "Maison contemporaine 122m²" },
  { id: "prop-14", surface: 135, price: 449000, status: "vente", title: "Maison traditionnelle 135m²" },
  { id: "prop-15", surface: 118, price: 390000, status: "vendu", title: "Maison de lotissement 118m²" },
  { id: "prop-16", surface: 126, price: 425000, status: "vente", title: "Villa de plain pied 126m²" },
  { id: "prop-17", surface: 112, price: 365000, status: "vendu", title: "Maison de village 112m²" },
  { id: "prop-18", surface: 131, price: 430000, status: "vendu", title: "Maison mitoyenne 131m²" },
  { id: "prop-19", surface: 108, price: 379000, status: "vente", title: "Maison 4p 108m²" },
  { id: "prop-20", surface: 125, price: 480000, status: "vente", title: "Maison d'architecte 125m²" },
  { id: "prop-21", surface: 138, price: 495000, status: "vente", title: "Maison 6p 138m²" },
  { id: "prop-22", surface: 124, price: 410000, status: "vendu", title: "Pavillon 124m²" },
  { id: "prop-23", surface: 119, price: 385000, status: "vendu", title: "Maison provençale 119m²" },
  { id: "prop-24", surface: 132, price: 455000, status: "vente", title: "Villa de Maître 132m²" },
  { id: "prop-25", surface: 127, price: 420000, status: "vendu", title: "Maison 5p 127m²" },
  { id: "prop-26", surface: 105, price: 345000, status: "vendu", title: "Maison 4p 105m²" },
  { id: "prop-27", surface: 145, price: 580000, status: "vente", title: "Grande Villa 145m²" },
  { id: "prop-28", surface: 123, price: 395000, status: "vendu", title: "Maison rénovée 123m²" },
  { id: "prop-29", surface: 130, price: 450000, status: "vente", title: "Pavillon 5p 130m²" },
  { id: "prop-30", surface: 116, price: 375000, status: "vendu", title: "Maison de lotissement 116m²" },
  { id: "prop-31", surface: 125, price: 415000, status: "vente", title: "Maison 5p style bastide" }
];
