import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ArrowUp,
  Download,
  Info,
  GitCompare,
  CheckSquare,
  FolderOpen,
  Users as UsersIcon,
  Compass,
  Handshake,
  BarChart3,
  LockKeyhole,
  RefreshCw,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react';

import { clearAppState, getMultiClientState, saveMultiClientState } from './lib/store';

import Navbar from './components/Navbar';
import CoverSection from './components/CoverSection';
import SituationSection from './components/SituationSection';
import PropertySection from './components/PropertySection';
import MarketSection from './components/MarketSection';
import CompetitionSection from './components/CompetitionSection';
import ComparablesSection from './components/ComparablesSection';
import ConclusionSection from './components/ConclusionSection';
import IadSection from './components/IadSection';
import IadLogo from './components/IadLogo';

import DocumentsSection from './components/DocumentsSection';
import VisitsSection from './components/VisitsSection';
import SalesPlanSection from './components/SalesPlanSection';
import OffersSection from './components/OffersSection';
import StatsSection from './components/StatsSection';
import { DocumentItem, ViewingReport, SalesStep, BuyerOffer, PortalStat, ClientRecord, AppState } from './types';
import { loadLocalTestDossiers, loadMandatOsPortalState, type LocalTestDossier, type RemotePortalStatus } from './lib/mandat-os-portal';

const EVAL_SECTIONS = ['estimationEmpty', 'situation', 'property', 'market', 'competition', 'comparables', 'conclusion', 'iad'];
const TRANS_SECTIONS = ['transactionTeaser', 'documents', 'viewings', 'salesPlan', 'offers', 'stats'];

export default function App() {
  const [multiClientState, setMultiClientState] = useState(() => getMultiClientState());
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [remoteStatus, setRemoteStatus] = useState<RemotePortalStatus>('idle');

  const [lastEvalSection, setLastEvalSection] = useState<string>('situation');
  const [lastTransSection, setLastTransSection] = useState<string>('documents');

  const currentClient = multiClientState.clients.find((c: ClientRecord) => c.id === multiClientState.currentClientId) || multiClientState.clients[0];
  const appState: AppState = {
    clientInfo: currentClient.clientInfo,
    advisorInfo: multiClientState.advisorInfo,
    estimationStatus: currentClient.estimationStatus,
    salesFollowUpStatus: currentClient.salesFollowUpStatus,
    propertyContext: currentClient.propertyContext,
    propertyDetails: currentClient.propertyDetails,
    pointsForts: currentClient.pointsForts,
    pointsDefendre: currentClient.pointsDefendre,
    documents: currentClient.documents,
    viewings: currentClient.viewings,
    salesSteps: currentClient.salesSteps,
    offers: currentClient.offers,
    portalStats: currentClient.portalStats,
    cadastralParcels: currentClient.cadastralParcels || [],
    marketPriceRanges: currentClient.marketPriceRanges,
    soldComparables: currentClient.soldComparables || [],
    recommendedPriceRange: currentClient.recommendedPriceRange,
    socioEconomicData: currentClient.socioEconomicData,
    marketDistribution: currentClient.marketDistribution,
    marketTrend: currentClient.marketTrend,
    marketTension: currentClient.marketTension,
    competingProperties: currentClient.competingProperties,
    unsoldProperties: currentClient.unsoldProperties,
    positioningData: currentClient.positioningData,
    synthesisData: currentClient.synthesisData,
    iadTrackRecord: currentClient.iadTrackRecord,
  };

  const setAppState = (updater: AppState | ((prev: AppState) => AppState)) => {
    setMultiClientState((prev) => {
      const cc = prev.clients.find((c: ClientRecord) => c.id === prev.currentClientId) || prev.clients[0];
      const currentAppState: AppState = {
        clientInfo: cc.clientInfo,
        advisorInfo: prev.advisorInfo,
        estimationStatus: cc.estimationStatus,
        salesFollowUpStatus: cc.salesFollowUpStatus,
        propertyContext: cc.propertyContext,
        propertyDetails: cc.propertyDetails,
        pointsForts: cc.pointsForts,
        pointsDefendre: cc.pointsDefendre,
        documents: cc.documents,
        viewings: cc.viewings,
        salesSteps: cc.salesSteps,
        offers: cc.offers,
        portalStats: cc.portalStats,
        cadastralParcels: cc.cadastralParcels || [],
        marketPriceRanges: cc.marketPriceRanges,
        soldComparables: cc.soldComparables || [],
        recommendedPriceRange: cc.recommendedPriceRange,
        socioEconomicData: cc.socioEconomicData,
        marketDistribution: cc.marketDistribution,
        marketTrend: cc.marketTrend,
        marketTension: cc.marketTension,
        competingProperties: cc.competingProperties,
        unsoldProperties: cc.unsoldProperties,
        positioningData: cc.positioningData,
        synthesisData: cc.synthesisData,
        iadTrackRecord: cc.iadTrackRecord,
      };

      const newState = typeof updater === 'function' ? updater(currentAppState) : updater;

      const updatedClients = prev.clients.map((c: ClientRecord) => {
        if (c.id === prev.currentClientId) {
          return { ...c,
            clientInfo: newState.clientInfo,
            estimationStatus: newState.estimationStatus,
            salesFollowUpStatus: newState.salesFollowUpStatus,
            propertyContext: newState.propertyContext,
            propertyDetails: newState.propertyDetails,
            pointsForts: newState.pointsForts,
            pointsDefendre: newState.pointsDefendre,
            documents: newState.documents,
            viewings: newState.viewings,
            salesSteps: newState.salesSteps,
            offers: newState.offers,
            portalStats: newState.portalStats,
            cadastralParcels: newState.cadastralParcels,
            marketPriceRanges: newState.marketPriceRanges,
            soldComparables: newState.soldComparables,
            recommendedPriceRange: newState.recommendedPriceRange,
            socioEconomicData: newState.socioEconomicData,
            marketDistribution: newState.marketDistribution,
            marketTrend: newState.marketTrend,
            marketTension: newState.marketTension,
            competingProperties: newState.competingProperties,
            unsoldProperties: newState.unsoldProperties,
            positioningData: newState.positioningData,
            synthesisData: newState.synthesisData,
            iadTrackRecord: newState.iadTrackRecord,
          };
        }
        return c;
      });

      const next = { ...prev, clients: updatedClients, advisorInfo: newState.advisorInfo };
      saveMultiClientState(next);
      return next;
    });
  };

  useEffect(() => {
    if (EVAL_SECTIONS.includes(activeSection)) setLastEvalSection(activeSection);
    else if (TRANS_SECTIONS.includes(activeSection)) setLastTransSection(activeSection);
  }, [activeSection]);

  useEffect(() => { saveMultiClientState(multiClientState); }, [multiClientState]);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      setRemoteStatus('loading');
      try {
        const result = await loadMandatOsPortalState();
        if (cancelled) return;
        if (result.state) setMultiClientState(result.state);
        setRemoteStatus(result.status);
      } catch (error) {
        console.error('[Mandat OS]', error);
        if (!cancelled) setRemoteStatus('error');
      }
    };
    hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleStartPresentation = () => {
    setActiveSection(appState.estimationStatus === 'published' ? 'situation' : 'estimationEmpty');
    scrollToTop();
  };

  const handleAddDocument = (newDoc: Omit<DocumentItem, 'id'>) => {
    const doc: DocumentItem = { ...newDoc, id: `doc-${Date.now()}` };
    setAppState((prev) => ({ ...prev, documents: [...prev.documents, doc] }));
  };
  const handleDeleteDocument = (id: string) => setAppState((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));

  const handleAddViewing = (newViewing: Omit<ViewingReport, 'id'>) => {
    const viewing: ViewingReport = { ...newViewing, id: `view-${Date.now()}` };
    setAppState((prev) => ({ ...prev, viewings: [...prev.viewings, viewing] }));
  };
  const handleDeleteViewing = (id: string) => setAppState((prev) => ({ ...prev, viewings: prev.viewings.filter((v) => v.id !== id) }));

  const handleUpdateStepStatus = (id: string, status: SalesStep['status']) => {
    setAppState((prev) => {
      const steps = prev.salesSteps.map((step) =>
        step.id === id ? { ...step, status, completedDate: status === 'Terminé' ? new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined } : step
      );
      return { ...prev, salesSteps: steps };
    });
  };

  const handleAddOffer = (newOffer: Omit<BuyerOffer, 'id'>) => {
    setAppState((prev) => ({ ...prev, offers: [...prev.offers, { ...newOffer, id: `offer-${Date.now()}` }] }));
  };
  const handleDeleteOffer = (id: string) => setAppState((prev) => ({ ...prev, offers: prev.offers.filter((o) => o.id !== id) }));
  const handleUpdateOfferStatus = (id: string, status: BuyerOffer['status']) => {
    setAppState((prev) => ({ ...prev, offers: prev.offers.map((o) => (o.id === id ? { ...o, status } : o)) }));
  };

  const isEstimationPublished = appState.estimationStatus === 'published';
  const isSalesFollowUpActive = appState.salesFollowUpStatus === 'active';
  const isEvaluation = EVAL_SECTIONS.includes(activeSection);
  const isTransaction = TRANS_SECTIONS.includes(activeSection);
  const shouldBlockForAccess = ['unauthenticated', 'empty', 'error'].includes(remoteStatus);

  if (remoteStatus === 'loading') return <AccessState title="Chargement..." description="Préparation du dossier client." />;
  if (shouldBlockForAccess) return <AccessState title="Accès requis" description="Connectez-vous depuis le lien sécurisé transmis par votre conseiller." showLocalTestMode={import.meta.env.DEV} />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Navbar activeSection={activeSection} setActiveSection={(sec: string) => { setActiveSection(sec); scrollToTop(); }} advisor={appState.advisorInfo} lastEvalSection={isEstimationPublished ? lastEvalSection : 'estimationEmpty'} lastTransSection={isSalesFollowUpActive ? lastTransSection : 'transactionTeaser'} />

      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-20 px-6 py-4.5 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-600">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-3 min-w-0">
            <div className="lg:hidden shrink-0"><IadLogo className="h-8" showText={false} /></div>
            <div className="min-w-0 flex flex-col">
              <p className="truncate text-sm font-extrabold text-slate-900">{appState.clientInfo.names || 'Dossier client'}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] font-medium text-slate-500"><MapPin className="h-3 w-3 shrink-0 text-slate-300" /><span className="truncate">{formatPropertyContext(appState.propertyContext, appState.clientInfo.address)}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="hidden sm:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl"><Download className="w-3.5 h-3.5" /><span>Imprimer</span></button>
            <a href={`tel:${appState.advisorInfo.phone.replace(/\s/g, '')}`} className="flex items-center justify-center p-2.5 bg-[#00A0E2] text-white rounded-xl"><Phone className="w-4 h-4" /></a>
          </div>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-950 z-30 lg:hidden" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white p-6 z-40 lg:hidden flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <IadLogo className="h-10" color="#FFFFFF" showText={true} />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="h-px bg-slate-800" />
                <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
                  {[
                    { id: 'cover', label: 'Accueil', target: 'cover', active: activeSection === 'cover' },
                    { id: 'evaluation', label: 'Estimation', target: isEstimationPublished ? lastEvalSection : 'estimationEmpty', active: isEvaluation },
                    { id: 'transaction', label: 'Suivi de Vente', target: isSalesFollowUpActive ? lastTransSection : 'transactionTeaser', active: isTransaction },
                  ].map((item) => (
                    <button key={item.id} onClick={() => { setActiveSection(item.target); setIsMobileMenuOpen(false); scrollToTop(); }} className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-xs font-bold ${item.active ? 'bg-[#00A0E2] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                      <span>{item.label}</span><ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  ))}
                </nav>
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img src={appState.advisorInfo.avatar} alt={appState.advisorInfo.name} className="w-9 h-9 rounded-full object-cover border border-[#00A0E2]/30" />
                    <div className="min-w-0"><h4 className="text-xs font-bold text-white truncate">{appState.advisorInfo.name}</h4><p className="text-[10px] text-slate-400 truncate">{appState.advisorInfo.title}</p></div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
          {activeSection !== 'cover' && !(activeSection === 'estimationEmpty' && !isEstimationPublished) && !(isTransaction && !isSalesFollowUpActive) && (
            <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none shadow-sm">
              {(() => {
                if (isEvaluation) {
                  if (!isEstimationPublished) return [{ id: 'estimationEmpty', label: 'En préparation', icon: Info }];
                  return [
                    { id: 'situation', label: 'Situation', icon: MapPin },
                    { id: 'property', label: 'Fiche bien', icon: Info },
                    { id: 'market', label: 'Marché', icon: TrendingUp },
                    { id: 'competition', label: 'Concurrence', icon: Target },
                    { id: 'comparables', label: 'Comparables', icon: GitCompare },
                    { id: 'conclusion', label: 'Avis', icon: CheckSquare },
                    { id: 'iad', label: 'iad', icon: Award },
                  ];
                }
                if (isTransaction) return [
                  { id: 'documents', label: 'Dossier', icon: FolderOpen },
                  { id: 'viewings', label: 'Visites', icon: UsersIcon },
                  { id: 'salesPlan', label: 'Plan', icon: Compass },
                  { id: 'offers', label: 'Offres', icon: Handshake },
                  { id: 'stats', label: 'Stats', icon: BarChart3 },
                ];
                return [];
              })().map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button key={tab.id} onClick={() => { setActiveSection(tab.id); scrollToTop(); }} className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${isActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                    {isActive && <motion.div layoutId="activeSubTab" className="absolute inset-0 bg-slate-100 rounded-xl -z-10" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />}
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00A0E2]' : 'text-slate-400'}`} /><span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }} className="w-full flex flex-col">
              {activeSection === 'cover' && <CoverSection client={appState.clientInfo} advisor={appState.advisorInfo} propertyDetails={appState.propertyDetails} estimationStatus={appState.estimationStatus} onStart={handleStartPresentation} />}
              {activeSection === 'estimationEmpty' && <EmptyContentState title="Estimation en préparation" description="Votre estimation sera visible ici dès sa publication." />}
              {activeSection === 'situation' && (appState.cadastralParcels?.length ? <SituationSection cadastralParcels={appState.cadastralParcels} clientAddress={appState.clientInfo.address} /> : <EmptyContentState title="Situation en préparation" description="Données cadastrales à venir." />)}
              {activeSection === 'property' && (hasPropertyDetails(appState.propertyDetails) ? <PropertySection propertyDetails={appState.propertyDetails} pointsForts={appState.pointsForts} pointsDefendre={appState.pointsDefendre} /> : <EmptyContentState title="Fiche bien en préparation" description="Caractéristiques à venir." />)}
              {activeSection === 'market' && <MarketSection socioEconomicData={appState.socioEconomicData} marketDistribution={appState.marketDistribution} marketTrend={appState.marketTrend} marketTension={appState.marketTension} />}
              {activeSection === 'competition' && <CompetitionSection competingProperties={appState.competingProperties} unsoldProperties={appState.unsoldProperties} positioningData={appState.positioningData} synthesisData={appState.synthesisData} propertyDetails={appState.propertyDetails} referencePrice={appState.marketPriceRanges?.currentReferencePrice} />}
              {activeSection === 'comparables' && (appState.soldComparables?.length ? <ComparablesSection soldComparables={appState.soldComparables} propertyDetails={appState.propertyDetails} referencePrice={appState.marketPriceRanges?.currentReferencePrice} /> : <EmptyContentState title="Comparables en préparation" description="Données à venir." />)}
              {activeSection === 'conclusion' && (appState.recommendedPriceRange ? <ConclusionSection clientInfo={appState.clientInfo} advisorInfo={appState.advisorInfo} recommendedPriceRange={appState.recommendedPriceRange} propertySize={appState.propertyDetails.surface} /> : <EmptyContentState title="Recommandations en préparation" description="Avis de valeur à venir." />)}
              {activeSection === 'iad' && <IadSection iadTrackRecord={appState.iadTrackRecord} />}

              {activeSection === 'documents' && (isSalesFollowUpActive ? <DocumentsSection documents={appState.documents} onAddDocument={handleAddDocument} onDeleteDocument={handleDeleteDocument} readOnly /> : <SalesFollowUpTeaser />)}
              {activeSection === 'viewings' && (isSalesFollowUpActive ? <VisitsSection viewings={appState.viewings} onAddViewing={handleAddViewing} onDeleteViewing={handleDeleteViewing} readOnly /> : <SalesFollowUpTeaser />)}
              {activeSection === 'salesPlan' && (isSalesFollowUpActive ? <SalesPlanSection salesSteps={appState.salesSteps} onUpdateStepStatus={handleUpdateStepStatus} readOnly /> : <SalesFollowUpTeaser />)}
              {activeSection === 'offers' && (isSalesFollowUpActive ? <OffersSection offers={appState.offers} onAddOffer={handleAddOffer} onDeleteOffer={handleDeleteOffer} onUpdateOfferStatus={handleUpdateOfferStatus} readOnly /> : <SalesFollowUpTeaser />)}
              {activeSection === 'stats' && (isSalesFollowUpActive ? <StatsSection portalStats={appState.portalStats} /> : <SalesFollowUpTeaser />)}
              {activeSection === 'transactionTeaser' && <SalesFollowUpTeaser />}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-auto py-6 px-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-2"><IadLogo className="h-6" showText={false} /><span>© 2026 iad France</span></div>
          <div className="flex items-center gap-4"><span>Espace vendeur privé · Alexandre Lopez</span><span>•</span><a href="https://www.iadfrance.fr" target="_blank" rel="noreferrer" className="hover:text-[#00A0E2]">iadfrance.fr</a><span>•</span><span>Réseau de mandataires</span></div>
        </footer>

        <AnimatePresence>
          {showScrollTop && <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={scrollToTop} className="fixed bottom-6 right-6 p-3.5 bg-slate-900 text-white rounded-full shadow-2xl z-20"><ArrowUp className="w-5 h-5" /></motion.button>}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccessState({ title, description, showLocalTestMode = false }: { title: string; description: string; showLocalTestMode?: boolean }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="max-w-3xl w-full bg-white border border-slate-100 rounded-3xl shadow-sm p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#00A0E2]/10 text-[#00A0E2] flex items-center justify-center"><LockKeyhole className="w-6 h-6" /></div>
        <h1 className="mt-5 text-2xl font-black text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        {showLocalTestMode && <LocalTestModePanel />}
      </div>
    </div>
  );
}

function LocalTestModePanel() {
  const [dossiers, setDossiers] = useState<LocalTestDossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try { const rows = await loadLocalTestDossiers(); setDossiers(rows); if (rows.length === 0) setError('Aucun dossier test.'); } catch { setError('Erreur chargement.'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-[#00A0E2]/30 bg-[#00A0E2]/5 p-5 text-left">
      <div className="flex justify-between items-start"><div><span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#0077B6]">Mode test</span><h2 className="mt-3 text-base font-extrabold text-slate-900">Dossiers test disponibles</h2></div><button onClick={load} className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-bold"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />Actualiser</button></div>
      <div className="mt-4 space-y-2">
        {loading && <p className="text-xs text-slate-500 p-4 bg-white rounded-2xl text-center">Chargement...</p>}
        {!loading && error && <p className="text-xs text-amber-700 p-4 bg-amber-50 rounded-2xl">{error}</p>}
        {!loading && dossiers.map((d) => (
          <button key={d.id} onClick={() => { window.location.href = d.previewPath; }} className="w-full rounded-2xl border bg-white p-4 text-left hover:border-[#00A0E2]/40">
            <div className="flex justify-between items-center"><div><p className="text-sm font-extrabold">{d.title}</p><p className="text-xs text-slate-500">{d.clientName} · {d.propertyLabel}</p></div><LocalStatusPill label={d.estimationStatus === 'published' ? 'Publiée' : 'Brouillon'} tone={d.estimationStatus === 'published' ? 'green' : 'amber'} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LocalStatusPill({ label, tone }: { label: string; tone: 'green' | 'amber' | 'blue' | 'slate' }) {
  const c: Record<string, string> = { green: 'border-emerald-100 bg-emerald-50 text-emerald-700', amber: 'border-amber-100 bg-amber-50 text-amber-700', blue: 'border-[#00A0E2]/20 bg-[#00A0E2]/10 text-[#0077B6]', slate: 'border-slate-100 bg-slate-50 text-slate-500' };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase ${c[tone]}`}>{label}</span>;
}

function EmptyContentState({ title, description }: { title: string; description: string }) {
  return (
    <section className="w-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#00A0E2]"><Info className="h-6 w-6" /></div>
      <h2 className="mt-4 text-xl font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">{description}</p>
    </section>
  );
}

function SalesFollowUpTeaser() {
  const steps = [
    { icon: FolderOpen, title: 'Dossier vendeur', description: 'Documents et diagnostics centralisés.' },
    { icon: Compass, title: 'Méthode de commercialisation', description: 'Plan de vente et prochaines étapes.' },
    { icon: BarChart3, title: 'Pilotage après mise en vente', description: 'Visites, offres et performances.' },
  ];
  return (
    <section className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="relative p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,160,226,0.12),transparent_34%),linear-gradient(135deg,#fff,#f8fafc)]" />
        <div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-[#00A0E2]/20 bg-[#00A0E2]/10 px-3 py-1 text-xs font-bold text-[#0077B6]"><LockKeyhole className="h-3.5 w-3.5" />Disponible après signature</span><h2 className="mt-5 text-2xl font-extrabold text-slate-900">Suivi de vente à venir</h2><p className="mt-3 text-sm text-slate-600">Cet espace donne une vision claire de la commercialisation une fois le mandat signé.</p></div>
        <div className="relative mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s) => { const I = s.icon; return <article key={s.title} className="rounded-2xl border bg-white/85 p-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00A0E2]/10 text-[#0077B6]"><I className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-extrabold">{s.title}</h3><p className="mt-2 text-xs text-slate-500">{s.description}</p></article>; })}
        </div>
      </div>
    </section>
  );
}

function hasPropertyDetails(p: AppState['propertyDetails']) {
  return Boolean(p.address || p.description || p.surface > 0 || p.rooms > 0 || p.landSurface > 0 || p.bedrooms > 0 || p.year > 0);
}

function formatPropertyContext(ctx: AppState['propertyContext'], addr: string) {
  const v = [ctx.type, ctx.commune].map((x) => x?.trim()).filter(Boolean);
  return v.length > 0 ? v.join(' · ') : addr || 'Dossier immobilier';
}