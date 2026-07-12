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
  Share2,
  Calendar,
  Info,
  GitCompare,
  CheckSquare,
  FolderOpen,
  Users,
  Compass,
  Handshake,
  BarChart3,
  ChevronDown,
  LockKeyhole
} from 'lucide-react';

import { clearAppState, getMultiClientState, saveMultiClientState } from './lib/store';

import Navbar from './components/Navbar';
import CoverSection from './components/CoverSection';
import SituationSection from './components/SituationSection';
import PropertySection from './components/PropertySection';
import ComparablesSection from './components/ComparablesSection';
import ConclusionSection from './components/ConclusionSection';
import IadLogo from './components/IadLogo';

// Admin modules imports
import DocumentsSection from './components/DocumentsSection';
import VisitsSection from './components/VisitsSection';
import SalesPlanSection from './components/SalesPlanSection';
import OffersSection from './components/OffersSection';
import StatsSection from './components/StatsSection';
import { DocumentItem, ViewingReport, SalesStep, BuyerOffer, PortalStat, ClientRecord, AppState } from './types';
import { loadMandatOsPortalState, type RemotePortalStatus } from './lib/mandat-os-portal';

export default function App() {
  const [multiClientState, setMultiClientState] = useState(() => getMultiClientState());
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [remoteStatus, setRemoteStatus] = useState<RemotePortalStatus>('idle');

  const [lastEvalSection, setLastEvalSection] = useState<string>('situation');
  const [lastTransSection, setLastTransSection] = useState<string>('documents');

  // Derive current client and appState
  const currentClient = multiClientState.clients.find(c => c.id === multiClientState.currentClientId) || multiClientState.clients[0];
  const appState: AppState = {
    clientInfo: currentClient.clientInfo,
    advisorInfo: multiClientState.advisorInfo,
    estimationStatus: currentClient.estimationStatus,
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
    recommendedPriceRange: currentClient.recommendedPriceRange
  };

  // Custom setAppState to map state updates back into the multiClientState
  const setAppState = (updater: AppState | ((prev: AppState) => AppState)) => {
    setMultiClientState(prev => {
      const currentClient = prev.clients.find(c => c.id === prev.currentClientId) || prev.clients[0];
      const currentAppState: AppState = {
        clientInfo: currentClient.clientInfo,
        advisorInfo: prev.advisorInfo,
        estimationStatus: currentClient.estimationStatus,
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
        recommendedPriceRange: currentClient.recommendedPriceRange
      };

      const newState = typeof updater === 'function' ? updater(currentAppState) : updater;

      const updatedClients = prev.clients.map(c => {
        if (c.id === prev.currentClientId) {
          return {
            ...c,
            clientInfo: newState.clientInfo,
            estimationStatus: newState.estimationStatus,
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
          };
        }
        return c;
      });

      const nextMultiState = {
        ...prev,
        clients: updatedClients,
        advisorInfo: newState.advisorInfo
      };
      saveMultiClientState(nextMultiState);
      return nextMultiState;
    });
  };

  // Track and remember the last sub-sections within main divisions
  useEffect(() => {
    if (['estimationEmpty', 'situation', 'property', 'comparables', 'conclusion'].includes(activeSection)) {
      setLastEvalSection(activeSection);
    } else if (['documents', 'viewings', 'salesPlan', 'offers', 'stats'].includes(activeSection)) {
      setLastTransSection(activeSection);
    }
  }, [activeSection]);

  // Sync multiClientState changes with localStorage
  useEffect(() => {
    saveMultiClientState(multiClientState);
  }, [multiClientState]);

  // Hydrate the standalone portal from Mandat OS / Supabase when a client
  // session exists. Without Supabase envs or auth, the local demo remains active.
  useEffect(() => {
    let cancelled = false;

    const hydrateFromMandatOs = async () => {
      setRemoteStatus('loading');
      try {
        const result = await loadMandatOsPortalState();
        if (cancelled) return;
        if (result.state) setMultiClientState(result.state);
        setRemoteStatus(result.status);
      } catch (error) {
        console.error('[Mandat OS portal bridge]', error);
        if (!cancelled) setRemoteStatus('error');
      }
    };

    hydrateFromMandatOs();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle client selection
  const handleSelectClient = (clientId: string) => {
    setMultiClientState(prev => {
      const nextState = { ...prev, currentClientId: clientId };
      saveMultiClientState(nextState);
      return nextState;
    });
    setActiveSection('cover'); // Return to home page on client switch
  };

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPresentation = () => {
    setActiveSection(appState.estimationStatus === 'published' ? 'situation' : 'estimationEmpty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Documents mutations
  const handleAddDocument = (newDoc: Omit<DocumentItem, 'id'>) => {
    const doc: DocumentItem = {
      ...newDoc,
      id: `doc-${Date.now()}`
    };
    setAppState(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
  };

  const handleDeleteDocument = (id: string) => {
    setAppState(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  // 2. Viewings mutations
  const handleAddViewing = (newViewing: Omit<ViewingReport, 'id'>) => {
    const viewing: ViewingReport = {
      ...newViewing,
      id: `view-${Date.now()}`
    };
    setAppState(prev => ({
      ...prev,
      viewings: [...prev.viewings, viewing]
    }));
  };

  const handleDeleteViewing = (id: string) => {
    setAppState(prev => ({
      ...prev,
      viewings: prev.viewings.filter(v => v.id !== id)
    }));
  };

  // 3. Sales steps mutations
  const handleUpdateStepStatus = (id: string, status: SalesStep['status']) => {
    setAppState(prev => {
      const steps = prev.salesSteps.map(step => {
        if (step.id === id) {
          return {
            ...step,
            status,
            completedDate: status === 'Terminé' 
              ? new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
              : undefined
          };
        }
        return step;
      });
      return { ...prev, salesSteps: steps };
    });
  };

  // 4. Offers mutations
  const handleAddOffer = (newOffer: Omit<BuyerOffer, 'id'>) => {
    const offer: BuyerOffer = {
      ...newOffer,
      id: `offer-${Date.now()}`
    };
    setAppState(prev => ({
      ...prev,
      offers: [...prev.offers, offer]
    }));
  };

  const handleDeleteOffer = (id: string) => {
    setAppState(prev => ({
      ...prev,
      offers: prev.offers.filter(o => o.id !== id)
    }));
  };

  const handleUpdateOfferStatus = (id: string, status: BuyerOffer['status']) => {
    setAppState(prev => {
      const offers = prev.offers.map(off => {
        if (off.id === id) {
          return { ...off, status };
        }
        return off;
      });
      return { ...prev, offers };
    });
  };

  const handleResetToDefaults = () => {
    clearAppState();
    window.location.reload();
  };

  const isEstimationPublished = appState.estimationStatus === 'published';
  const isEvaluation = ['estimationEmpty', 'situation', 'property', 'comparables', 'conclusion'].includes(activeSection);
  const isTransaction = ['documents', 'viewings', 'salesPlan', 'offers', 'stats'].includes(activeSection);
  const shouldBlockForAccess = ['unauthenticated', 'empty', 'error'].includes(remoteStatus);

  if (remoteStatus === 'loading') {
    return <AccessState title="Chargement de votre espace" description="Nous préparons votre dossier client sécurisé." />;
  }

  if (shouldBlockForAccess) {
    return (
      <AccessState
        title="Accès client requis"
        description="Connectez-vous depuis le lien sécurisé transmis par votre conseiller pour consulter ce portail."
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" id="app-root-layout">
      
      {/* 1. Desktop Sidebar Navigation */}
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={(sec) => {
          setActiveSection(sec);
          scrollToTop();
        }} 
        advisor={appState.advisorInfo}
        lastEvalSection={isEstimationPublished ? lastEvalSection : 'estimationEmpty'}
        lastTransSection={lastTransSection}
      />

      {/* 2. Main Content Window */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0" id="main-content-window">
        
        {/* Top Sticky Header */}
        <header 
          className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-20 px-6 py-4.5 flex items-center justify-between"
          id="sticky-app-header"
        >
          {/* Mobile hamburger menu toggle */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-800 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Quick context info */}
          <div className="flex items-center gap-3 min-w-0" id="header-context">
            <div className="lg:hidden shrink-0">
              <IadLogo className="h-8" showText={false} />
            </div>
            <div className="min-w-0 flex items-center gap-2.5" id="header-context-labels">
              <div className="relative shrink-0">
                <select 
                  id="header-client-select"
                  value={multiClientState.currentClientId}
                  onChange={(e) => handleSelectClient(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-bold pl-3.5 pr-8 py-2 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20"
                >
                  {multiClientState.clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.clientInfo.names}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="hidden sm:block h-5 w-px bg-slate-200" />

              {remoteStatus === 'synced' && (
                <span className="hidden md:inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Mandat OS synchronisé
                </span>
              )}

              {remoteStatus === 'error' && (
                <span className="hidden md:inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                  Synchronisation indisponible
                </span>
              )}

              <div className="min-w-0 hidden sm:block">
                <p className="text-[11px] text-slate-400 font-semibold truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-300" />
                  <span>{appState.clientInfo.address}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Share / PDF Quick Action button group */}
          <div className="flex items-center gap-2" id="header-actions">
            <button 
              id="btn-print-report"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Imprimer le PDF</span>
            </button>
            <a 
              href={`tel:${appState.advisorInfo.phone.replace(/\s/g, '')}`}
              id="header-phone-call"
              className="flex items-center justify-center p-2.5 bg-[#00A0E2] text-white rounded-xl hover:bg-[#008cc7] transition-all"
              title={`Appeler ${appState.advisorInfo.name}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* Floating Mobile Sidebar Drawer Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div id="mobile-sidebar-container">
              {/* Overlay Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950 z-30 lg:hidden"
              />

              {/* Slide Drawer */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white p-6 z-40 lg:hidden flex flex-col gap-6"
              >
                <div className="flex justify-between items-center" id="mobile-drawer-header">
                  <IadLogo className="h-10 self-start" color="#00A0E2" showText={true} />
                  <button 
                    id="btn-close-mobile-drawer"
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="h-px bg-slate-800" />

                {/* Mobile menu nav list */}
                <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto" id="mobile-drawer-nav">
                  {[
                    { id: 'cover', label: 'Accueil', target: 'cover', active: activeSection === 'cover' },
                    { id: 'evaluation', label: 'Estimation', target: isEstimationPublished ? lastEvalSection : 'estimationEmpty', active: isEvaluation },
                    { id: 'transaction', label: 'Suivi de Vente', target: lastTransSection, active: isTransaction }
                  ].map((item) => (
                    <button
                      key={item.id}
                      id={`mobile-nav-item-${item.id}`}
                      onClick={() => {
                        setActiveSection(item.target);
                        setIsMobileMenuOpen(false);
                        scrollToTop();
                      }}
                      className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        item.active 
                          ? 'bg-[#00A0E2] text-white shadow' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </button>
                  ))}
                </nav>

                {/* Mobile Drawer Footer advisor signature */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex items-center gap-3" id="mobile-drawer-advisor">
                  <img 
                    src={appState.advisorInfo.avatar} 
                    alt={appState.advisorInfo.name} 
                    className="w-9 h-9 rounded-full object-cover border border-[#00A0E2]/30 referrerPolicy='no-referrer'"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{appState.advisorInfo.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{appState.advisorInfo.title}</p>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Section Renderer Container */}
        <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6" id="main-content-container">

          {/* Division sub-tabs bar */}
          {activeSection !== 'cover' && (
            <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none snap-x snap-mandatory shadow-sm" id="main-subtabs-bar">
              {(() => {
                if (isEvaluation) {
                  if (!isEstimationPublished) {
                    return [
                      { id: 'estimationEmpty', label: 'Estimation en préparation', icon: Info },
                    ];
                  }
                  return [
                    { id: 'situation', label: 'Situation & Cadastre', icon: MapPin },
                    { id: 'property', label: 'Fiche du Bien', icon: Info },
                    { id: 'comparables', label: 'Comparables', icon: GitCompare },
                    { id: 'conclusion', label: 'Recommandations', icon: CheckSquare },
                  ];
                } else if (isTransaction) {
                  return [
                    { id: 'documents', label: 'Dossier Vendeur', icon: FolderOpen, badge: appState.documents.length },
                    { id: 'viewings', label: 'Suivi des Visites', icon: Users, badge: appState.viewings.length },
                    { id: 'salesPlan', label: 'Plan de Vente', icon: Compass },
                    { id: 'offers', label: "Offres d'Achat", icon: Handshake, badge: appState.offers.filter(o => o.status === 'Reçue').length || undefined },
                    { id: 'stats', label: 'Performance Web', icon: BarChart3 },
                  ];
                }
                return [];
              })().map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`subtab-btn-${tab.id}`}
                    onClick={() => {
                      setActiveSection(tab.id);
                      scrollToTop();
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 snap-start ${
                      isActive 
                        ? 'text-slate-800' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeSubTabIndicator" 
                        className="absolute inset-0 bg-slate-100 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00A0E2]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold transition-colors ${isActive ? 'bg-[#00A0E2]/15 text-[#00A0E2]' : 'bg-slate-100 text-slate-600'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full flex flex-col"
              id={`section-container-${activeSection}`}
            >
              {activeSection === 'cover' && (
                <CoverSection 
                  client={appState.clientInfo} 
                  advisor={appState.advisorInfo} 
                  propertyDetails={appState.propertyDetails}
                  estimationStatus={appState.estimationStatus}
                  onStart={handleStartPresentation} 
                />
              )}
              {activeSection === 'estimationEmpty' && (
                <EmptyContentState
                  title="Estimation en préparation"
                  description="Votre conseiller prépare l’avis de valeur. Dès qu’il sera publié depuis Mandat OS, il apparaîtra ici sans donnée générique."
                />
              )}
              {activeSection === 'situation' && (
                appState.cadastralParcels && appState.cadastralParcels.length > 0 ? (
                  <SituationSection 
                    cadastralParcels={appState.cadastralParcels}
                    clientAddress={appState.clientInfo.address}
                  />
                ) : (
                  <EmptyContentState title="Situation en préparation" description="Les informations cadastrales seront visibles dès publication du rapport." />
                )
              )}
              {activeSection === 'property' && (
                hasPropertyDetails(appState.propertyDetails) ? (
                  <PropertySection 
                    propertyDetails={appState.propertyDetails}
                    pointsForts={appState.pointsForts}
                    pointsDefendre={appState.pointsDefendre}
                  />
                ) : (
                  <EmptyContentState title="Fiche bien en préparation" description="Les caractéristiques détaillées seront visibles après publication." />
                )
              )}
              {activeSection === 'comparables' && (
                appState.soldComparables && appState.soldComparables.length > 0 ? (
                  <ComparablesSection 
                    soldComparables={appState.soldComparables}
                    propertyDetails={appState.propertyDetails}
                    referencePrice={appState.marketPriceRanges?.currentReferencePrice}
                  />
                ) : (
                  <EmptyContentState title="Comparables en préparation" description="Aucun comparable publié pour le moment." />
                )
              )}
              {activeSection === 'conclusion' && (
                appState.recommendedPriceRange ? (
                  <ConclusionSection 
                    clientInfo={appState.clientInfo}
                    advisorInfo={appState.advisorInfo}
                    recommendedPriceRange={appState.recommendedPriceRange}
                    propertySize={appState.propertyDetails.surface}
                  />
                ) : (
                  <EmptyContentState title="Recommandations en préparation" description="Les recommandations seront visibles après publication de l’avis de valeur." />
                )
              )}
              
              {/* Follow-up Interactive sections */}
              {activeSection === 'documents' && (
                <DocumentsSection 
                  documents={appState.documents}
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                  readOnly
                />
              )}
              {activeSection === 'viewings' && (
                <VisitsSection 
                  viewings={appState.viewings}
                  onAddViewing={handleAddViewing}
                  onDeleteViewing={handleDeleteViewing}
                  readOnly
                />
              )}
              {activeSection === 'salesPlan' && (
                <SalesPlanSection 
                  salesSteps={appState.salesSteps}
                  onUpdateStepStatus={handleUpdateStepStatus}
                  readOnly
                />
              )}
              {activeSection === 'offers' && (
                <OffersSection 
                  offers={appState.offers}
                  onAddOffer={handleAddOffer}
                  onDeleteOffer={handleDeleteOffer}
                  onUpdateOfferStatus={handleUpdateOfferStatus}
                  readOnly
                />
              )}
              {activeSection === 'stats' && (
                <StatsSection 
                  portalStats={appState.portalStats}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* App footer branding (Clean minimal margins) */}
        <footer className="mt-auto py-6 px-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px] text-slate-400 font-medium" id="app-footer">
          <div className="flex items-center gap-2" id="footer-branding-row">
            <IadLogo className="h-6" showText={false} />
            <span>© 2026 iad France - Document d'accompagnement et suivi de dossier à caractère indicatif.</span>
          </div>
          <div className="flex items-center gap-4" id="footer-links">
            <a href="https://www.iadfrance.fr" target="_blank" rel="noreferrer" className="hover:text-[#00A0E2] transition-colors">iadfrance.fr</a>
            <span>•</span>
            <span>Réseau de mandataires immobiliers</span>
          </div>
        </footer>

        {/* Back to top scroll button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              id="btn-scroll-top"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 p-3.5 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-slate-800 transition-all z-20"
              title="Retour en haut"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function AccessState({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6" id="portal-access-state">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl shadow-sm p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#00A0E2]/10 text-[#00A0E2] flex items-center justify-center">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function EmptyContentState({ title, description }: { title: string; description: string }) {
  return (
    <section className="w-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#00A0E2]">
        <Info className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">{description}</p>
    </section>
  );
}

function hasPropertyDetails(property: AppState['propertyDetails']) {
  return Boolean(
    property.address ||
    property.description ||
    property.surface > 0 ||
    property.rooms > 0 ||
    property.landSurface > 0 ||
    property.bedrooms > 0 ||
    property.year > 0
  );
}
