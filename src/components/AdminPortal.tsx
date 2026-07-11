import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Home, 
  Plus, 
  Trash2, 
  CheckCircle, 
  RefreshCw, 
  Globe, 
  Save, 
  ChevronRight, 
  Info, 
  ThumbsUp, 
  ShieldAlert,
  ArrowRight,
  Calendar,
  Users,
  Search,
  ArrowUpDown,
  Filter,
  Building2,
  Activity,
  Eye,
  FileText,
  Compass,
  Handshake,
  MapPin
} from 'lucide-react';
import { AppState, PropertyPoint, PortalStat, ClientRecord } from '../types';

interface AdminPortalProps {
  appState: AppState;
  onUpdateState: (state: AppState) => void;
  onResetToDefaults: () => void;
  clients: ClientRecord[];
  currentClientId: string;
  onSelectClient: (clientId: string) => void;
  onAddClient: (names: string, address: string) => void;
  onDeleteClient: (clientId: string) => void;
  activeTab?: 'profile' | 'property' | 'points' | 'stats' | 'clients';
  onTabChange?: (tab: 'profile' | 'property' | 'points' | 'stats' | 'clients') => void;
}

export default function AdminPortal({ 
  appState, 
  onUpdateState, 
  onResetToDefaults,
  clients,
  currentClientId,
  onSelectClient,
  onAddClient,
  onDeleteClient,
  activeTab: propActiveTab,
  onTabChange
}: AdminPortalProps) {
  const [localActiveTab, setLocalActiveTab] = useState<'profile' | 'property' | 'points' | 'stats' | 'clients'>('clients');
  const activeTab = propActiveTab || localActiveTab;

  const setActiveTab = (tab: 'profile' | 'property' | 'points' | 'stats' | 'clients') => {
    setLocalActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // 1. Local state for profiles
  const predefinedTitles = [
    "Dossier de commercialisation & Suivi de vente",
    "Dossier d'accompagnement immobilier personnalisé",
    "Projet de vente & Plan de commercialisation",
    "Avis de valeur certifié & Étude de marché",
    "Suivi d'activité & Commercialisation"
  ];

  const [clientNames, setClientNames] = useState<string>(appState.clientInfo.names);
  const [clientAddress, setClientAddress] = useState<string>(appState.clientInfo.address);
  const [estimateDate, setEstimateDate] = useState<string>(appState.clientInfo.date);
  const [projectTitle, setProjectTitle] = useState<string>(appState.clientInfo.projectTitle || "Dossier de commercialisation & Suivi de vente");
  const [selectedPreset, setSelectedPreset] = useState<string>(
    predefinedTitles.includes(appState.clientInfo.projectTitle || "Dossier de commercialisation & Suivi de vente")
      ? (appState.clientInfo.projectTitle || "Dossier de commercialisation & Suivi de vente")
      : 'custom'
  );
  
  const [advisorName, setAdvisorName] = useState<string>(appState.advisorInfo.name);
  const [advisorTitle, setAdvisorTitle] = useState<string>(appState.advisorInfo.title);
  const [advisorPhone, setAdvisorPhone] = useState<string>(appState.advisorInfo.phone);
  const [advisorEmail, setAdvisorEmail] = useState<string>(appState.advisorInfo.email);

  // 2. Local state for property details
  const [surface, setSurface] = useState<number>(appState.propertyDetails.surface);
  const [rooms, setRooms] = useState<number>(appState.propertyDetails.rooms);
  const [bedrooms, setBedrooms] = useState<number>(appState.propertyDetails.bedrooms);
  const [landSurface, setLandSurface] = useState<number>(appState.propertyDetails.landSurface);
  const [year, setYear] = useState<number>(appState.propertyDetails.year);
  const [floors, setFloors] = useState<number>(appState.propertyDetails.floors);
  const [description, setDescription] = useState<string>(appState.propertyDetails.description);

  // 3. Local state for points
  const [newPointText, setNewPointText] = useState<string>('');
  const [newPointDesc, setNewPointDesc] = useState<string>('');
  const [pointType, setPointType] = useState<'fort' | 'defendre'>('fort');

  // 3.5. Local state for new clients
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientAddress, setNewClientAddress] = useState<string>('');

  // 3.6. Client Table Search/Filter/Sort states
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
  const [clientStatusFilter, setClientStatusFilter] = useState<'all' | 'active' | 'sleep'>('all');
  const [clientSortBy, setClientSortBy] = useState<'name' | 'date' | 'surface' | 'visits' | 'progress'>('name');
  const [clientSortOrder, setClientSortOrder] = useState<'asc' | 'desc'>('asc');

  // 4. Local state for portals stats
  const [portalStats, setPortalStats] = useState<PortalStat[]>(appState.portalStats);
  const [selectedPortalToEdit, setSelectedPortalToEdit] = useState<string>(
    appState.portalStats[0]?.portalName || 'Leboncoin.fr'
  );

  // Sync state if appState changes (e.g. on reset)
  React.useEffect(() => {
    setPortalStats(appState.portalStats);
    if (appState.portalStats.length > 0 && !appState.portalStats.some(p => p.portalName === selectedPortalToEdit)) {
      setSelectedPortalToEdit(appState.portalStats[0].portalName);
    }
    setClientNames(appState.clientInfo.names);
    setClientAddress(appState.clientInfo.address);
    setEstimateDate(appState.clientInfo.date);
    const currentTitle = appState.clientInfo.projectTitle || "Dossier de commercialisation & Suivi de vente";
    setProjectTitle(currentTitle);
    setSelectedPreset(predefinedTitles.includes(currentTitle) ? currentTitle : 'custom');
    setAdvisorName(appState.advisorInfo.name);
    setAdvisorTitle(appState.advisorInfo.title);
    setAdvisorPhone(appState.advisorInfo.phone);
    setAdvisorEmail(appState.advisorInfo.email);
    setSurface(appState.propertyDetails.surface);
    setRooms(appState.propertyDetails.rooms);
    setBedrooms(appState.propertyDetails.bedrooms);
    setLandSurface(appState.propertyDetails.landSurface);
    setYear(appState.propertyDetails.year);
    setFloors(appState.propertyDetails.floors);
    setDescription(appState.propertyDetails.description);
  }, [JSON.stringify(appState.portalStats), appState.clientInfo, appState.advisorInfo, appState.propertyDetails]);

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveProfiles = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState({
      ...appState,
      clientInfo: {
        names: clientNames,
        address: clientAddress,
        date: estimateDate,
        projectTitle: projectTitle
      },
      advisorInfo: {
        ...appState.advisorInfo,
        name: advisorName,
        title: advisorTitle,
        phone: advisorPhone,
        email: advisorEmail
      }
    });
    triggerSaveNotification();
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState({
      ...appState,
      propertyDetails: {
        surface,
        rooms,
        bedrooms,
        landSurface,
        year,
        floors,
        address: clientAddress,
        description
      }
    });
    triggerSaveNotification();
  };

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPointText && newPointDesc) {
      const newPoint: PropertyPoint = {
        text: newPointText,
        description: newPointDesc
      };

      if (pointType === 'fort') {
        onUpdateState({
          ...appState,
          pointsForts: [...appState.pointsForts, newPoint]
        });
      } else {
        onUpdateState({
          ...appState,
          pointsDefendre: [...appState.pointsDefendre, newPoint]
        });
      }

      setNewPointText('');
      setNewPointDesc('');
      triggerSaveNotification();
    }
  };

  const handleDeletePoint = (index: number, type: 'fort' | 'defendre') => {
    if (type === 'fort') {
      const updated = appState.pointsForts.filter((_, i) => i !== index);
      onUpdateState({ ...appState, pointsForts: updated });
    } else {
      const updated = appState.pointsDefendre.filter((_, i) => i !== index);
      onUpdateState({ ...appState, pointsDefendre: updated });
    }
    triggerSaveNotification();
  };

  const handleStatChange = (portalName: string, field: 'views' | 'detailedViews' | 'contacts' | 'phoneClicks', value: number) => {
    const updated = portalStats.map(portal => {
      if (portal.portalName === portalName) {
        return {
          ...portal,
          [field]: value
        };
      }
      return portal;
    });
    setPortalStats(updated);
  };

  const handleSaveStats = () => {
    onUpdateState({
      ...appState,
      portalStats: portalStats
    });
    triggerSaveNotification();
  };

  const handlePerformanceIndexChange = (portalName: string, value: number) => {
    const updated = portalStats.map(portal => {
      if (portal.portalName === portalName) {
        return {
          ...portal,
          performanceIndex: Math.min(100, Math.max(0, value))
        };
      }
      return portal;
    });
    setPortalStats(updated);
  };

  const handleHistoryChange = (
    portalName: string, 
    index: number, 
    field: 'views' | 'detailedViews' | 'contacts' | 'phoneClicks', 
    value: number
  ) => {
    const updated = portalStats.map(portal => {
      if (portal.portalName === portalName) {
        const updatedHistory = portal.history.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              [field]: value
            };
          }
          return item;
        });

        const views = updatedHistory.reduce((sum, h) => sum + h.views, 0);
        const detailedViews = updatedHistory.reduce((sum, h) => sum + h.detailedViews, 0);
        const contacts = updatedHistory.reduce((sum, h) => sum + h.contacts, 0);
        const phoneClicks = updatedHistory.reduce((sum, h) => sum + h.phoneClicks, 0);

        return {
          ...portal,
          history: updatedHistory,
          views,
          detailedViews,
          contacts,
          phoneClicks
        };
      }
      return portal;
    });
    setPortalStats(updated);
  };

  const handleAddPeriod = () => {
    const currentPeriodCount = portalStats[0]?.history.length || 0;
    const nextPeriodLabel = `Semaine ${currentPeriodCount + 1}`;

    const updated = portalStats.map(portal => {
      const newHistoryItem = {
        date: nextPeriodLabel,
        views: 120,
        detailedViews: 35,
        contacts: 1,
        phoneClicks: 0
      };
      
      const updatedHistory = [...portal.history, newHistoryItem];
      
      const views = updatedHistory.reduce((sum, h) => sum + h.views, 0);
      const detailedViews = updatedHistory.reduce((sum, h) => sum + h.detailedViews, 0);
      const contacts = updatedHistory.reduce((sum, h) => sum + h.contacts, 0);
      const phoneClicks = updatedHistory.reduce((sum, h) => sum + h.phoneClicks, 0);

      return {
        ...portal,
        history: updatedHistory,
        views,
        detailedViews,
        contacts,
        phoneClicks
      };
    });
    setPortalStats(updated);
  };

  const handleDeletePeriod = (periodIndex: number) => {
    if ((portalStats[0]?.history.length || 0) <= 1) {
      alert("Il faut conserver au moins une période dans l'historique.");
      return;
    }
    const updated = portalStats.map(portal => {
      const updatedHistory = portal.history.filter((_, i) => i !== periodIndex);
      
      const views = updatedHistory.reduce((sum, h) => sum + h.views, 0);
      const detailedViews = updatedHistory.reduce((sum, h) => sum + h.detailedViews, 0);
      const contacts = updatedHistory.reduce((sum, h) => sum + h.contacts, 0);
      const phoneClicks = updatedHistory.reduce((sum, h) => sum + h.phoneClicks, 0);

      return {
        ...portal,
        history: updatedHistory,
        views,
        detailedViews,
        contacts,
        phoneClicks
      };
    });
    setPortalStats(updated);
  };

  return (
    <div className="w-full flex flex-col gap-6" id="admin-portal-root">
      
      {/* Forms box (Full width) */}
      <div className="w-full bg-white p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm relative min-h-[350px]" id="admin-forms-box">
        
        {/* Notification save success */}
        {saveSuccess && (
          <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300 z-10 shadow" id="admin-save-toast">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Modifications sauvegardées !</span>
          </div>
        )}

        {/* Tab 0: Multi-client management (Precise CRM Database Table) */}
        {activeTab === 'clients' && (() => {
            // Summary KPI calculations
            const totalClients = clients.length;
            const totalSurfaceManaged = clients.reduce((acc, c) => acc + (c.propertyDetails?.surface || 0), 0);
            const totalVisits = clients.reduce((acc, c) => acc + (c.viewings?.length || 0), 0);
            const totalOffers = clients.reduce((acc, c) => acc + (c.offers?.length || 0), 0);

            // Filter & Sort Logic
            const filteredClients = clients
              .filter(client => {
                const matchSearch = 
                  client.clientInfo.names.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
                  client.clientInfo.address.toLowerCase().includes(clientSearchQuery.toLowerCase());
                
                if (clientStatusFilter === 'active') {
                  return matchSearch && client.id === currentClientId;
                }
                if (clientStatusFilter === 'sleep') {
                  return matchSearch && client.id !== currentClientId;
                }
                return matchSearch;
              })
              .sort((a, b) => {
                let valA: any = '';
                let valB: any = '';

                if (clientSortBy === 'name') {
                  valA = a.clientInfo.names.toLowerCase();
                  valB = b.clientInfo.names.toLowerCase();
                } else if (clientSortBy === 'date') {
                  // Format '10 juillet 2026' to sorting friendly string
                  valA = a.clientInfo.date;
                  valB = b.clientInfo.date;
                } else if (clientSortBy === 'surface') {
                  valA = a.propertyDetails?.surface || 0;
                  valB = b.propertyDetails?.surface || 0;
                } else if (clientSortBy === 'visits') {
                  valA = a.viewings?.length || 0;
                  valB = b.viewings?.length || 0;
                } else if (clientSortBy === 'progress') {
                  valA = a.salesSteps?.filter(s => s.status === 'Terminé').length || 0;
                  valB = b.salesSteps?.filter(s => s.status === 'Terminé').length || 0;
                }

                if (valA < valB) return clientSortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return clientSortOrder === 'asc' ? 1 : -1;
                return 0;
              });

            return (
              <div className="flex flex-col gap-8" id="admin-clients-tab">
                
                {/* 1. Database KPI Summary Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="crm-metrics-strip">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Dossiers gérés</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-slate-800">{totalClients}</span>
                      <span className="text-[10px] text-emerald-600 font-bold font-mono bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Surface Totale</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-slate-800">{totalSurfaceManaged}</span>
                      <span className="text-xs text-slate-500 font-semibold font-mono">m²</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Visites Générées</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-slate-800">{totalVisits}</span>
                      <span className="text-[10px] text-blue-600 font-bold font-mono bg-blue-50 px-1.5 py-0.5 rounded">Acheteurs</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Offres Reçues</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-[#00A0E2]">{totalOffers}</span>
                      <span className="text-[10px] text-orange-600 font-bold font-mono bg-orange-50 px-1.5 py-0.5 rounded">Négos</span>
                    </div>
                  </div>
                </div>

                {/* 2. Database Filter & Toolbar controls */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm" id="crm-table-toolbar">
                  {/* Search Bar */}
                  <div className="relative w-full md:w-72">
                    <input 
                      id="crm-search-input"
                      type="text"
                      placeholder="Rechercher nom, adresse..."
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20 focus:bg-white focus:border-[#00A0E2] transition-all"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Filter & Sort select inputs */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                    {/* Filter by Status */}
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        id="crm-filter-status"
                        value={clientStatusFilter}
                        onChange={(e) => setClientStatusFilter(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20 focus:border-[#00A0E2] cursor-pointer"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Dossier Actif</option>
                        <option value="sleep">En sommeil</option>
                      </select>
                    </div>

                    {/* Sort by Metric */}
                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        id="crm-sort-by"
                        value={clientSortBy}
                        onChange={(e) => setClientSortBy(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20 focus:border-[#00A0E2] cursor-pointer"
                      >
                        <option value="name">Trier par Nom</option>
                        <option value="date">Trier par Date de création</option>
                        <option value="surface">Trier par Surface</option>
                        <option value="visits">Trier par Nb Visites</option>
                        <option value="progress">Trier par Avancement</option>
                      </select>

                      <button
                        id="btn-toggle-sort-order"
                        onClick={() => setClientSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        title={clientSortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
                      >
                        <span className="text-[10px] font-extrabold text-slate-600 font-mono uppercase">
                          {clientSortOrder === 'asc' ? 'Asc' : 'Desc'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. The Core Database Spreadsheet Grid */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="crm-database-table-wrapper">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="crm-database-table">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-5 py-4 w-1/4">Client / Propriétaire</th>
                          <th className="px-5 py-4 w-1/4">Adresse & Caractéristiques</th>
                          <th className="px-5 py-4 w-1/6 text-center">Plan de Vente (CRM)</th>
                          <th className="px-5 py-4 w-1/6 text-center">Activités (Visites/Offres)</th>
                          <th className="px-5 py-4 w-1/6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredClients.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-5 py-12 text-center text-xs font-semibold text-slate-400">
                              Aucun dossier client ne correspond à vos critères de recherche.
                            </td>
                          </tr>
                        ) : (
                          filteredClients.map(client => {
                            const isActive = client.id === currentClientId;
                            const completedSteps = client.salesSteps?.filter(s => s.status === 'Terminé').length || 0;
                            const progressPercent = Math.round((completedSteps / 10) * 100);
                            
                            // Extract client's initials
                            const namesClean = client.clientInfo.names.replace('Mme et M. ', '');
                            const initials = namesClean.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

                            return (
                              <tr 
                                key={client.id}
                                id={`crm-row-${client.id}`}
                                className={`hover:bg-slate-50/50 transition-colors group ${
                                  isActive ? 'bg-[#00A0E2]/5' : ''
                                }`}
                              >
                                {/* Column 1: Client names & status */}
                                <td className="px-5 py-4.5">
                                  <div className="flex items-center gap-3.5">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[11px] shrink-0 font-mono ${
                                      isActive 
                                        ? 'bg-[#00A0E2] text-white shadow-sm shadow-[#00A0E2]/20' 
                                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                    }`}>
                                      {initials || 'CL'}
                                    </div>
                                    <div className="min-w-0 flex flex-col">
                                      <span className="text-xs font-extrabold text-slate-800 truncate" title={client.clientInfo.names}>
                                        {client.clientInfo.names}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
                                        Créé le {client.clientInfo.date}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Column 2: Property details and sizes */}
                                <td className="px-5 py-4.5">
                                  <div className="flex flex-col gap-1.5 min-w-0">
                                    <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold truncate" title={client.clientInfo.address}>
                                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span className="truncate">{client.clientInfo.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                                        {client.propertyDetails?.surface || 0} m²
                                      </span>
                                      <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                                        {client.propertyDetails?.rooms || 0} p
                                      </span>
                                      {client.propertyDetails?.bedrooms && (
                                        <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-mono hidden sm:inline-block">
                                          {client.propertyDetails.bedrooms} ch.
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Column 3: Custom Sales Progress Slider */}
                                <td className="px-5 py-4.5 text-center">
                                  <div className="flex flex-col gap-1.5 items-center justify-center max-w-[140px] mx-auto">
                                    <div className="flex items-center justify-between w-full text-[10px] font-bold font-mono">
                                      <span className="text-[#00A0E2]">{progressPercent}%</span>
                                      <span className="text-slate-400">{completedSteps}/10</span>
                                    </div>
                                    {/* Progress line */}
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-[#00A0E2] to-cyan-400 transition-all duration-500 rounded-full"
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* Column 4: Visites & Offres quick summaries */}
                                <td className="px-5 py-4.5">
                                  <div className="flex flex-col gap-1 items-center justify-center">
                                    <div className="flex items-center gap-1.5">
                                      <Users className="w-3.5 h-3.5 text-slate-400" />
                                      <span className="text-xs font-bold text-slate-700">
                                        {client.viewings?.length || 0} {client.viewings?.length > 1 ? 'visites' : 'visite'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Handshake className="w-3.5 h-3.5 text-slate-400" />
                                      {client.offers?.length > 0 ? (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full font-mono flex items-center gap-0.5">
                                          {client.offers.length} {client.offers.length > 1 ? 'offres' : 'offre'}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 font-medium">Aucune offre</span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Column 5: Database Actions */}
                                <td className="px-5 py-4.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    
                                    {/* Select / Active Toggle */}
                                    {!isActive ? (
                                      <button
                                        id={`btn-table-activate-${client.id}`}
                                        onClick={() => {
                                          onSelectClient(client.id);
                                          triggerSaveNotification();
                                        }}
                                        className="bg-slate-900 hover:bg-[#00A0E2] text-white hover:text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                                        title="Charger l'estimation et le suivi de vente de ce client dans la présentation"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Charger</span>
                                      </button>
                                    ) : (
                                      <div className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0">
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Actif</span>
                                      </div>
                                    )}

                                    {/* Delete record */}
                                    <button
                                      id={`btn-table-delete-${client.id}`}
                                      onClick={() => {
                                        if (isActive && clients.length <= 1) {
                                          alert("Vous devez conserver au moins un dossier client.");
                                          return;
                                        }
                                        if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le dossier de ${client.clientInfo.names} ? Cette action effacera toutes ses données d'estimation et de suivi de vente.`)) {
                                          onDeleteClient(client.id);
                                          triggerSaveNotification();
                                        }
                                      }}
                                      disabled={clients.length <= 1}
                                      className={`p-1.5 rounded-lg border transition-all ${
                                        clients.length <= 1
                                          ? 'text-slate-200 border-slate-100 bg-slate-50 cursor-not-allowed'
                                          : 'text-slate-400 border-slate-200 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50'
                                      }`}
                                      title="Supprimer définitivement de la base de données"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Add a client form */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-inner" id="admin-add-client-form">
                  <h4 className="text-xs font-mono font-bold text-[#00A0E2] uppercase tracking-wider mb-1">CRM iad France</h4>
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight mb-4">Ajouter une nouvelle fiche propriétaire</h3>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newClientName && newClientAddress) {
                        onAddClient(newClientName, newClientAddress);
                        setNewClientName('');
                        setNewClientAddress('');
                        triggerSaveNotification();
                      }
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Noms complets du client *</label>
                        <input 
                          id="new-client-name"
                          type="text" 
                          required
                          value={newClientName}
                          onChange={(e) => setNewClientName(e.target.value)}
                          placeholder="ex. Mme et M. Girard Pierre"
                          className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-700 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20 focus:border-[#00A0E2] transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Adresse complète du bien immobilier *</label>
                        <input 
                          id="new-client-address"
                          type="text" 
                          required
                          value={newClientAddress}
                          onChange={(e) => setNewClientAddress(e.target.value)}
                          placeholder="ex. 12 Avenue de l'Annonciade, 13008 Marseille"
                          className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-700 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20 focus:border-[#00A0E2] transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/40 text-blue-800 rounded-xl border border-blue-100/50 text-[11px] leading-relaxed mt-1">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>
                        Cette opération va instancier une nouvelle ligne de base de données relationnelle locale. Le dossier sera immédiatement sélectionnable et configuré avec les documents de diagnostics, le parcours de vente iad standard et un espace de négociation d'offres d'achats vierge.
                      </span>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        id="btn-submit-new-client"
                        type="submit"
                        className="bg-[#00A0E2] hover:bg-[#008cc7] text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm shadow-[#00A0E2]/10"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Créer la fiche de données</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            );
          })()}

          {/* Tab 1: Profiles form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfiles} className="flex flex-col gap-6" id="form-admin-profiles">
              <div id="form-profile-client-section">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight border-b border-slate-100 pb-2 mb-4">Informations Clients & Vendeurs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Noms des vendeurs *</label>
                    <input 
                      id="admin-client-names"
                      type="text" 
                      required
                      value={clientNames}
                      onChange={(e) => setClientNames(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Date d'estimation officielle *</label>
                    <input 
                      id="admin-estimate-date"
                      type="text" 
                      required
                      value={estimateDate}
                      onChange={(e) => setEstimateDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Adresse complète du bien *</label>
                    <input 
                      id="admin-client-address"
                      type="text" 
                      required
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[10px] text-[#00A0E2] font-bold uppercase font-mono">Intitulé du Dossier (Écran d'Accueil) *</label>
                    <span className="text-[10px] text-slate-500 -mt-1 mb-1">Choisissez un terme intemporel s'adaptant à l'état d'avancement du projet (avis de valeur, mandat, visites, commercialisation).</span>
                    <select
                      id="admin-project-title-preset"
                      value={selectedPreset}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedPreset(val);
                        if (val !== 'custom') {
                          setProjectTitle(val);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    >
                      {predefinedTitles.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      <option value="custom">✍️ Titre entièrement personnalisé...</option>
                    </select>
                  </div>
                  {selectedPreset === 'custom' && (
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] text-rose-500 font-bold uppercase font-mono">Votre titre personnalisé de couverture *</label>
                      <input 
                        id="admin-project-title-custom"
                        type="text" 
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Ex: Suivi de commercialisation & Stratégie"
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-850 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div id="form-profile-advisor-section">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight border-b border-slate-100 pb-2 mb-4">Informations Conseiller (Olivier Gomez)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Nom complet du Conseiller *</label>
                    <input 
                      id="admin-advisor-name"
                      type="text" 
                      required
                      value={advisorName}
                      onChange={(e) => setAdvisorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Titre professionnel *</label>
                    <input 
                      id="admin-advisor-title"
                      type="text" 
                      required
                      value={advisorTitle}
                      onChange={(e) => setAdvisorTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Téléphone *</label>
                    <input 
                      id="admin-advisor-phone"
                      type="text" 
                      required
                      value={advisorPhone}
                      onChange={(e) => setAdvisorPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Email *</label>
                    <input 
                      id="admin-advisor-email"
                      type="email" 
                      required
                      value={advisorEmail}
                      onChange={(e) => setAdvisorEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                id="btn-save-profiles"
                type="submit"
                className="self-end flex items-center gap-1.5 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder les Profils</span>
              </button>
            </form>
          )}

          {/* Tab 2: Property features form */}
          {activeTab === 'property' && (
            <form onSubmit={handleSaveProperty} className="flex flex-col gap-6" id="form-admin-property">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight border-b border-slate-100 pb-2 mb-4">Caractéristiques Fiche Technique</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Surface habitable (m²) *</label>
                    <input 
                      id="admin-prop-surface"
                      type="number" 
                      required
                      value={surface}
                      onChange={(e) => setSurface(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Nombre de pièces *</label>
                    <input 
                      id="admin-prop-rooms"
                      type="number" 
                      required
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Nombre de chambres *</label>
                    <input 
                      id="admin-prop-bedrooms"
                      type="number" 
                      required
                      value={bedrooms}
                      onChange={(e) => setBedrooms(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Terrain / Parcelle (m²) *</label>
                    <input 
                      id="admin-prop-land"
                      type="number" 
                      required
                      value={landSurface}
                      onChange={(e) => setLandSurface(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Année construction *</label>
                    <input 
                      id="admin-prop-year"
                      type="number" 
                      required
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Étages *</label>
                    <input 
                      id="admin-prop-floors"
                      type="number" 
                      required
                      value={floors}
                      onChange={(e) => setFloors(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Description générale de la fiche du bien *</label>
                <textarea 
                  id="admin-prop-desc"
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <button 
                id="btn-save-property-details"
                type="submit"
                className="self-end flex items-center gap-1.5 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder la Fiche Technique</span>
              </button>
            </form>
          )}

          {/* Tab 3: Points forts / Points à defendre lists */}
          {activeTab === 'points' && (
            <div className="flex flex-col gap-6" id="form-admin-points">
              
              {/* Form to add point */}
              <form onSubmit={handleAddPoint} className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 flex flex-col gap-4" id="form-add-point">
                <h4 className="text-xs font-extrabold text-slate-800 tracking-tight">Ajouter un argumentaire marketing</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Type d'argument *</label>
                    <select 
                      id="select-point-type"
                      value={pointType}
                      onChange={(e) => setPointType(e.target.value as 'fort' | 'defendre')}
                      className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
                    >
                      <option value="fort">Point fort / Force de vente</option>
                      <option value="defendre">Point à défendre / Objection</option>
                    </select>
                  </div>

                  <div className="md:col-span-8 flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Titre du Point *</label>
                    <input 
                      id="input-point-text"
                      type="text" 
                      required
                      placeholder="ex: CHAUFFAGE ÉCOLOGIQUE, MITOYENNETÉ"
                      value={newPointText}
                      onChange={(e) => setNewPointText(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Description / Explication marketing *</label>
                  <textarea 
                    id="input-point-desc"
                    required
                    rows={2}
                    placeholder="Rédigez l'argument détaillé pour valoriser ou contrer l'objection lors des visites."
                    value={newPointDesc}
                    onChange={(e) => setNewPointDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
                  />
                </div>

                <button 
                  id="btn-confirm-add-point"
                  type="submit"
                  className="self-end flex items-center gap-1.5 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insérer l'Argument</span>
                </button>
              </form>

              {/* Point Lists Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="points-lists-split">
                
                {/* Strengths list */}
                <div className="flex flex-col gap-3" id="admin-strengths-sublist">
                  <h4 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1 text-emerald-600">
                    <ThumbsUp className="w-4 h-4 fill-current" />
                    Points Forts Actuels ({appState.pointsForts.length})
                  </h4>
                  <div className="flex flex-col gap-2" id="admin-strengths-items">
                    {appState.pointsForts.map((pt, i) => (
                      <div key={i} className="bg-emerald-50/20 border border-emerald-100 p-3 rounded-xl flex justify-between items-start gap-2" id={`admin-strength-pt-${i}`}>
                        <div className="min-w-0">
                          <strong className="text-xs text-emerald-950 font-bold block">{pt.text}</strong>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-snug line-clamp-2">{pt.description}</p>
                        </div>
                        <button
                          id={`btn-delete-strength-pt-${i}`}
                          onClick={() => handleDeletePoint(i, 'fort')}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Objections list */}
                <div className="flex flex-col gap-3" id="admin-objections-sublist">
                  <h4 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1 text-amber-600">
                    <ShieldAlert className="w-4 h-4" />
                    Points à Défendre / Objections ({appState.pointsDefendre.length})
                  </h4>
                  <div className="flex flex-col gap-2" id="admin-objections-items">
                    {appState.pointsDefendre.map((pt, i) => (
                      <div key={i} className="bg-amber-50/20 border border-amber-100 p-3 rounded-xl flex justify-between items-start gap-2" id={`admin-objection-pt-${i}`}>
                        <div className="min-w-0">
                          <strong className="text-xs text-amber-950 font-bold block">{pt.text}</strong>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-snug line-clamp-2">{pt.description}</p>
                        </div>
                        <button
                          id={`btn-delete-objection-pt-${i}`}
                          onClick={() => handleDeletePoint(i, 'defendre')}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab 4: Web Portals statistics modification with week-by-week history */}
          {activeTab === 'stats' && (
            <div className="flex flex-col gap-6" id="form-admin-stats">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 gap-4" id="stats-tab-header">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Suivi & Historique de Performance Web</h3>
                  <p className="text-xs text-slate-500">Configurez l'évolution hebdomadaire des statistiques de l'annonce. Les totaux cumulés de chaque portail sont calculés automatiquement à partir de leur historique respectif.</p>
                </div>
                
                <button
                  id="btn-admin-add-week"
                  type="button"
                  onClick={handleAddPeriod}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-[10px] tracking-tight uppercase flex items-center gap-1 cursor-pointer transition-colors shadow-sm shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une semaine</span>
                </button>
              </div>

              {/* Portal selector for active edit session */}
              <div className="flex flex-wrap bg-slate-50 p-1 rounded-2xl border border-slate-200/50 gap-1" id="portal-edit-selector">
                {portalStats.map((p) => {
                  const isActive = p.portalName === selectedPortalToEdit;
                  return (
                    <button
                      key={p.portalName}
                      id={`btn-select-edit-portal-${p.portalName.replace(/\./g, '-')}`}
                      type="button"
                      onClick={() => setSelectedPortalToEdit(p.portalName)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        isActive 
                          ? 'bg-[#00A0E2] text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                      }`}
                    >
                      {p.portalName}
                    </button>
                  );
                })}
              </div>

              {/* Display portal general settings (Index Performance) */}
              {(() => {
                const activeP = portalStats.find(p => p.portalName === selectedPortalToEdit);
                if (!activeP) return null;

                return (
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="portal-settings-box">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Configuration du canal</span>
                      <strong className="text-xs font-extrabold text-slate-800">{activeP.portalName}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-[10px] text-slate-400 font-bold uppercase font-mono whitespace-nowrap">Index de Performance (0-100)</label>
                      <input
                        id={`input-perf-index-${activeP.portalName}`}
                        type="number"
                        min="0"
                        max="100"
                        value={activeP.performanceIndex}
                        onChange={(e) => handlePerformanceIndexChange(activeP.portalName, parseInt(e.target.value) || 0)}
                        className="w-20 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-black text-slate-800 text-center font-mono focus:border-[#00A0E2] focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* History list for selected portal */}
              {(() => {
                const activeP = portalStats.find(p => p.portalName === selectedPortalToEdit);
                if (!activeP || !activeP.history) return null;

                return (
                  <div className="flex flex-col gap-4" id="portal-history-rows-wrapper">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold uppercase px-2 border-b border-slate-100 pb-1">
                      <span>Période / Semaine</span>
                      <span>Statistiques par période</span>
                    </div>

                    <div className="flex flex-col gap-3" id="portal-history-rows">
                      {activeP.history.map((hist, i) => (
                        <div 
                          key={i} 
                          className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center gap-4 hover:border-slate-200 transition-colors"
                          id={`hist-row-edit-${i}`}
                        >
                          {/* Left: Period Label input */}
                          <div className="flex items-center gap-2 md:w-1/4 shrink-0">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              id={`input-hist-date-${activeP.portalName}-${i}`}
                              type="text"
                              value={hist.date}
                              onChange={(e) => {
                                // Rename period name across ALL portals to keep them aligned
                                const newLabel = e.target.value;
                                const updated = portalStats.map(portal => {
                                  const updatedHistory = portal.history.map((h, hIdx) => {
                                    if (hIdx === i) {
                                      return { ...h, date: newLabel };
                                    }
                                    return h;
                                  });
                                  return { ...portal, history: updatedHistory };
                                });
                                setPortalStats(updated);
                              }}
                              className="w-full bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#00A0E2] px-2.5 py-1.5 rounded-xl text-xs font-black text-slate-800 focus:outline-none"
                            />
                          </div>

                          {/* Right: Numbers Inputs */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1" id={`hist-grid-inputs-${i}`}>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-bold text-slate-400 uppercase font-mono">Vues</span>
                              <input
                                id={`input-hist-views-${activeP.portalName}-${i}`}
                                type="number"
                                min="0"
                                value={hist.views}
                                onChange={(e) => handleHistoryChange(activeP.portalName, i, 'views', parseInt(e.target.value) || 0)}
                                className="bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#00A0E2] px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-800 font-mono focus:outline-none text-right"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-bold text-slate-400 uppercase font-mono">Consultations</span>
                              <input
                                id={`input-hist-detailed-${activeP.portalName}-${i}`}
                                type="number"
                                min="0"
                                value={hist.detailedViews}
                                onChange={(e) => handleHistoryChange(activeP.portalName, i, 'detailedViews', parseInt(e.target.value) || 0)}
                                className="bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#00A0E2] px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-800 font-mono focus:outline-none text-right"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-bold text-[#10B981] uppercase font-mono">Contacts (Leads)</span>
                              <input
                                id={`input-hist-contacts-${activeP.portalName}-${i}`}
                                type="number"
                                min="0"
                                value={hist.contacts}
                                onChange={(e) => handleHistoryChange(activeP.portalName, i, 'contacts', parseInt(e.target.value) || 0)}
                                className="bg-slate-50 border border-emerald-100 focus:bg-white focus:border-[#10B981] px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-[#10B981] font-mono focus:outline-none text-right"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-bold text-pink-500 uppercase font-mono">Révélations Tél.</span>
                              <input
                                id={`input-hist-phones-${activeP.portalName}-${i}`}
                                type="number"
                                min="0"
                                value={hist.phoneClicks}
                                onChange={(e) => handleHistoryChange(activeP.portalName, i, 'phoneClicks', parseInt(e.target.value) || 0)}
                                className="bg-slate-50 border border-pink-100 focus:bg-white focus:border-pink-500 px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-pink-600 font-mono focus:outline-none text-right"
                              />
                            </div>
                          </div>

                          {/* Delete period row */}
                          <button
                            id={`btn-delete-hist-row-${i}`}
                            type="button"
                            onClick={() => handleDeletePeriod(i)}
                            className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 shrink-0 self-end md:self-center cursor-pointer transition-colors"
                            title="Supprimer cette période de tous les réseaux"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-2" id="stats-save-bar">
                <p className="text-[11px] text-slate-400 leading-normal max-w-md">
                  💡 <strong>Indication :</strong> Modifier les chiffres d'une semaine recalcule dynamiquement le total général du portail qui est ensuite diffusé sur l'ensemble de l'estimation.
                </p>

                <button 
                  id="btn-save-portal-stats"
                  type="button"
                  onClick={handleSaveStats}
                  className="flex items-center gap-1.5 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer l'Historique Web</span>
                </button>
              </div>

            </div>
          )}

        </div>

    </div>
  );
}
