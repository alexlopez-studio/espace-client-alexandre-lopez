import type {
  AdvisorInfo,
  BuyerOffer,
  ClientRecord,
  ComparableProperty,
  DocumentItem,
  ExtendedComparableProperty,
  MarketDistribution,
  MarketTension,
  MarketTrend,
  PortalStat,
  PositioningData,
  PropertyPoint,
  SalesStep,
  SocioEconomicData,
  SoldPropertyByIad,
  SynthesisData,
  ViewingReport,
} from '../types';
import { emptyAdvisorInfo, emptyClient, type MultiClientState } from './store';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

type JsonRecord = Record<string, unknown>;

type ClientProfileRow = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
};

type ClientDossierRow = {
  id: string;
  public_token?: string | null;
  title?: string | null;
  status?: string | null;
  property_snapshot?: unknown;
  professional_opinion?: unknown;
  advisor_note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  mandate_signed_at?: string | null;
};

type ClientDocumentRow = {
  id: string;
  label?: string | null;
  name?: string | null;
  category?: string | null;
  status?: string | null;
  signed_url?: string | null;
  file_url?: string | null;
  file_size?: number | null;
  file_name?: string | null;
  uploaded_at?: string | null;
  validated_at?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ClientEventRow = {
  id: string;
  type?: string | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  event_date?: string | null;
  payload?: unknown;
  created_at?: string | null;
};

export type RemotePortalStatus = 'idle' | 'loading' | 'synced' | 'demo' | 'unauthenticated' | 'empty' | 'error';

type ClientPortalPayload = {
  readOnly: true;
  profile: ClientProfileRow;
  dossier: ClientDossierRow;
  documents: ClientDocumentRow[];
  events: ClientEventRow[];
  property_context?: {
    type?: string | null;
    commune?: string | null;
  };
  sales_follow_up?: {
    status?: 'teaser' | 'active';
  };
  mandate_stage?: string | null;
  estimation?: {
    status: 'empty' | 'draft' | 'published';
    published_at?: string | null;
  };
};

export type RemotePortalLoadResult = {
  status: Exclude<RemotePortalStatus, 'idle' | 'loading'>;
  state?: MultiClientState;
  message?: string;
};

export type LocalTestDossier = {
  id: string;
  title: string;
  clientName: string;
  propertyLabel: string;
  opportunityStage: string;
  estimationStatus: 'empty' | 'draft' | 'published';
  salesFollowUpStatus: 'teaser' | 'active';
  previewToken: string;
  previewPath: string;
};

export async function loadMandatOsPortalState(): Promise<RemotePortalLoadResult> {
  const previewToken = getPreviewToken();
  if (previewToken) {
    return loadPortalPayload({ previewToken });
  }

  if (!isSupabaseConfigured()) {
    return { status: 'unauthenticated', message: 'Connexion client requise.' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { status: 'unauthenticated' };

  const { data: sessionResult, error: sessionError } = await supabase.auth.getSession();
  const accessToken = sessionResult?.session?.access_token;

  if (sessionError || !accessToken) {
    return { status: 'unauthenticated', message: 'Aucune session client active.' };
  }

  return loadPortalPayload({ accessToken, dossierId: getRequestedDossierId() });
}

export async function loadLocalTestDossiers(): Promise<LocalTestDossier[]> {
  if (!import.meta.env.DEV) return [];

  const url = new URL('/api/dev/client-portal-test-dossiers', getMandatOsApiUrl());
  url.searchParams.set('portal_origin', window.location.origin);

  const response = await fetch(url.toString());
  const json = await response.json().catch(() => null) as { success?: boolean; data?: { dossiers?: LocalTestDossier[] } } | null;

  if (!response.ok || !json?.success) return [];
  return json.data?.dossiers ?? [];
}

async function loadPortalPayload(input: { accessToken?: string; previewToken?: string; dossierId?: string | null }): Promise<RemotePortalLoadResult> {
  const url = new URL('/api/client-portal/dossier', getMandatOsApiUrl());
  if (input.previewToken) url.searchParams.set('preview_token', input.previewToken);
  if (input.dossierId) url.searchParams.set('dossier', input.dossierId);

  const response = await fetch(url.toString(), {
    headers: input.accessToken ? { Authorization: `Bearer ${input.accessToken}` } : undefined,
  });
  const json = await response.json().catch(() => null) as { success?: boolean; data?: ClientPortalPayload; error?: string } | null;

  if (!response.ok || !json?.success || !json.data) {
    if (response.status === 401) return { status: 'unauthenticated', message: json?.error ?? 'Accès client requis.' };
    return { status: 'error', message: json?.error ?? 'Lecture du portail impossible.' };
  }

  return {
    status: 'synced',
    state: mapDossierToMultiClientState(json.data),
  };
}

function mapDossierToMultiClientState(payload: ClientPortalPayload): MultiClientState {
  const { profile, dossier, documents, events } = payload;
  const snapshot = asRecord(dossier.property_snapshot);
  const opinion = asRecord(dossier.professional_opinion);
  const report = asRecord(opinion.iad_report ?? opinion.report);
  const cover = asRecord(report.cover);
  const advisor = asRecord(report.advisor);
  const property = asRecord(report.property);
  const market = asRecord(report.market);
  const positioning = asRecord(report.positioning);
  const comparables = asRecord(report.comparables);
  const estimationStatus = payload.estimation?.status ?? inferEstimationStatus(opinion);

  const address = text(
    snapshot.adresse,
    snapshot.address,
    cover.subtitle,
  );

  const client: ClientRecord = {
    ...emptyClient,
    id: dossier.id,
    estimationStatus,
    salesFollowUpStatus: payload.sales_follow_up?.status === 'active' ? 'active' : 'teaser',
    mandateStage: payload.mandate_stage ?? null,
    mandateSignedAt: dossier.mandate_signed_at ?? null,
    propertyContext: {
      type: text(payload.property_context?.type, snapshot.type_bien, snapshot.property_type, snapshot.type),
      commune: text(payload.property_context?.commune, snapshot.commune, snapshot.city, snapshot.ville),
    },
    clientInfo: {
      names: text(
        cover.recipient,
        [profile.first_name, profile.last_name].filter(Boolean).join(' '),
        profile.email,
        emptyClient.clientInfo.names,
      ),
      address,
      date: text(cover.date, formatDate(dossier.updated_at)),
      projectTitle: text(cover.title, dossier.title, 'Espace client'),
    },
    propertyDetails: {
      ...emptyClient.propertyDetails,
      surface: numberValue(snapshot.surface, snapshot.surface_habitable, findStat(property, 'surface')) ?? 0,
      rooms: numberValue(snapshot.nb_pieces, snapshot.rooms, findStat(property, 'pièce')) ?? 0,
      floors: numberValue(snapshot.floors, snapshot.niveaux, findStat(property, 'niveau')) ?? 0,
      landSurface: numberValue(snapshot.surface_terrain, snapshot.land_surface, findStat(property, 'terrain')) ?? 0,
      bedrooms: numberValue(snapshot.bedrooms, snapshot.chambres, findStat(property, 'chambre')) ?? 0,
      year: numberValue(snapshot.year, snapshot.annee_construction, findStat(property, 'année')) ?? 0,
      address,
      description: text(property.title, snapshot.description, dossier.advisor_note),
    },
    pointsForts: mapPoints(property.strengths),
    pointsDefendre: mapPoints(property.objections),
    documents: documents.map(mapDocument),
    viewings: mapViewings(events) ?? [],
    salesSteps: mapSalesSteps(events) ?? [],
    offers: mapOffers(events) ?? [],
    portalStats: mapPortalStats(opinion.audience) ?? [],
    cadastralParcels: estimationStatus === 'published' ? mapCadastralRows(report) ?? [] : [],
    marketPriceRanges: estimationStatus === 'published' ? mapMarketPriceRanges(market, positioning, opinion) : undefined,
    soldComparables: estimationStatus === 'published' ? mapComparables(comparables.sold ?? opinion.comparables) ?? [] : [],
    recommendedPriceRange: estimationStatus === 'published' ? mapRecommendedPriceRange(opinion, positioning) : undefined,
    // Nouvelles sections estimation
    socioEconomicData: estimationStatus === 'published' ? mapSocioEconomic(report) : undefined,
    marketDistribution: estimationStatus === 'published' ? mapMarketDistribution(report) : undefined,
    marketTrend: estimationStatus === 'published' ? mapMarketTrend(report) : undefined,
    marketTension: estimationStatus === 'published' ? mapMarketTension(report) : undefined,
    competingProperties: estimationStatus === 'published' ? mapExtendedComparables(comparables.competing ?? comparables.en_vente) : undefined,
    unsoldProperties: estimationStatus === 'published' ? mapExtendedComparables(comparables.unsold ?? comparables.invendus) : undefined,
    positioningData: estimationStatus === 'published' ? mapPositioning(report) : undefined,
    synthesisData: estimationStatus === 'published' ? mapSynthesis(report) : undefined,
    iadTrackRecord: estimationStatus === 'published' ? mapIadTrackRecord(report) : undefined,
  };

  return {
    currentClientId: client.id,
    clients: [client],
    advisorInfo: mapAdvisor(advisor),
  };
}

function mapAdvisor(advisor: JsonRecord): AdvisorInfo {
  void advisor;
  return emptyAdvisorInfo;
}

function mapDocument(document: ClientDocumentRow): DocumentItem {
  return {
    id: document.id,
    name: text(document.label, document.name, document.file_name, 'Document client'),
    category: mapDocumentCategory(document.category),
    size: document.file_size ? formatFileSize(document.file_size) : '',
    dateAdded: formatDate(document.validated_at ?? document.uploaded_at ?? document.updated_at ?? document.created_at),
    status: mapDocumentStatus(document.status),
    uploadedBy: document.created_by === 'client' ? 'Vendeur' : 'Conseiller',
    fileUrl: document.signed_url ?? document.file_url ?? undefined,
  };
}

function mapEvent(event: ClientEventRow, index: number): SalesStep {
  return {
    id: event.id,
    order: index + 1,
    title: text(event.title, `Étape ${index + 1}`),
    description: text(event.description, ''),
    status: mapEventStatus(event.status),
    completedDate: ['done', 'completed', 'validated'].includes(String(event.status)) ? formatDate(event.event_date ?? event.created_at) : undefined,
    responsible: 'Conseiller',
  };
}

function mapSalesSteps(events: ClientEventRow[]): SalesStep[] | undefined {
  const rows = events
    .filter((event) => !['visit', 'offer'].includes(String(event.type)))
    .map(mapEvent);
  return rows.length > 0 ? rows : undefined;
}

function mapViewings(events: ClientEventRow[]): ViewingReport[] | undefined {
  const rows = events
    .filter((event) => event.type === 'visit')
    .map((event, index) => {
      const payload = asRecord(event.payload);
      return {
        id: event.id,
        date: formatDate(event.event_date ?? event.created_at) || `Visite ${index + 1}`,
        buyerName: text(payload.buyerName, payload.buyer_name, payload.name, event.title, 'Acquéreur'),
        rating: numberValue(payload.rating, payload.note) ?? 3,
        solvencyStatus: mapSolvencyStatus(payload.solvencyStatus ?? payload.solvency_status),
        comment: text(event.description, payload.comment, payload.feedback, ''),
        interestLevel: mapInterestLevel(payload.interestLevel ?? payload.interest_level ?? event.status),
      } satisfies ViewingReport;
    });
  return rows.length > 0 ? rows : undefined;
}

function mapOffers(events: ClientEventRow[]): BuyerOffer[] | undefined {
  const rows = events
    .filter((event) => event.type === 'offer')
    .map((event) => {
      const payload = asRecord(event.payload);
      return {
        id: event.id,
        buyerName: text(payload.buyerName, payload.buyer_name, event.title, 'Acquéreur'),
        price: numberValue(payload.price, payload.amount, payload.montant) ?? 0,
        date: formatDate(event.event_date ?? event.created_at),
        financingType: mapFinancingType(payload.financingType ?? payload.financing_type),
        financingDetails: text(payload.financingDetails, payload.financing_details, payload.financing, 'Informations financières non renseignées'),
        solvencyCertificate: Boolean(payload.solvencyCertificate ?? payload.solvency_certificate ?? payload.solver_validated),
        status: mapOfferStatus(event.status),
        comments: text(event.description, payload.comments, payload.comment) || undefined,
      } satisfies BuyerOffer;
    })
    .filter((offer) => offer.price > 0 || offer.buyerName !== 'Acquéreur');
  return rows.length > 0 ? rows : undefined;
}

function mapPortalStats(value: unknown): PortalStat[] | undefined {
  const record = asRecord(value);
  const rows = asArray(record.portals ?? record.supports ?? value)
    .map((item, index) => {
      const portal = asRecord(item);
      return {
        portalName: text(portal.portalName, portal.portal, portal.name, `Portail ${index + 1}`),
        views: numberValue(portal.views, portal.vues) ?? 0,
        detailedViews: numberValue(portal.detailedViews, portal.detailed_views, portal.consultations) ?? 0,
        contacts: numberValue(portal.contacts) ?? 0,
        phoneClicks: numberValue(portal.phoneClicks, portal.phone_clicks, portal.clics_telephone) ?? 0,
        performanceIndex: numberValue(portal.performanceIndex, portal.performance_index) ?? 0,
        history: asArray(portal.history).map((point) => {
          const row = asRecord(point);
          return {
            date: text(row.date, row.captured_on, ''),
            views: numberValue(row.views, row.vues) ?? 0,
            detailedViews: numberValue(row.detailedViews, row.detailed_views, row.consultations) ?? 0,
            contacts: numberValue(row.contacts) ?? 0,
            phoneClicks: numberValue(row.phoneClicks, row.phone_clicks, row.clics_telephone) ?? 0,
          };
        }),
      } satisfies PortalStat;
    });
  return rows.length > 0 ? rows : undefined;
}

function mapMarketPriceRanges(market: JsonRecord, positioning: JsonRecord, opinion: JsonRecord) {
  const low = numberValue(market.price_per_sqm_low, positioning.low_per_sqm);
  const median = numberValue(market.price_per_sqm_median, positioning.median_per_sqm);
  const high = numberValue(market.price_per_sqm_high, positioning.high_per_sqm);
  const currentReferencePrice = numberValue(positioning.reference_price, opinion.price_suggested, opinion.price);
  const currentReferencePricePerSqm = numberValue(positioning.reference_price_per_sqm, market.price_per_sqm_median);

  if (!low && !median && !high && !currentReferencePrice && !currentReferencePricePerSqm) return undefined;

  return {
    low: low ?? 0,
    median: median ?? 0,
    high: high ?? 0,
    currentReferencePrice,
    currentReferencePricePerSqm,
  };
}

function mapRecommendedPriceRange(opinion: JsonRecord, positioning: JsonRecord) {
  const low = numberValue(opinion.price_low, positioning.threshold_low_price);
  const high = numberValue(opinion.price_high, positioning.threshold_high_price);
  if (!low && !high) return undefined;
  return {
    low: low ?? 0,
    high: high ?? 0,
  };
}

function inferEstimationStatus(opinion: JsonRecord): 'empty' | 'draft' | 'published' {
  if (opinion.client_portal_published === true) return 'published';
  return Object.keys(opinion).length > 0 ? 'draft' : 'empty';
}

function mapPoints(value: unknown) {
  const values = asArray(value)
    .map((item) => {
      if (typeof item === 'string') return { text: item, description: item };
      const record = asRecord(item);
      return {
        text: text(record.text, record.title, record.label),
        description: text(record.description, record.content, record.text, record.title, record.label),
      };
    })
    .filter((point) => point.text);

  return values.length > 0 ? values : [];
}

function mapComparables(value: unknown): ComparableProperty[] | undefined {
  const rows = asArray(value)
    .map((item, index) => {
      const comparable = asRecord(item);
      const surface = numberValue(comparable.surface) ?? 0;
      const price = numberValue(comparable.price, comparable.prix) ?? 0;
      return {
        id: text(comparable.id, `remote-comp-${index + 1}`),
        title: text(comparable.title, comparable.titre, `Comparable ${index + 1}`),
        price,
        pricePerSqm: numberValue(comparable.pricePerSqm, comparable.price_per_sqm, comparable.prix_m2) ?? (surface > 0 ? Math.round(price / surface) : 0),
        surface,
        landSurface: numberValue(comparable.landSurface, comparable.land_surface, comparable.surface_terrain) ?? 0,
        rooms: numberValue(comparable.rooms, comparable.nb_pieces) ?? 0,
        bedrooms: numberValue(comparable.bedrooms, comparable.chambres) ?? 0,
        address: text(comparable.address, comparable.adresse, ''),
        soldDate: text(comparable.soldDate, comparable.sold_date, comparable.date, ''),
        underCompromise: Boolean(comparable.underCompromise ?? comparable.under_compromise),
        energyLabel: text(comparable.energyLabel, comparable.energy_label),
      };
    })
    .filter((comparable) => comparable.price > 0 || comparable.surface > 0);

  return rows.length > 0 ? rows : undefined;
}

function mapCadastralRows(report: JsonRecord) {
  const situation = asRecord(report.situation);
  const rows = asArray(situation.cadastral_rows)
    .map((row) => {
      const record = asRecord(row);
      return {
        section: text(record.section, ''),
        prefixe: text(record.prefixe, record.prefix, ''),
        numero: text(record.numero, record.number, ''),
        superficie: numberValue(record.superficie, record.surface) ?? 0,
      };
    })
    .filter((row) => row.section || row.numero || row.superficie > 0);

  return rows.length > 0 ? rows : undefined;
}

function findStat(property: JsonRecord, labelNeedle: string) {
  const needle = labelNeedle.toLowerCase();
  const row = asArray(property.stats).find((item) => {
    const record = asRecord(item);
    return text(record.label, record.name, '').toLowerCase().includes(needle);
  });

  if (!row) return undefined;
  const record = asRecord(row);
  return record.value;
}

function getRequestedDossierId() {
  const pathMatch = window.location.pathname.match(/^\/dossier\/([^/?#]+)/);
  if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);

  const params = new URLSearchParams(window.location.search);
  return params.get('dossier') ?? params.get('dossier_id') ?? import.meta.env.VITE_CLIENT_DOSSIER_ID ?? null;
}

function getPreviewToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token') ?? params.get('preview_token');
}

function getMandatOsApiUrl() {
  const fallback = import.meta.env.DEV ? 'http://localhost:3002' : 'https://app.alexandrelopez.fr';
  return (import.meta.env.VITE_MANDAT_OS_API_URL || fallback).replace(/\/+$/, '');
}

function mapDocumentCategory(category: string | null | undefined): DocumentItem['category'] {
  const normalized = String(category ?? '').toLowerCase();
  if (normalized.includes('diagnostic')) return 'Diagnostic';
  if (normalized.includes('urbanisme')) return 'Urbanisme';
  if (normalized.includes('propriete') || normalized.includes('propriété')) return 'Titre de Propriété';
  if (normalized.includes('tax') || normalized.includes('fiscal')) return 'Taxes';
  if (normalized.includes('copro')) return 'Copropriété';
  return 'Autre';
}

function mapDocumentStatus(status: string | null | undefined): DocumentItem['status'] {
  const normalized = String(status ?? '').toLowerCase();
  if (['validated', 'valid', 'valide'].includes(normalized)) return 'Valide';
  if (['missing', 'requested', 'rejected', 'manquant'].includes(normalized)) return 'Manquant';
  return 'À valider';
}

function mapEventStatus(status: string | null | undefined): SalesStep['status'] {
  const normalized = String(status ?? '').toLowerCase();
  if (['done', 'completed', 'validated', 'termine', 'terminé'].includes(normalized)) return 'Terminé';
  if (['in_progress', 'progress', 'en_cours', 'en cours'].includes(normalized)) return 'En cours';
  return 'A faire';
}

function mapSolvencyStatus(value: unknown): ViewingReport['solvencyStatus'] {
  const normalized = String(value ?? '').toLowerCase();
  if (normalized.includes('non')) return 'Non validée';
  if (normalized.includes('cours') || normalized.includes('pending')) return 'En cours';
  return 'Validée';
}

function mapInterestLevel(value: unknown): ViewingReport['interestLevel'] {
  const normalized = String(value ?? '').toLowerCase();
  if (normalized.includes('offre')) return 'Offre formulée';
  if (normalized.includes('faible') || normalized.includes('low')) return 'Faible';
  if (normalized.includes('moyen') || normalized.includes('medium')) return 'Moyen';
  return 'Élevé';
}

function mapFinancingType(value: unknown): BuyerOffer['financingType'] {
  const normalized = String(value ?? '').toLowerCase();
  if (normalized.includes('apport')) return 'Apport Personnel';
  if (normalized.includes('mix')) return 'Mixte';
  return 'Emprunt Bancaire';
}

function mapOfferStatus(value: unknown): BuyerOffer['status'] {
  const normalized = String(value ?? '').toLowerCase();
  if (normalized.includes('accept')) return 'Acceptée';
  if (normalized.includes('refus') || normalized.includes('reject')) return 'Refusée';
  if (normalized.includes('contre') || normalized.includes('counter')) return 'Contre-proposition';
  return 'Reçue';
}

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function numberValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const normalized = value.replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

// ====================================================================
// NOUVEAUX MAPPINGS : Sections estimation manquantes (pages 4-15 du PDF)
// ====================================================================

function mapSocioEconomic(report: JsonRecord): SocioEconomicData | undefined {
  const socio = asRecord(report.socio_economic);
  if (Object.keys(socio).length === 0) return undefined;
  return {
    population: numberValue(socio.population) ?? 0,
    households: numberValue(socio.households, socio.menages) ?? 0,
    medianIncome: numberValue(socio.median_income, socio.revenu_median) ?? 0,
    buyerProfiles: mapBuyerProfiles(socio.buyer_profiles ?? socio.profils_acquereurs),
    interestRate: numberValue(socio.interest_rate, socio.taux_interet) ?? 0,
    seniorityDistribution: mapSeniorityItems(socio.seniority ?? socio.anciennete),
    activityDistribution: mapActivityDistribution(socio.activities ?? socio.activites),
  };
}

function mapBuyerProfiles(value: unknown): SocioEconomicData['buyerProfiles'] {
  return asArray(value).map((item) => {
    const row = asRecord(item);
    return {
      type: (text(row.type) as SocioEconomicData['buyerProfiles'][0]['type']) || 'COUPLE',
      interestedIn: text(row.interested_in, row.interesse_par, ''),
      budgetRange: {
        low: numberValue(row.budget_low, row.budget_min) ?? 0,
        high: numberValue(row.budget_high, row.budget_max) ?? 0,
      },
      requiredIncomeRange: {
        low: numberValue(row.income_low, row.revenu_min) ?? 0,
        high: numberValue(row.income_high, row.revenu_max) ?? 0,
      },
    };
  });
}

function mapSeniorityItems(value: unknown): SocioEconomicData['seniorityDistribution'] {
  return asArray(value).map((item) => {
    const row = asRecord(item);
    return {
      label: text(row.label, ''),
      percent: numberValue(row.percent, row.pourcent) ?? 0,
    };
  });
}

function mapActivityDistribution(value: unknown): SocioEconomicData['activityDistribution'] | undefined {
  const row = asRecord(value);
  const keys = ['agriculteurs', 'artisans', 'cadres', 'intermediaires', 'employes', 'ouvriers', 'retraites', 'sansEmploi'] as const;
  const hasAny = keys.some(k => numberValue(row[k]) !== undefined);
  if (!hasAny) return undefined;
  return {
    agriculteurs: numberValue(row.agriculteurs) ?? 0,
    artisans: numberValue(row.artisans) ?? 0,
    cadres: numberValue(row.cadres) ?? 0,
    intermediaires: numberValue(row.intermediaires) ?? 0,
    employes: numberValue(row.employes) ?? 0,
    ouvriers: numberValue(row.ouvriers) ?? 0,
    retraites: numberValue(row.retraites) ?? 0,
    sansEmploi: numberValue(row.sansEmploi, row.sans_emploi) ?? 0,
  };
}

function mapMarketDistribution(report: JsonRecord): MarketDistribution | undefined {
  const market = asRecord(report.market);
  const dist = asRecord(market.distribution);
  if (Object.keys(dist).length === 0) return undefined;
  return {
    housingTypes: {
      maison: numberValue(dist.housing_maison, dist.maison) ?? 0,
      appartement: numberValue(dist.housing_appartement, dist.appartement) ?? 0,
      hlm: numberValue(dist.housing_hlm, dist.hlm) ?? 0,
    },
    occupancy: {
      principales: numberValue(dist.occupancy_principales, dist.principales) ?? 0,
      secondaires: numberValue(dist.occupancy_secondaires, dist.secondaires) ?? 0,
      vacants: numberValue(dist.occupancy_vacants, dist.vacants) ?? 0,
    },
    roomsDistribution: mapDistributionItems(dist.rooms ?? dist.pieces),
    surfaceDistribution: mapDistributionItems(dist.surfaces ?? dist.surface_distribution),
    bienPosition: {
      surfaceRange: text(dist.bien_surface_range, ''),
      roomsCount: numberValue(dist.bien_rooms, dist.bien_pieces) ?? 0,
    },
  };
}

function mapDistributionItems(value: unknown): { label: string; percent: number }[] {
  return asArray(value).map((item) => {
    const row = asRecord(item);
    return {
      label: text(row.label, ''),
      percent: numberValue(row.percent, row.pourcent) ?? 0,
    };
  });
}

function mapMarketTrend(report: JsonRecord): MarketTrend | undefined {
  const market = asRecord(report.market);
  const trend = asRecord(market.trend ?? market.tendance);
  if (Object.keys(trend).length === 0) return undefined;
  const history = asArray(trend.history ?? trend.historique).map((item) => {
    const row = asRecord(item);
    return {
      quarter: text(row.quarter, row.trimestre, ''),
      medianPrice: numberValue(row.medianPrice, row.median_price) ?? 0,
      highPrice: numberValue(row.highPrice, row.high_price) ?? 0,
      lowPrice: numberValue(row.lowPrice, row.low_price) ?? 0,
      changePercent: numberValue(row.changePercent, row.change_percent) ?? 0,
    };
  });
  return {
    pricePerSqmLow: numberValue(trend.price_per_sqm_low, trend.low) ?? 0,
    pricePerSqmMedian: numberValue(trend.price_per_sqm_median, trend.median) ?? 0,
    pricePerSqmHigh: numberValue(trend.price_per_sqm_high, trend.high) ?? 0,
    evolution6m: numberValue(trend.evolution_6m) ?? 0,
    evolution1y: numberValue(trend.evolution_1y) ?? 0,
    evolution2y: numberValue(trend.evolution_2y) ?? 0,
    history,
  };
}

function mapMarketTension(report: JsonRecord): MarketTension | undefined {
  const market = asRecord(report.market);
  const tension = asRecord(market.tension);
  if (Object.keys(tension).length === 0) return undefined;
  const level = (text(tension.level, tension.niveau) || 'équilibré') as MarketTension['level'];
  return {
    level,
    levelLabel: text(tension.label, tension.libelle, level),
    levelDescription: text(tension.description, tension.description_marche, ''),
    history: asArray(tension.history ?? tension.historique).map((item) => {
      const row = asRecord(item);
      return { quarter: text(row.quarter, row.trimestre, ''), value: numberValue(row.value, row.valeur) ?? 0 };
    }),
    saleDelays: {
      fastest: numberValue(tension.delay_fastest, tension.delai_rapide) ?? 0,
      median: numberValue(tension.delay_median, tension.delai_median) ?? 0,
      slowest: numberValue(tension.delay_slowest, tension.delai_lent) ?? 0,
    },
    stockIndicator: text(tension.stock_indicator, tension.indicateur_stock, ''),
    priceRevisionIndicator: text(tension.price_revision, tension.revision_prix, ''),
  };
}

function mapExtendedComparables(value: unknown): ExtendedComparableProperty[] | undefined {
  const rows = asArray(value).map((item, index) => {
    const comp = asRecord(item);
    const surface = numberValue(comp.surface) ?? 0;
    const price = numberValue(comp.price, comp.prix) ?? 0;
    return {
      id: text(comp.id, `ext-comp-${index + 1}`),
      title: text(comp.title, comp.titre, `Bien ${index + 1}`),
      price,
      pricePerSqm: numberValue(comp.pricePerSqm, comp.price_per_sqm, comp.prix_m2) ?? (surface > 0 ? Math.round(price / surface) : 0),
      surface,
      landSurface: numberValue(comp.landSurface, comp.land_surface, comp.surface_terrain) ?? 0,
      rooms: numberValue(comp.rooms, comp.nb_pieces) ?? 0,
      bedrooms: numberValue(comp.bedrooms, comp.chambres) ?? 0,
      stairs: numberValue(comp.stairs, comp.escaliers),
      garage: numberValue(comp.garage),
      year: numberValue(comp.year, comp.annee),
      address: text(comp.address, comp.adresse, ''),
      daysOnMarket: text(comp.daysOnMarket, comp.days_on_market, comp.jours_en_ligne),
      status: (text(comp.status, comp.statut) || 'En vente') as ExtendedComparableProperty['status'],
      energyLabel: text(comp.energyLabel, comp.energy_label),
    };
  }).filter((comp) => comp.price > 0 || comp.surface > 0);
  return rows.length > 0 ? rows : undefined;
}

function mapPositioning(report: JsonRecord): PositioningData | undefined {
  const positioning = asRecord(report.positioning);
  if (Object.keys(positioning).length === 0) return undefined;
  const thresholds = asRecord(positioning.thresholds ?? positioning.seuils);
  return {
    pricePerSqmRank: numberValue(positioning.price_per_sqm_rank, positioning.rang_prix_m2) ?? 0,
    totalCompetitors: numberValue(positioning.total_competitors, positioning.total_concurrents) ?? 0,
    cheaperPercent: numberValue(positioning.cheaper_percent, positioning.moins_cher_pct) ?? 0,
    largerPercent: numberValue(positioning.larger_percent, positioning.plus_grand_pct) ?? 0,
    cheaperAndLargerPercent: numberValue(positioning.cheaper_and_larger_percent, positioning.moins_cher_plus_grand_pct) ?? 0,
    priceThresholds: {
      low: numberValue(thresholds.low) ?? 0,
      median: numberValue(thresholds.median) ?? 0,
      high: numberValue(thresholds.high) ?? 0,
    },
    averageCompetitorPricePerSqm: numberValue(positioning.average_competitor_price_per_sqm, positioning.prix_m2_moyen_concurrents) ?? 0,
  };
}

function mapSynthesis(report: JsonRecord): SynthesisData | undefined {
  const synthesis = asRecord(report.synthesis ?? report.synthese);
  if (Object.keys(synthesis).length === 0) return undefined;
  const marketMethod = asRecord(synthesis.market ?? synthesis.marche);
  const comparablesMethod = asRecord(synthesis.comparables);
  const aiMethod = asRecord(synthesis.ai ?? synthesis.ia);
  return {
    marketMethod: {
      low: numberValue(marketMethod.low) ?? 0,
      median: numberValue(marketMethod.median) ?? 0,
      high: numberValue(marketMethod.high) ?? 0,
    },
    comparablesMethod: {
      low: numberValue(comparablesMethod.low) ?? 0,
      median: numberValue(comparablesMethod.median) ?? 0,
      high: numberValue(comparablesMethod.high) ?? 0,
    },
    aiMethod: {
      low: numberValue(aiMethod.low) ?? 0,
      median: numberValue(aiMethod.median) ?? 0,
      high: numberValue(aiMethod.high) ?? 0,
    },
  };
}

function mapIadTrackRecord(report: JsonRecord): SoldPropertyByIad[] | undefined {
  const records = asArray(report.track_record ?? report.biens_vendus_iad).map((item, index) => {
    const row = asRecord(item);
    const price = numberValue(row.price, row.prix) ?? 0;
    const surface = numberValue(row.surface) ?? 0;
    return {
      id: text(row.id, `iad-${index + 1}`),
      title: text(row.title, row.titre, `Bien iad ${index + 1}`),
      address: text(row.address, row.adresse, ''),
      price,
      pricePerSqm: numberValue(row.pricePerSqm, row.price_per_sqm, row.prix_m2) ?? (surface > 0 ? Math.round(price / surface) : 0),
      soldDate: text(row.soldDate, row.sold_date, row.date_vente, ''),
      type: (text(row.type) === 'Appartement' ? 'Appartement' : 'Maison') as SoldPropertyByIad['type'],
    };
  }).filter((r) => r.price > 0 || r.title);
  return records.length > 0 ? records : undefined;
}