import type {
  AdvisorInfo,
  ClientRecord,
  ComparableProperty,
  DocumentItem,
  PropertyPoint,
  SalesStep,
} from '../types';
import { advisorInfo as defaultAdvisorInfo } from '../data';
import { defaultClients, defaultDocuments, defaultOffers, defaultPortalStats, defaultSalesSteps, defaultViewings, type MultiClientState } from './store';
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
  title?: string | null;
  status?: string | null;
  property_snapshot?: unknown;
  professional_opinion?: unknown;
  advisor_note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ClientDocumentRow = {
  id: string;
  label?: string | null;
  name?: string | null;
  category?: string | null;
  status?: string | null;
  storage_path?: string | null;
  file_url?: string | null;
  file_size?: number | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ClientEventRow = {
  id: string;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  status?: string | null;
  event_date?: string | null;
  created_at?: string | null;
};

export type RemotePortalStatus = 'idle' | 'loading' | 'synced' | 'demo' | 'unauthenticated' | 'empty' | 'error';

export type RemotePortalLoadResult = {
  status: Exclude<RemotePortalStatus, 'idle' | 'loading'>;
  state?: MultiClientState;
  message?: string;
};

export async function loadMandatOsPortalState(): Promise<RemotePortalLoadResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'demo', message: 'Supabase non configuré : le portail reste en mode démonstration.' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { status: 'demo' };

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  const user = userResult?.user;

  if (userError || !user?.email) {
    return { status: 'unauthenticated', message: 'Aucune session client active.' };
  }

  const profile = await findClientProfile(user.id, user.email);
  if (!profile) return { status: 'empty', message: 'Aucun profil client rattaché à cette session.' };

  const dossier = await findActiveDossier(profile.id);
  if (!dossier) return { status: 'empty', message: 'Aucun dossier client actif pour ce profil.' };

  const [documents, events] = await Promise.all([
    loadDocuments(dossier.id),
    loadEvents(dossier.id),
  ]);

  return {
    status: 'synced',
    state: mapDossierToMultiClientState(profile, dossier, documents, events),
  };
}

async function findClientProfile(userId: string, email: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const byUser = await supabase
    .from('client_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (byUser.error) throw byUser.error;
  if (byUser.data) return byUser.data as ClientProfileRow;

  const byEmail = await supabase
    .from('client_profiles')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (byEmail.error) throw byEmail.error;
  return (byEmail.data as ClientProfileRow | null) ?? null;
}

async function findActiveDossier(profileId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const requestedDossierId = getRequestedDossierId();
  let query = supabase
    .from('client_dossiers')
    .select('*')
    .eq('client_profile_id', profileId)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (requestedDossierId) query = query.eq('id', requestedDossierId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return (data as ClientDossierRow | null) ?? null;
}

async function loadDocuments(dossierId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('dossier_id', dossierId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ClientDocumentRow[];
}

async function loadEvents(dossierId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('client_dossier_events')
    .select('*')
    .eq('dossier_id', dossierId)
    .order('event_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ClientEventRow[];
}

function mapDossierToMultiClientState(
  profile: ClientProfileRow,
  dossier: ClientDossierRow,
  documents: ClientDocumentRow[],
  events: ClientEventRow[],
): MultiClientState {
  const baseClient = defaultClients[0];
  const snapshot = asRecord(dossier.property_snapshot);
  const opinion = asRecord(dossier.professional_opinion);
  const report = asRecord(opinion.iad_report ?? opinion.report);
  const cover = asRecord(report.cover);
  const advisor = asRecord(report.advisor);
  const property = asRecord(report.property);
  const market = asRecord(report.market);
  const positioning = asRecord(report.positioning);
  const comparables = asRecord(report.comparables);

  const address = text(
    snapshot.adresse,
    snapshot.address,
    cover.subtitle,
    baseClient.clientInfo.address,
  );

  const client: ClientRecord = {
    ...baseClient,
    id: dossier.id,
    clientInfo: {
      names: text(
        cover.recipient,
        [profile.first_name, profile.last_name].filter(Boolean).join(' '),
        profile.email,
        baseClient.clientInfo.names,
      ),
      address,
      date: text(cover.date, formatDate(dossier.updated_at), baseClient.clientInfo.date),
      projectTitle: text(cover.title, dossier.title, baseClient.clientInfo.projectTitle),
    },
    propertyDetails: {
      ...baseClient.propertyDetails,
      surface: numberValue(snapshot.surface, snapshot.surface_habitable, findStat(property, 'surface')) ?? baseClient.propertyDetails.surface,
      rooms: numberValue(snapshot.nb_pieces, snapshot.rooms, findStat(property, 'pièce')) ?? baseClient.propertyDetails.rooms,
      floors: numberValue(snapshot.floors, snapshot.niveaux, findStat(property, 'niveau')) ?? baseClient.propertyDetails.floors,
      landSurface: numberValue(snapshot.surface_terrain, snapshot.land_surface, findStat(property, 'terrain')) ?? baseClient.propertyDetails.landSurface,
      bedrooms: numberValue(snapshot.bedrooms, snapshot.chambres, findStat(property, 'chambre')) ?? baseClient.propertyDetails.bedrooms,
      year: numberValue(snapshot.year, snapshot.annee_construction, findStat(property, 'année')) ?? baseClient.propertyDetails.year,
      address,
      description: text(property.title, snapshot.description, dossier.advisor_note, baseClient.propertyDetails.description),
    },
    pointsForts: mapPoints(property.strengths, baseClient.pointsForts),
    pointsDefendre: mapPoints(property.objections, baseClient.pointsDefendre),
    documents: documents.length > 0 ? documents.map(mapDocument) : defaultDocuments,
    viewings: defaultViewings,
    salesSteps: events.length > 0 ? events.map(mapEvent) : defaultSalesSteps,
    offers: defaultOffers,
    portalStats: defaultPortalStats,
    cadastralParcels: mapCadastralRows(report) ?? baseClient.cadastralParcels,
    marketPriceRanges: {
      low: numberValue(market.price_per_sqm_low, positioning.low_per_sqm) ?? baseClient.marketPriceRanges?.low ?? 3000,
      median: numberValue(market.price_per_sqm_median, positioning.median_per_sqm) ?? baseClient.marketPriceRanges?.median ?? 4000,
      high: numberValue(market.price_per_sqm_high, positioning.high_per_sqm) ?? baseClient.marketPriceRanges?.high ?? 5000,
      currentReferencePrice: numberValue(positioning.reference_price, opinion.price_suggested, snapshot.prix_estime) ?? baseClient.marketPriceRanges?.currentReferencePrice,
      currentReferencePricePerSqm: numberValue(positioning.reference_price_per_sqm, market.price_per_sqm_median) ?? baseClient.marketPriceRanges?.currentReferencePricePerSqm,
    },
    soldComparables: mapComparables(comparables.sold ?? opinion.comparables) ?? baseClient.soldComparables,
    recommendedPriceRange: {
      low: numberValue(opinion.price_low, positioning.threshold_low_price) ?? baseClient.recommendedPriceRange?.low ?? 0,
      high: numberValue(opinion.price_high, positioning.threshold_high_price) ?? baseClient.recommendedPriceRange?.high ?? 0,
    },
  };

  return {
    currentClientId: client.id,
    clients: [client],
    advisorInfo: mapAdvisor(advisor),
  };
}

function mapAdvisor(advisor: JsonRecord): AdvisorInfo {
  return {
    ...defaultAdvisorInfo,
    name: text(advisor.name, defaultAdvisorInfo.name),
    phone: text(advisor.phone, defaultAdvisorInfo.phone),
    email: text(advisor.email, defaultAdvisorInfo.email),
  };
}

function mapDocument(document: ClientDocumentRow): DocumentItem {
  return {
    id: document.id,
    name: text(document.label, document.name, 'Document client'),
    category: mapDocumentCategory(document.category),
    size: document.file_size ? formatFileSize(document.file_size) : '',
    dateAdded: formatDate(document.updated_at ?? document.created_at),
    status: mapDocumentStatus(document.status),
    uploadedBy: document.created_by === 'client' ? 'Vendeur' : 'Conseiller',
    fileUrl: document.file_url ?? document.storage_path ?? undefined,
  };
}

function mapEvent(event: ClientEventRow, index: number): SalesStep {
  return {
    id: event.id,
    order: index + 1,
    title: text(event.title, `Étape ${index + 1}`),
    description: text(event.description, event.content, ''),
    status: mapEventStatus(event.status),
    completedDate: ['done', 'completed', 'validated'].includes(String(event.status)) ? formatDate(event.event_date ?? event.created_at) : undefined,
    responsible: 'Conseiller',
  };
}

function mapPoints(value: unknown, fallback: PropertyPoint[]) {
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

  return values.length > 0 ? values : fallback;
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
  const params = new URLSearchParams(window.location.search);
  return params.get('dossier') ?? params.get('dossier_id') ?? import.meta.env.VITE_CLIENT_DOSSIER_ID ?? null;
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
