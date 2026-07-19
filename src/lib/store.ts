import type {
  AdvisorInfo,
  AppState,
  BuyerOffer,
  ClientRecord,
  DocumentItem,
  PortalStat,
  SalesStep,
  ViewingReport,
} from '../types';

const LOCAL_STORAGE_KEY = 'iad_estimation_app_state_v1';
const MULTI_CLIENT_STORAGE_KEY = 'iad_estimation_multi_client_state_v1';

export const defaultDocuments: DocumentItem[] = [];
export const defaultViewings: ViewingReport[] = [];
export const defaultSalesSteps: SalesStep[] = [];
export const defaultOffers: BuyerOffer[] = [];
export const defaultPortalStats: PortalStat[] = [];

export const emptyAdvisorInfo: AdvisorInfo = {
  name: 'Alexandre Lopez',
  title: 'Conseiller immobilier iad',
  phone: '06 13 18 01 68',
  email: 'alexandre.lopez@iadfrance.fr',
  avatar: '/alexandre-lopez-face.jpg',
};

export const emptyClient: ClientRecord = {
  id: 'empty-dossier',
  estimationStatus: 'empty',
  salesFollowUpStatus: 'teaser',
  mandateStage: null,
  mandateSignedAt: null,
  clientInfo: {
    names: 'Client',
    address: '',
    date: '',
    projectTitle: 'Espace client',
  },
  propertyDetails: {
    surface: 0,
    rooms: 0,
    floors: 0,
    landSurface: 0,
    bedrooms: 0,
    year: 0,
    address: '',
    description: '',
  },
  propertyContext: {
    type: '',
    commune: '',
  },
  pointsForts: [],
  pointsDefendre: [],
  documents: [],
  viewings: [],
  salesSteps: [],
  offers: [],
  portalStats: [],
  cadastralParcels: [],
  soldComparables: [],
};

export interface MultiClientState {
  currentClientId: string;
  clients: ClientRecord[];
  advisorInfo: AdvisorInfo;
}

export const getMultiClientState = (): MultiClientState => {
  clearAppState();
  return {
    currentClientId: emptyClient.id,
    clients: [emptyClient],
    advisorInfo: emptyAdvisorInfo,
  };
};

export const saveMultiClientState = (_state: MultiClientState): void => {
  // Le portail client est désormais piloté exclusivement par Mandat OS.
  // Aucun état applicatif ne doit réinjecter des données de démonstration.
};

export const getInitialState = (): AppState => ({
  clientInfo: emptyClient.clientInfo,
  advisorInfo: emptyAdvisorInfo,
  estimationStatus: 'empty',
  salesFollowUpStatus: 'teaser',
  mandateStage: null,
  mandateSignedAt: null,
  propertyContext: emptyClient.propertyContext,
  propertyDetails: emptyClient.propertyDetails,
  pointsForts: [],
  pointsDefendre: [],
  documents: [],
  viewings: [],
  salesSteps: [],
  offers: [],
  portalStats: [],
  cadastralParcels: [],
  soldComparables: [],
});

export const saveAppState = (_state: AppState): void => {
  // No-op volontaire : l'espace client ne persiste pas de données métier en local.
};

export const clearAppState = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(MULTI_CLIENT_STORAGE_KEY);
};
