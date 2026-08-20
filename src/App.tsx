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
import ActionPlanSection from './components/ActionPlanSection';
import WhyMeSection from './components/WhyMeSection';
import IadLogo from './components/IadLogo';

import DocumentsSection from './components/DocumentsSection';
import VisitsSection from './components/VisitsSection';
import SalesPlanSection from './components/SalesPlanSection';
import MandateActionsSection from './components/MandateActionsSection';
import OffersSection from './components/OffersSection';
import StatsSection from './components/StatsSection';
import { DocumentItem, ViewingReport, SalesStep, BuyerOffer, PortalStat, ClientRecord, AppState } from './types';
import { loadLocalTestDossiers, loadMandatOsPortalState, type LocalTestDossier, type RemotePortalStatus } from './lib/mandat-os-portal';

const EVAL_SECTIONS = ['estimationEmpty', 'situation', 'property', 'market', 'competition', 'comparables', 'conclusion'];
const TRANS_SECTIONS = ['transactionTeaser', 'documents', 'viewings', 'salesPlan', 'offers', 'stats'];

export default function App() {
  const [multiClientState, setMultiClientState] = useState(() => getMultiClientState());
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [remoteStatus, setRemoteStatus] = useState<RemotePortalStatus>('idle');
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [urlKey, setUrlKey] = useState<string>(`${window.location.pathname}${window.location.search}`);

  const [lastEvalSection, setLastEvalSection] = useState<string>('situation');
  const [lastTransSection, setLastTransSection] = useState<string>('documents');

  const currentClient = multiClientState.clients.find((c: ClientRecord) => c.id === multiClientState.currentClientId) || multiClientState.clients[0];
  const appState: AppState = {
    clientInfo: currentClient.clientInfo,
    advisorInfo: multiClientState.advisorInfo,
    estimationStatus: currentClient.estimationStatus,
    salesFollowUpStatus: currentClient.salesFollowUpStatus,
    mandateStage: currentClient.mandateStage,
    mandateSignedAt: currentClient.mandateSignedAt,
    propertyContext: currentClient.propertyContext,
    propertyDetails: currentClient.propertyDetails,
    pointsForts: currentClient.pointsForts,
    pointsDefendre: currentClient.pointsDefendre,
    documents: currentClient.documents,
    viewings: currentClient.viewings,
    salesSteps: currentClient.salesSteps,
    mandateActions: currentClient.mandateActions,
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
        mandateStage: cc.mandateStage,
        mandateSignedAt: cc.mandateSignedAt,
        propertyContext: cc.propertyContext,
        propertyDetails: cc.propertyDetails,
        pointsForts: cc.pointsForts,
        pointsDefendre: cc.pointsDefendre,
        documents: cc.documents,
        viewings: cc.viewings,
        salesSteps: cc.salesSteps,
        mandateActions: cc.mandateActions,
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
            mandateStage: newState.mandateStage,
            mandateSignedAt: newState.mandateSignedAt,
            propertyContext: newState.propertyContext,
            propertyDetails: newState.propertyDetails,
            pointsForts: newState.pointsForts,
            pointsDefendre: newState.pointsDefendre,
            documents: newState.documents,
            viewings: newState.viewings,
            salesSteps: newState.salesSteps,
            mandateActions: newState.mandateActions,
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
    const handlePopState = () => setUrlKey(`${window.location.pathname}${window.location.search}`);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  }, [urlKey]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleStartPresentation = () => {
    if (isSalesFollowUpActive) {
      setActiveSection('documents');
    } else {
      setActiveSection(appState.estimationStatus === 'published' ? 'situation' : 'estimationEmpty');
    }
    scrollToTop();
  };

  const handleAddDocument = (newDoc: Omit<DocumentItem, 'id'>) => {
    setAppState((prev) => {
      const existingIdx = prev.documents.findIndex(
        (d) => d.name.trim().toLowerCase() === newDoc.name.trim().toLowerCase()
      );
      if (existingIdx !== -1) {
        const updated = [...prev.documents];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...newDoc,
          id: updated[existingIdx].id,
          status: 'À valider',
          uploadedBy: 'Vendeur',
          dateAdded: newDoc.dateAdded || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        };
        return { ...prev, documents: updated };
      }
      const doc: DocumentItem = {
        ...newDoc,
        id: `doc-${Date.now()}`,
        dateAdded: newDoc.dateAdded || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      };
      return { ...prev, documents: [doc, ...prev.documents] };
    });
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
      <Navbar activeSection={activeSection} setActiveSection={(sec: string) => { setActiveSection(sec); scrollToTop(); }} advisor={appState.advisorInfo} isSalesFollowUpActive={isSalesFollowUpActive} lastEvalSection={isEstimationPublished ? lastEvalSection : 'estimationEmpty'} lastTransSection={isSalesFollowUpActive ? lastTransSection : 'actionPlan'} />

      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-20 px-4 sm:px-6 h-14 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="lg:hidden shrink-0"><IadLogo className="h-7" showText={false} /></div>
            <div className="min-w-0 flex flex-col">
              <p className="truncate text-sm font-bold text-slate-900">{appState.clientInfo.names || 'Dossier client'}</p>
              <p className="flex items-center gap-1 truncate text-[11px] font-medium text-slate-500">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{formatPropertyContext(appState.propertyContext, appState.clientInfo.address)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <div className="hidden sm:block relative">
              <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors">
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Télécharger</span>
              </button>
              {showDownloadMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[160px] py-1">
                  <button onClick={() => { window.print(); setShowDownloadMenu(false); }} className="block w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    Valeur du bien
                  </button>
                  {isSalesFollowUpActive && (
                    <button onClick={() => { window.print(); setShowDownloadMenu(false); }} className="block w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Mandat signé
                    </button>
                  )}
                </div>
              )}
            </div>
            <a href={`tel:${appState.advisorInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00A0E2] hover:bg-[#008ec9] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Conseiller</span>
            </a>
          </div>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-950 z-30 lg:hidden" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 w-72 bg-slate-950 text-slate-100 p-6 z-40 lg:hidden flex flex-col gap-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                  <IadLogo className="h-9" color="#FFFFFF" showText={true} />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
                  {[
                    { id: 'cover', label: 'Accueil', target: 'cover', active: activeSection === 'cover' },
                    { id: 'evaluation', label: 'Estimation', target: isEstimationPublished ? lastEvalSection : 'estimationEmpty', active: isEvaluation },
                    isSalesFollowUpActive
                      ? { id: 'transaction', label: 'Suivi de Vente', target: lastTransSection, active: isTransaction }
                      : { id: 'actionPlan', label: 'Plan d\'action', target: 'actionPlan', active: activeSection === 'actionPlan' || activeSection === 'transactionTeaser' },
                    { id: 'whyMe', label: 'Pourquoi me choisir ?', target: 'whyMe', active: activeSection === 'whyMe' },
                  ].map((item) => (
                    <button key={item.id} onClick={() => { setActiveSection(item.target); setIsMobileMenuOpen(false); scrollToTop(); }} className={`w-full flex items-center justify-between text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-colors ${item.active ? 'bg-[#00A0E2]/15 text-white border border-[#00A0E2]/40' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                      <span>{item.label}</span><ChevronRight className="w-4 h-4 opacity-60 text-[#00A0E2]" />
                    </button>
                  ))}
                </nav>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img src={appState.advisorInfo.avatar} alt={appState.advisorInfo.name} className="w-9 h-9 rounded-full object-cover border border-[#00A0E2]/30" />
                    <div className="min-w-0"><h4 className="text-xs font-bold text-white truncate">{appState.advisorInfo.name}</h4><p className="text-[10px] text-slate-400 truncate">{appState.advisorInfo.title}</p></div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
          {activeSection !== 'cover' && !(activeSection === 'estimationEmpty' && !isEstimationPublished) && !(isTransaction && !isSalesFollowUpActive) && (
            <div className="w-full border border-slate-200/80 bg-white p-1.5 shadow-xs rounded-2xl gap-1.5 overflow-x-auto flex items-center scrollbar-none" id="section-menubar">
              {(() => {
                if (isEvaluation) {
                  if (!isEstimationPublished) return [{ id: 'estimationEmpty', label: 'En préparation', icon: Info }];
                  return [
                    { id: 'situation', label: 'Situation', icon: MapPin },
                    { id: 'property', label: 'Fiche bien', icon: Info },
                    { id: 'market', label: 'Marché', icon: TrendingUp },
                    { id: 'competition', label: 'Concurrence', icon: Target },
                    { id: 'comparables', label: 'Comparables', icon: GitCompare, count: (appState.soldComparables?.length || appState.competingProperties?.length) ? `${(appState.soldComparables?.length || 0) + (appState.competingProperties?.length || 0)}` : undefined },
                    { id: 'conclusion', label: 'Valeur du bien', icon: CheckSquare },
                  ];
                }
                if (isTransaction) return [
                  { id: 'documents', label: 'Documents', icon: FolderOpen, count: `${appState.documents.filter(d => d.status === 'Valide').length}/${appState.documents.length}` },
                  { id: 'viewings', label: 'Visites', icon: UsersIcon, count: appState.viewings.length },
                  { id: 'salesPlan', label: 'Plan de vente', icon: Compass, count: appState.salesSteps.length },
                  { id: 'offers', label: 'Offres', icon: Handshake, count: appState.offers.length },
                  { id: 'stats', label: 'Diffusion & stats', icon: BarChart3 },
                ];
                return [];
              })().map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`menubar-item-${tab.id}`}
                    onClick={() => { setActiveSection(tab.id); scrollToTop(); }}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-max ${
                      isActive
                        ? 'bg-[#00A0E2] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }} className="w-full flex flex-col">
              {activeSection === 'cover' && <CoverSection client={appState.clientInfo} advisor={appState.advisorInfo} propertyDetails={appState.propertyDetails} estimationStatus={appState.estimationStatus} mandateStage={appState.mandateStage} mandateSignedAt={appState.mandateSignedAt} onStart={handleStartPresentation} />}
              {activeSection === 'estimationEmpty' && <EmptyContentState title="Estimation en préparation" description="Votre estimation sera visible ici dès sa publication." />}
              {activeSection === 'situation' && (appState.cadastralParcels?.length ? <SituationSection cadastralParcels={appState.cadastralParcels} clientAddress={appState.clientInfo.address} propertyDetails={appState.propertyDetails} /> : <EmptyContentState title="Situation en préparation" description="Données cadastrales à venir." />)}
              {activeSection === 'property' && (hasPropertyDetails(appState.propertyDetails) ? <PropertySection propertyDetails={appState.propertyDetails} pointsForts={appState.pointsForts} pointsDefendre={appState.pointsDefendre} /> : <EmptyContentState title="Fiche bien en préparation" description="Caractéristiques à venir." />)}
              {activeSection === 'market' && <MarketSection socioEconomicData={appState.socioEconomicData} marketDistribution={appState.marketDistribution} marketTrend={appState.marketTrend} marketTension={appState.marketTension} />}
              {activeSection === 'competition' && <CompetitionSection positioningData={appState.positioningData} synthesisData={appState.synthesisData} />}
              {activeSection === 'comparables' && <ComparablesSection soldComparables={appState.soldComparables} competingProperties={appState.competingProperties} unsoldProperties={appState.unsoldProperties} propertyDetails={appState.propertyDetails} referencePrice={appState.marketPriceRanges?.currentReferencePrice} />}
              {activeSection === 'conclusion' && (appState.recommendedPriceRange ? <ConclusionSection clientInfo={appState.clientInfo} advisorInfo={appState.advisorInfo} recommendedPriceRange={appState.recommendedPriceRange} propertySize={appState.propertyDetails.surface} onGoToActionPlan={() => { setActiveSection(isSalesFollowUpActive ? 'salesPlan' : 'actionPlan'); scrollToTop(); }} /> : <EmptyContentState title="Recommandations en préparation" description="Valeur du bien à venir." />)}
              
              {/* Onglet Plan d'action (quand le mandat n'est pas encore signé) */}
              {(activeSection === 'actionPlan' || (activeSection === 'transactionTeaser' && !isSalesFollowUpActive)) && (
                <ActionPlanSection advisor={appState.advisorInfo} client={appState.clientInfo} recommendedPriceRange={appState.recommendedPriceRange} onStartFollowUp={() => { setActiveSection('salesPlan'); scrollToTop(); }} />
              )}

              {activeSection === 'whyMe' && <WhyMeSection advisor={appState.advisorInfo} client={appState.clientInfo} iadTrackRecord={appState.iadTrackRecord} />}

              {/* Sections Suivi de Vente (quand le mandat est activé) */}
              {activeSection === 'documents' && (isSalesFollowUpActive ? <DocumentsSection documents={appState.documents} onAddDocument={handleAddDocument} /> : <ActionPlanSection advisor={appState.advisorInfo} client={appState.clientInfo} recommendedPriceRange={appState.recommendedPriceRange} />)}
              {activeSection === 'viewings' && (isSalesFollowUpActive ? <VisitsSection viewings={appState.viewings} onAddViewing={handleAddViewing} onDeleteViewing={handleDeleteViewing} readOnly /> : <ActionPlanSection advisor={appState.advisorInfo} client={appState.clientInfo} recommendedPriceRange={appState.recommendedPriceRange} />)}
              {activeSection === 'salesPlan' && (isSalesFollowUpActive ? (
                <div className="flex flex-col gap-6">
                  <SalesPlanSection salesSteps={appState.salesSteps} onUpdateStepStatus={handleUpdateStepStatus} readOnly />
                  {/* Les actions vivent en parallele du fil de la vente, jamais dedans. */}
                  <MandateActionsSection actions={appState.mandateActions} />
                </div>
              ) : <ActionPlanSection advisor={appState.advisorInfo} client={appState.clientInfo} recommendedPriceRange={appState.recommendedPriceRange} />)}
              {activeSection === 'offers' && (isSalesFollowUpActive ? <OffersSection offers={appState.offers} onAddOffer={handleAddOffer} onDeleteOffer={handleDeleteOffer} onUpdateOfferStatus={handleUpdateOfferStatus} readOnly /> : <ActionPlanSection advisor={appState.advisorInfo} client={appState.clientInfo} recommendedPriceRange={appState.recommendedPriceRange} />)}
              {activeSection === 'stats' && (isSalesFollowUpActive ? <StatsSection portalStats={appState.portalStats} /> : <ActionPlanSection advisor={appState.advisorInfo} client={appState.clientInfo} recommendedPriceRange={appState.recommendedPriceRange} />)}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-auto py-6 px-8 border-t border-slate-100 bg-white flex items-center justify-center text-[11px] text-slate-400 font-medium">
          <span>© Logiciel conçu par Alexandre Lopez</span>
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
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { number: 1, icon: FolderOpen, title: '1. Dossier vendeur', phase: 'Préparation', description: 'Centralisation de vos pièces administratives, titres de propriété, diagnostics techniques et documents légaux.' },
    { number: 2, icon: Compass, title: '2. Commercialisation', phase: 'Lancement', description: 'Élaboration du plan de vente personnalisé, shooting photo professionnel et diffusion ciblée sur les portails majeurs.' },
    { number: 3, icon: BarChart3, title: '3. Pilotage & Offres', phase: 'Suivi actif', description: 'Compte-rendu détaillé des visites en temps réel, analyse des propositions d’achat et accompagnement jusqu’au notaire.' },
  ];
  const currentStep = steps[activeStep];
  const CurrentIcon = currentStep.icon;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden" id="sales-teaser-root">
      <div className="relative p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,160,226,0.12),transparent_34%),linear-gradient(135deg,#fff,#f8fafc)] pointer-events-none" />
        
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00A0E2]/20 bg-[#00A0E2]/10 px-3 py-1 text-xs font-bold text-[#0077B6]">
            <LockKeyhole className="h-3.5 w-3.5" />
            Disponible après signature du mandat
          </span>
          <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">Fil conducteur du suivi de vente</h2>
          <p className="mt-2 text-sm text-slate-600">Découvrez l'avancement pas-à-pas de la commercialisation une fois votre mandat de vente activé.</p>
        </div>

        {/* Interactive Stepper Track */}
        <div className="relative mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-6 overflow-x-auto">
          <div className="relative min-w-max px-6 py-2">
            {/* Track line */}
            <div className="absolute left-10 right-10 top-7 h-1 bg-slate-200 rounded-full z-0" />
            <div 
              className="absolute left-10 h-1 bg-gradient-to-r from-[#00A0E2] to-cyan-500 rounded-full z-0 transition-all duration-500"
              style={{ width: `calc(${(activeStep / (steps.length - 1)) * 100}% * (100% - 80px) / 100)` }}
            />

            <div className="flex items-center justify-between gap-12 relative z-10">
              {steps.map((s, idx) => {
                const IconComp = s.icon;
                const isActive = idx === activeStep;
                const isPassed = idx < activeStep;

                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center gap-2 text-center group cursor-pointer focus:outline-none min-w-32"
                  >
                    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#00A0E2] border-[#00A0E2] text-white ring-4 ring-[#00A0E2]/25 scale-110 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white border-slate-200 text-slate-400 group-hover:border-[#00A0E2]/60 group-hover:text-slate-700'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-bold transition-colors ${isActive ? 'text-[#00A0E2]' : 'text-slate-700'}`}>
                        {s.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{s.phase}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Preview Panel */}
          <div className="mt-6 bg-white border border-slate-200/70 rounded-xl p-5 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#00A0E2]">
              <CurrentIcon className="w-4 h-4" />
              <span>Phase {currentStep.number} — {currentStep.phase}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              {currentStep.description}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}


function hasPropertyDetails(p: AppState['propertyDetails']) {
  return Boolean(p.address || p.description || p.surface > 0 || p.rooms > 0 || p.landSurface > 0 || p.bedrooms > 0 || p.year > 0);
}

function formatPropertyContext(ctx: AppState['propertyContext'], addr: string) {
  const type = ctx.type?.trim() ? ctx.type.trim().charAt(0).toUpperCase() + ctx.type.trim().slice(1) : '';
  const v = [type, ctx.commune?.trim()].filter(Boolean);
  return v.length > 0 ? v.join(' · ') : addr || 'Dossier immobilier';
}