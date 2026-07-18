export interface ClientInfo {
  names: string;
  address: string;
  date: string;
  projectTitle?: string;
}

export interface AdvisorInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface PropertyDetails {
  surface: number;
  rooms: number;
  floors: number;
  landSurface: number;
  bedrooms: number;
  year: number;
  address: string;
  description: string;
}

export interface PropertyContext {
  type: string;
  commune: string;
}

export interface CadastralParcel {
  section: string;
  prefixe: string;
  numero: string;
  superficie: number;
}

export interface PropertyFeature {
  label: string;
  value: string;
  icon: string;
}

export interface PropertyPoint {
  text: string;
  description: string;
}

export interface ComparableProperty {
  id: string;
  title: string;
  price: number;
  pricePerSqm: number;
  surface: number;
  landSurface: number;
  rooms: number;
  bedrooms: number;
  stairs?: number;
  garage?: number;
  year?: number;
  parcelId?: string;
  address: string;
  soldDate: string;
  underCompromise?: boolean;
  energyLabel?: string;
}

export interface MarketHistoryItem {
  quarter: string;
  medianPrice: number;
  highPrice: number;
  lowPrice: number;
  changePercent: number;
}

export interface CompetitorProperty {
  id: string;
  surface: number;
  price: number;
  status: 'vente' | 'vendu';
  title: string;
}

export interface ClientReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
}

export interface SoldPropertyByIad {
  id: string;
  title: string;
  address: string;
  price: number;
  pricePerSqm: number;
  soldDate: string;
  type: 'Maison' | 'Appartement';
}

// === NOUVEAUX TYPES pour les sections d'estimation manquantes ===

// Page 4 : Contexte socio-économique
export interface BuyerProfile {
  type: 'PERSONNE_SEULE' | 'COUPLE' | 'FAMILLE' | 'MONOPARENTALITE';
  interestedIn: string;
  budgetRange: { low: number; high: number };
  requiredIncomeRange: { low: number; high: number };
}

export interface SeniorityItem {
  label: string;
  percent: number;
}

export interface ActivityDistribution {
  agriculteurs: number;
  artisans: number;
  cadres: number;
  intermediaires: number;
  employes: number;
  ouvriers: number;
  retraites: number;
  sansEmploi: number;
}

export interface SocioEconomicData {
  population: number;
  households: number;
  medianIncome: number;
  buyerProfiles: BuyerProfile[];
  interestRate: number;
  seniorityDistribution: SeniorityItem[];
  activityDistribution?: ActivityDistribution;
}

// Page 5 : Marché immobilier
export interface MarketDistribution {
  housingTypes: { maison: number; appartement: number; hlm: number };
  occupancy: { principales: number; secondaires: number; vacants: number };
  roomsDistribution: { label: string; percent: number }[];
  surfaceDistribution: { label: string; percent: number }[];
  bienPosition: { surfaceRange: string; roomsCount: number };
}

// Pages 6-7 : Tendance & Tension du marché
export interface MarketTrend {
  pricePerSqmLow: number;
  pricePerSqmMedian: number;
  pricePerSqmHigh: number;
  evolution6m: number;
  evolution1y: number;
  evolution2y: number;
  history: MarketHistoryItem[];
}

export interface MarketTension {
  level: 'très ralenti' | 'ralenti' | 'équilibré' | 'dynamique' | 'très dynamique';
  levelLabel: string;
  levelDescription: string;
  history: { quarter: string; value: number }[];
  saleDelays: { fastest: number; median: number; slowest: number };
  stockIndicator: string;
  priceRevisionIndicator: string;
}

// Page 8 : Analyse de la concurrence (biens en vente + invendus)
export interface ExtendedComparableProperty {
  id: string;
  title: string;
  price: number;
  pricePerSqm: number;
  surface: number;
  landSurface: number;
  rooms: number;
  bedrooms: number;
  stairs?: number;
  garage?: number;
  year?: number;
  address: string;
  daysOnMarket?: string;
  status: 'En vente' | 'Vendu' | 'Invendu';
  energyLabel?: string;
}

// Page 10 : Positionnement du bien
export interface PositioningData {
  pricePerSqmRank: number;
  totalCompetitors: number;
  cheaperPercent: number;
  largerPercent: number;
  cheaperAndLargerPercent: number;
  priceThresholds: { low: number; median: number; high: number };
  averageCompetitorPricePerSqm: number;
}

// Page 11 : Synthèse des prix (croisement 3 méthodes)
export interface SynthesisData {
  marketMethod: { low: number; median: number; high: number };
  comparablesMethod: { low: number; median: number; high: number };
  aiMethod: { low: number; median: number; high: number };
}

// New Types for the Admin Space and new sections

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Diagnostic' | 'Urbanisme' | 'Titre de Propriété' | 'Taxes' | 'Copropriété' | 'Autre';
  size: string;
  dateAdded: string;
  status: 'Valide' | 'À valider' | 'Manquant';
  uploadedBy: 'Vendeur' | 'Conseiller';
  fileUrl?: string; // Mock url
}

export interface ViewingReport {
  id: string;
  date: string;
  buyerName: string;
  rating: number; // 1 to 5
  solvencyStatus: 'Validée' | 'En cours' | 'Non validée';
  comment: string;
  interestLevel: 'Élevé' | 'Moyen' | 'Faible' | 'Offre formulée';
  agentFeedback?: string;
}

export interface SalesStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'A faire' | 'En cours' | 'Terminé';
  completedDate?: string;
  responsible: 'Conseiller' | 'Vendeur' | 'Tous';
}

export interface BuyerOffer {
  id: string;
  buyerName: string;
  price: number;
  date: string;
  financingType: 'Emprunt Bancaire' | 'Apport Personnel' | 'Mixte';
  financingDetails: string; // e.g. "Prêt de 350k€ + apport 70k€"
  solvencyCertificate: boolean; // Pre-approbation
  status: 'Reçue' | 'Acceptée' | 'Refusée' | 'Contre-proposition';
  comments?: string;
}

export interface PortalStatHistoryItem {
  date: string;
  views: number;
  detailedViews: number;
  contacts: number;
  phoneClicks: number;
}

export interface PortalStat {
  portalName: string;
  views: number;
  detailedViews: number;
  contacts: number;
  phoneClicks: number;
  performanceIndex: number; // e.g. out of 100
  history: PortalStatHistoryItem[];
}

export interface AppState {
  clientInfo: ClientInfo;
  advisorInfo: AdvisorInfo;
  estimationStatus: 'empty' | 'draft' | 'published';
  salesFollowUpStatus: 'teaser' | 'active';
  propertyContext: PropertyContext;
  propertyDetails: PropertyDetails;
  pointsForts: PropertyPoint[];
  pointsDefendre: PropertyPoint[];
  documents: DocumentItem[];
  viewings: ViewingReport[];
  salesSteps: SalesStep[];
  offers: BuyerOffer[];
  portalStats: PortalStat[];
  cadastralParcels?: CadastralParcel[];
  marketPriceRanges?: {
    low: number;
    median: number;
    high: number;
    currentReferencePrice?: number;
    currentReferencePricePerSqm?: number;
  };
  soldComparables?: ComparableProperty[];
  recommendedPriceRange?: {
    low: number;
    high: number;
  };
  // Nouvelles sections estimation
  socioEconomicData?: SocioEconomicData;
  marketDistribution?: MarketDistribution;
  marketTrend?: MarketTrend;
  marketTension?: MarketTension;
  competingProperties?: ExtendedComparableProperty[];
  unsoldProperties?: ExtendedComparableProperty[];
  positioningData?: PositioningData;
  synthesisData?: SynthesisData;
  iadTrackRecord?: SoldPropertyByIad[];
}

export interface ClientRecord {
  id: string;
  clientInfo: ClientInfo;
  estimationStatus: 'empty' | 'draft' | 'published';
  salesFollowUpStatus: 'teaser' | 'active';
  propertyContext: PropertyContext;
  propertyDetails: PropertyDetails;
  pointsForts: PropertyPoint[];
  pointsDefendre: PropertyPoint[];
  documents: DocumentItem[];
  viewings: ViewingReport[];
  salesSteps: SalesStep[];
  offers: BuyerOffer[];
  portalStats: PortalStat[];
  cadastralParcels?: CadastralParcel[];
  marketPriceRanges?: {
    low: number;
    median: number;
    high: number;
    currentReferencePrice?: number;
    currentReferencePricePerSqm?: number;
  };
  soldComparables?: ComparableProperty[];
  recommendedPriceRange?: {
    low: number;
    high: number;
  };
  socioEconomicData?: SocioEconomicData;
  marketDistribution?: MarketDistribution;
  marketTrend?: MarketTrend;
  marketTension?: MarketTension;
  competingProperties?: ExtendedComparableProperty[];
  unsoldProperties?: ExtendedComparableProperty[];
  positioningData?: PositioningData;
  synthesisData?: SynthesisData;
  iadTrackRecord?: SoldPropertyByIad[];
}