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
  TrendingUp,
  GitCompare,
  Sliders,
  CheckSquare,
  Star,
  FolderOpen,
  Users,
  Compass,
  Handshake,
  BarChart3,
  ChevronDown,
  User,
  Sparkles,
  Settings
} from 'lucide-react';

import { 
  getInitialState, 
  saveAppState, 
  clearAppState,
  defaultDocuments,
  defaultViewings,
  defaultSalesSteps,
  defaultOffers,
  defaultPortalStats,
  getMultiClientState,
  saveMultiClientState
} from './lib/store';

import Navbar from './components/Navbar';
import CoverSection from './components/CoverSection';
import SituationSection from './components/SituationSection';
import PropertySection from './components/PropertySection';
import MarketSection from './components/MarketSection';
import ComparablesSection from './components/ComparablesSection';
import PositioningSection from './components/PositioningSection';
import ConclusionSection from './components/ConclusionSection';
import ServicesSection from './components/ServicesSection';
import IadLogo from './components/IadLogo';

// Admin modules imports
import DocumentsSection from './components/DocumentsSection';
import VisitsSection from './components/VisitsSection';
import SalesPlanSection from './components/SalesPlanSection';
import OffersSection from './components/OffersSection';
import StatsSection from './components/StatsSection';
import AdminPortal from './components/AdminPortal';
import { DocumentItem, ViewingReport, SalesStep, BuyerOffer, PortalStat, ClientRecord, AppState } from './types';

export default function App() {
  const [multiClientState, setMultiClientState] = useState(() => getMultiClientState());
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const [lastEvalSection, setLastEvalSection] = useState<string>('situation');
  const [lastTransSection, setLastTransSection] = useState<string>('documents');
  const [lastAdminSection, setLastAdminSection] = useState<string>('admin-clients');

  // Derive current client and appState
  const currentClient = multiClientState.clients.find(c => c.id === multiClientState.currentClientId) || multiClientState.clients[0];
  const appState: AppState = {
    clientInfo: currentClient.clientInfo,
    advisorInfo: multiClientState.advisorInfo,
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

  // Custom setAppState to map state updates back into the multiClientState
  const setAppState = (updater: AppState | ((prev: AppState) => AppState)) => {
    setMultiClientState(prev => {
      const currentClient = prev.clients.find(c => c.id === prev.currentClientId) || prev.clients[0];
      const currentAppState: AppState = {
        clientInfo: currentClient.clientInfo,
        advisorInfo: prev.advisorInfo,
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

      const newState = typeof updater === 'function' ? updater(currentAppState) : updater;

      const updatedClients = prev.clients.map(c => {
        if (c.id === prev.currentClientId) {
          return {
            ...c,
            clientInfo: newState.clientInfo,
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
    if (['situation', 'property', 'market', 'comparables', 'positioning', 'conclusion', 'services'].includes(activeSection)) {
      setLastEvalSection(activeSection);
    } else if (['documents', 'viewings', 'salesPlan', 'offers', 'stats'].includes(activeSection)) {
      setLastTransSection(activeSection);
    } else if (['admin-clients', 'admin-profile', 'admin-property', 'admin-points', 'admin-stats'].includes(activeSection)) {
      setLastAdminSection(activeSection);
    }
  }, [activeSection]);

  // Sync multiClientState changes with localStorage
  useEffect(() => {
    saveMultiClientState(multiClientState);
  }, [multiClientState]);

  // Handle client selection, adding, and deleting
  const handleSelectClient = (clientId: string) => {
    setMultiClientState(prev => {
      const nextState = { ...prev, currentClientId: clientId };
      saveMultiClientState(nextState);
      return nextState;
    });
    setActiveSection('cover'); // Return to home page on client switch
  };

  const handleAddClient = (names: string, address: string) => {
    const newId = `client-${Date.now()}`;
    const newClient: ClientRecord = {
      id: newId,
      clientInfo: {
        names,
        address,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        projectTitle: "Dossier de commercialisation & Suivi de vente"
      },
      propertyDetails: {
        surface: 100,
        rooms: 4,
        floors: 1,
        landSurface: 200,
        bedrooms: 3,
        year: 2000,
        address,
        description: "Description de votre nouveau bien immobilier..."
      },
      pointsForts: [],
      pointsDefendre: [],
      documents: [],
      viewings: [],
      salesSteps: defaultSalesSteps.map(step => ({ ...step, status: 'A faire' })),
      offers: [],
      portalStats: defaultPortalStats.map(portal => ({
        ...portal,
        views: 0,
        detailedViews: 0,
        contacts: 0,
        phoneClicks: 0,
        performanceIndex: 0,
        history: []
      })),
      cadastralParcels: [
        { section: "D", prefixe: "000", numero: "123", superficie: 200 }
      ],
      marketPriceRanges: {
        low: 2500,
        median: 3500,
        high: 4500,
        currentReferencePrice: 350000,
        currentReferencePricePerSqm: 3500
      },
      soldComparables: [],
      recommendedPriceRange: { low: 340000, high: 360000 }
    };

    setMultiClientState(prev => {
      const nextState = {
        ...prev,
        clients: [...prev.clients, newClient],
        currentClientId: newId
      };
      saveMultiClientState(nextState);
      return nextState;
    });
    setActiveSection('cover');
  };

  const handleDeleteClient = (clientId: string) => {
    setMultiClientState(prev => {
      if (prev.clients.length <= 1) return prev;
      const remainingClients = prev.clients.filter(c => c.id !== clientId);
      const nextId = prev.currentClientId === clientId ? remainingClients[0].id : prev.currentClientId;
      const nextState = {
        ...prev,
        clients: remainingClients,
        currentClientId: nextId
      };
      saveMultiClientState(nextState);
      return nextState;
    });
    setActiveSection('cover');
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
    setActiveSection('situation');
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

  // 5. General Admin State Override
  const handleUpdateState = (newState: typeof appState) => {
    setAppState(newState);
  };

  const handleResetToDefaults = () => {
    clearAppState();
    window.location.reload();
  };

  const isEvaluation = ['situation', 'property', 'market', 'comparables', 'positioning', 'conclusion', 'services'].includes(activeSection);
  const isTransaction = ['documents', 'viewings', 'salesPlan', 'offers', 'stats'].includes(activeSection);
  const isAdmin = ['admin', 'admin-clients', 'admin-profile', 'admin-property', 'admin-points', 'admin-stats'].includes(activeSection);

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
        lastEvalSection={lastEvalSection}
        lastTransSection={lastTransSection}
        lastAdminSection={lastAdminSection}
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
                    { id: 'evaluation', label: 'Estimation', target: lastEvalSection, active: isEvaluation },
                    { id: 'transaction', label: 'Suivi de Vente', target: lastTransSection, active: isTransaction },
                    { id: 'admin', label: 'Espace Conseiller (Admin)', target: lastAdminSection, active: isAdmin }
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
          
          {/* Top Header Controls bar for Admin Space */}
          {isAdmin && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="admin-panel-header">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-wider">Espace d'Administration & Gestion</span>
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <Settings className="w-6 h-6 text-[#00A0E2] animate-spin-slow" />
                  Console du Conseiller iad
                </h2>
                <p className="text-xs text-slate-500">Adaptez l'intégralité du dossier d'estimation en modifiant les fiches et statistiques en temps réel.</p>
              </div>

              {/* Action button */}
              <button
                id="btn-restore-app"
                onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données de l'application à leur état d'origine ?")) {
                    handleResetToDefaults();
                  }
                }}
                className="bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-600 font-bold py-2 px-4 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                Réinitialiser l'application
              </button>
            </div>
          )}

          {/* Division sub-tabs bar */}
          {activeSection !== 'cover' && (
            <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none snap-x snap-mandatory shadow-sm" id="main-subtabs-bar">
              {(() => {
                if (isEvaluation) {
                  return [
                    { id: 'situation', label: 'Situation & Cadastre', icon: MapPin },
                    { id: 'property', label: 'Fiche du Bien', icon: Info },
                    { id: 'market', label: 'Marché Local', icon: TrendingUp },
                    { id: 'comparables', label: 'Comparables', icon: GitCompare },
                    { id: 'positioning', label: 'Simulateur', icon: Sliders },
                    { id: 'conclusion', label: 'Recommandations', icon: CheckSquare },
                    { id: 'services', label: 'Avis & Services', icon: Star },
                  ];
                } else if (isTransaction) {
                  return [
                    { id: 'documents', label: 'Dossier Vendeur', icon: FolderOpen, badge: appState.documents.length },
                    { id: 'viewings', label: 'Suivi des Visites', icon: Users, badge: appState.viewings.length },
                    { id: 'salesPlan', label: 'Plan de Vente', icon: Compass },
                    { id: 'offers', label: "Offres d'Achat", icon: Handshake, badge: appState.offers.filter(o => o.status === 'Reçue').length || undefined },
                    { id: 'stats', label: 'Performance Web', icon: BarChart3 },
                  ];
                } else if (isAdmin) {
                  return [
                    { id: 'admin-clients', label: 'Gestion des Clients', icon: Users, badge: multiClientState.clients.length },
                    { id: 'admin-profile', label: 'Profil Conseiller', icon: User },
                    { id: 'admin-property', label: 'Caractéristiques du Bien', icon: Info },
                    { id: 'admin-points', label: 'Points Forts/Faibles', icon: Sparkles },
                    { id: 'admin-stats', label: 'Performance Portails', icon: BarChart3 },
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
                  onStart={handleStartPresentation} 
                />
              )}
              {activeSection === 'situation' && (
                <SituationSection 
                  cadastralParcels={appState.cadastralParcels}
                  clientAddress={appState.clientInfo.address}
                />
              )}
              {activeSection === 'property' && (
                <PropertySection 
                  propertyDetails={appState.propertyDetails}
                  pointsForts={appState.pointsForts}
                  pointsDefendre={appState.pointsDefendre}
                />
              )}
              {activeSection === 'market' && (
                <MarketSection 
                  marketPriceRanges={appState.marketPriceRanges}
                  propertySize={appState.propertyDetails.surface}
                />
              )}
              {activeSection === 'comparables' && (
                <ComparablesSection 
                  soldComparables={appState.soldComparables}
                  propertyDetails={appState.propertyDetails}
                  referencePrice={appState.marketPriceRanges?.currentReferencePrice || 400000}
                />
              )}
              {activeSection === 'positioning' && (
                <PositioningSection 
                  referencePrice={appState.marketPriceRanges?.currentReferencePrice || 400000}
                  propertySize={appState.propertyDetails.surface}
                />
              )}
              {activeSection === 'conclusion' && (
                <ConclusionSection 
                  clientInfo={appState.clientInfo}
                  advisorInfo={appState.advisorInfo}
                  recommendedPriceRange={appState.recommendedPriceRange}
                  propertySize={appState.propertyDetails.surface}
                />
              )}
              {activeSection === 'services' && <ServicesSection />}
              
              {/* Follow-up Interactive sections */}
              {activeSection === 'documents' && (
                <DocumentsSection 
                  documents={appState.documents}
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                />
              )}
              {activeSection === 'viewings' && (
                <VisitsSection 
                  viewings={appState.viewings}
                  onAddViewing={handleAddViewing}
                  onDeleteViewing={handleDeleteViewing}
                  isAdmin={true}
                />
              )}
              {activeSection === 'salesPlan' && (
                <SalesPlanSection 
                  salesSteps={appState.salesSteps}
                  onUpdateStepStatus={handleUpdateStepStatus}
                  isAdmin={true}
                />
              )}
              {activeSection === 'offers' && (
                <OffersSection 
                  offers={appState.offers}
                  onAddOffer={handleAddOffer}
                  onDeleteOffer={handleDeleteOffer}
                  onUpdateOfferStatus={handleUpdateOfferStatus}
                  isAdmin={true}
                />
              )}
              {activeSection === 'stats' && (
                <StatsSection 
                  portalStats={appState.portalStats}
                />
              )}
              {isAdmin && (
                <AdminPortal 
                  appState={appState}
                  onUpdateState={handleUpdateState}
                  onResetToDefaults={handleResetToDefaults}
                  clients={multiClientState.clients}
                  currentClientId={multiClientState.currentClientId}
                  onSelectClient={handleSelectClient}
                  onAddClient={handleAddClient}
                  onDeleteClient={handleDeleteClient}
                  activeTab={(() => {
                    if (activeSection === 'admin-profile') return 'profile';
                    if (activeSection === 'admin-property') return 'property';
                    if (activeSection === 'admin-points') return 'points';
                    if (activeSection === 'admin-stats') return 'stats';
                    return 'clients';
                  })()}
                  onTabChange={(tab) => {
                    const sectionMap = {
                      clients: 'admin-clients',
                      profile: 'admin-profile',
                      property: 'admin-property',
                      points: 'admin-points',
                      stats: 'admin-stats',
                    };
                    setActiveSection(sectionMap[tab]);
                  }}
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
