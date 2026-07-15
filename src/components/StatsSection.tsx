import React, { useState } from 'react';
import { 
  Eye, 
  MousePointer, 
  MessageSquare, 
  PhoneCall, 
  TrendingUp, 
  Globe, 
  ArrowUpRight,
  Calendar,
  Activity,
  ArrowRight
} from 'lucide-react';
import { PortalStat } from '../types';

interface StatsSectionProps {
  portalStats: PortalStat[];
  onUpdateStats?: (stats: PortalStat[]) => void;
  isAdmin?: boolean;
}

export default function StatsSection({ 
  portalStats, 
  onUpdateStats,
  isAdmin = false 
}: StatsSectionProps) {
  const [selectedPortal, setSelectedPortal] = useState<string>('All');
  const [activeMetric, setActiveMetric] = useState<'views' | 'detailedViews' | 'contacts' | 'phoneClicks'>('views');

  // Selected portal data
  const isAll = selectedPortal === 'All';
  const filteredStats = isAll ? portalStats : portalStats.filter(p => p.portalName === selectedPortal);

  // Computes aggregates
  const totalViews = filteredStats.reduce((acc, p) => acc + p.views, 0);
  const totalDetailedViews = filteredStats.reduce((acc, p) => acc + p.detailedViews, 0);
  const totalContacts = filteredStats.reduce((acc, p) => acc + p.contacts, 0);
  const totalPhoneClicks = filteredStats.reduce((acc, p) => acc + p.phoneClicks, 0);

  // Conversion rates
  const globalClickThrough = totalViews > 0 ? ((totalDetailedViews / totalViews) * 100).toFixed(1) : '0';
  const globalLeadConversion = totalDetailedViews > 0 ? ((totalContacts / totalDetailedViews) * 100).toFixed(1) : '0';

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Define metrics configurations for rendering
  const metricConfigs = {
    views: { 
      label: 'Vues', 
      color: '#00A0E2', 
      gradientId: 'viewsGrad',
      labelFull: 'Vues de recherche', 
      desc: 'Affichage de votre annonce dans les listes de recherche des prospects.',
      icon: Eye,
      iconColor: 'text-indigo-500'
    },
    detailedViews: { 
      label: 'Consultations', 
      color: '#8B5CF6', 
      gradientId: 'detailedViewsGrad',
      labelFull: 'Fiches consultées', 
      desc: 'Visiteurs uniques ayant cliqué pour lire les détails et voir les photos.',
      icon: MousePointer,
      iconColor: 'text-violet-500'
    },
    contacts: { 
      label: 'Contacts', 
      color: '#10B981', 
      gradientId: 'contactsGrad',
      labelFull: 'Demandes de contact', 
      desc: 'Formulaires reçus, appels directs et demandes d\'informations qualifiées.',
      icon: MessageSquare,
      iconColor: 'text-emerald-500'
    },
    phoneClicks: { 
      label: 'Appels', 
      color: '#EC4899', 
      gradientId: 'phoneClicksGrad',
      labelFull: 'Révélations de tél.', 
      desc: 'Prospects ayant cliqué pour découvrir vos coordonnées téléphoniques.',
      icon: PhoneCall,
      iconColor: 'text-pink-500'
    }
  };

  const activeConf = metricConfigs[activeMetric];

  if (portalStats.length === 0) {
    return (
      <div className="w-full flex flex-col gap-6" id="stats-section-root">
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-sm" id="empty-stats-message">
          <Activity className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-xs font-bold text-slate-700">Aucune statistique de diffusion publiée pour le moment</p>
          <p className="mt-1 text-[11px] text-slate-400">Les performances de l’annonce apparaîtront ici après les premiers relevés.</p>
        </div>
      </div>
    );
  }

  // Extract all unique dates/periods in order from first portal
  const periods = portalStats[0]?.history.map(h => h.date) || [];

  // Compute dynamic weekly trends based on selections
  const weeklyTrends = periods.map(period => {
    let views = 0;
    let detailedViews = 0;
    let contacts = 0;
    let phoneClicks = 0;

    portalStats.forEach(p => {
      const hItem = p.history.find(h => h.date === period);
      if (hItem) {
        if (isAll || p.portalName === selectedPortal) {
          views += hItem.views;
          detailedViews += hItem.detailedViews;
          contacts += hItem.contacts;
          phoneClicks += hItem.phoneClicks;
        }
      }
    });

    return {
      label: period,
      views,
      detailedViews,
      contacts,
      phoneClicks
    };
  });

  // Calculate dynamic scale for Y axis
  const maxMetricVal = Math.max(...weeklyTrends.map(t => t[activeMetric]), 5);
  // Round up to nice intervals
  const maxAxisVal = Math.ceil(maxMetricVal * 1.15);

  const chartHeight = 160;
  const chartWidth = 500;

  // Build fluid SVG points for selected metric
  const points = weeklyTrends.map((trend, i) => {
    const x = weeklyTrends.length > 1 ? (i * (chartWidth / (weeklyTrends.length - 1))) : chartWidth / 2;
    const y = chartHeight - (trend[activeMetric] / maxAxisVal) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = weeklyTrends.length > 1 
    ? `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`
    : `0,${chartHeight} ${chartWidth / 2},${chartHeight - (weeklyTrends[0]?.[activeMetric] / maxAxisVal) * chartHeight} ${chartWidth},${chartHeight}`;

  // Generate dynamic grid labels
  const gridYValues = [
    maxAxisVal,
    Math.round(maxAxisVal * 0.75),
    Math.round(maxAxisVal * 0.5),
    Math.round(maxAxisVal * 0.25),
    0
  ];

  return (
    <div className="w-full flex flex-col gap-6" id="stats-section-root">
      
      {/* 1. Selector Bar: Portal Filtering */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex items-center gap-1 overflow-x-auto shadow-sm" id="stats-portal-filter">
        <button
          id="btn-filter-portal-all"
          onClick={() => setSelectedPortal('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            selectedPortal === 'All' 
              ? 'bg-slate-800 text-white shadow' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80'
          }`}
        >
          Tous les réseaux partenaires
        </button>
        {portalStats.map(portal => (
          <button
            key={portal.portalName}
            id={`btn-filter-portal-${portal.portalName.replace(/\./g, '-')}`}
            onClick={() => setSelectedPortal(portal.portalName)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              selectedPortal === portal.portalName 
                ? 'bg-[#00A0E2] text-white shadow' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80'
            }`}
          >
            {portal.portalName}
          </button>
        ))}
      </div>

      {/* 2. Overview Aggregates Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-aggregates-row">
        
        {/* Total Views */}
        <div 
          onClick={() => setActiveMetric('views')}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm flex items-center gap-4 group ${
            activeMetric === 'views' ? 'border-[#00A0E2] ring-2 ring-[#00A0E2]/10 bg-[#00A0E2]/5' : 'border-slate-100 hover:border-slate-300'
          }`} 
          id="stat-agg-views"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Vues cumulées</span>
            <span className="text-xl font-black text-slate-800 leading-none mt-1 inline-block">{formatNumber(totalViews)}</span>
          </div>
        </div>

        {/* Detailed views / clicks */}
        <div 
          onClick={() => setActiveMetric('detailedViews')}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm flex items-center gap-4 group ${
            activeMetric === 'detailedViews' ? 'border-violet-500 ring-2 ring-violet-500/10 bg-violet-50/30' : 'border-slate-100 hover:border-slate-300'
          }`} 
          id="stat-agg-details"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MousePointer className="w-5 h-5 text-[#00A0E2]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Fiches consultées</span>
            <span className="text-xl font-black text-slate-800 leading-none mt-1 inline-block">{formatNumber(totalDetailedViews)}</span>
          </div>
        </div>

        {/* Leads / Contacts */}
        <div 
          onClick={() => setActiveMetric('contacts')}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm flex items-center gap-4 group ${
            activeMetric === 'contacts' ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-300'
          }`} 
          id="stat-agg-leads"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Contacts (Leads)</span>
            <span className="text-xl font-black text-slate-800 leading-none mt-1 inline-block">{totalContacts}</span>
          </div>
        </div>

        {/* Phone reveals */}
        <div 
          onClick={() => setActiveMetric('phoneClicks')}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm flex items-center gap-4 group ${
            activeMetric === 'phoneClicks' ? 'border-pink-500 ring-2 ring-pink-500/10 bg-pink-50/30' : 'border-slate-100 hover:border-slate-300'
          }`} 
          id="stat-agg-phones"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PhoneCall className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Révélations de tél.</span>
            <span className="text-xl font-black text-slate-800 leading-none mt-1 inline-block">{totalPhoneClicks}</span>
          </div>
        </div>

      </div>

      {/* 3. Split Grid: Interactive Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="stats-layout-split">
        
        {/* Left Col: Custom SVG Trend Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6" id="stats-trend-chart-card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4" id="trend-chart-header">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00A0E2]" />
                Historique de performance de l'annonce
              </h4>
              <p className="text-xs text-slate-500">
                Visualisation de la métrique : <strong className="text-slate-800">{activeConf.labelFull}</strong> sur {isAll ? 'tous les réseaux' : selectedPortal}.
              </p>
            </div>

            {/* Toggleable Metric Selectors */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100/80 items-center gap-0.5" id="metric-selectors-pills">
              {(Object.keys(metricConfigs) as Array<keyof typeof metricConfigs>).map((key) => {
                const conf = metricConfigs[key];
                const isActive = activeMetric === key;
                return (
                  <button
                    key={key}
                    id={`btn-metric-toggle-${key}`}
                    onClick={() => setActiveMetric(key)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white text-slate-800 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Responsive SVG Graphic Container */}
          <div className="w-full bg-slate-50/50 p-5 rounded-2xl border border-slate-100/60" id="svg-trend-chart-wrapper">
            <div className="relative w-full h-[180px]" id="svg-trend-canvas-container">
              
              {/* Dynamic Grid Y-Lines and labels */}
              <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none z-0" id="chart-y-grid-lines">
                {gridYValues.map((val, index) => (
                  <div key={index} className="w-full border-t border-slate-200/30 relative">
                    <span className="absolute left-1 -top-2 text-[8px] text-slate-400 font-bold">
                      {formatNumber(val)} {activeConf.label.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>

              {/* The SVG element itself, made completely fluid */}
              {weeklyTrends.length > 0 && (
                <svg 
                  className="w-full h-full absolute inset-0 z-10" 
                  viewBox={`0 -10 ${chartWidth} ${chartHeight + 20}`}
                  preserveAspectRatio="none"
                >
                  {/* Area Gradient fill */}
                  <polygon 
                    points={areaPoints} 
                    fill={`url(#${activeConf.gradientId})`} 
                    opacity="0.1" 
                  />

                  {/* Line Path */}
                  <polyline 
                    fill="none" 
                    stroke={activeConf.color} 
                    strokeWidth="3.5" 
                    points={points} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots on points with hover ring effect */}
                  {weeklyTrends.map((trend, i) => {
                    const cx = weeklyTrends.length > 1 ? (i * (chartWidth / (weeklyTrends.length - 1))) : chartWidth / 2;
                    const cy = chartHeight - (trend[activeMetric] / maxAxisVal) * chartHeight;
                    return (
                      <g key={i} className="group/dot cursor-pointer">
                        <circle cx={cx} cy={cy} r="5.5" fill={activeConf.color} stroke="#fff" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r="9" fill="transparent" stroke={activeConf.color} strokeWidth="1.5" className="opacity-0 group-hover/dot:opacity-100 transition-opacity" />
                        
                        {/* Inline tooltip on hover */}
                        <foreignObject x={cx - 30} y={cy - 35} width="60" height="24" className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="bg-slate-800 text-white text-[9px] font-extrabold rounded px-1 py-0.5 text-center shadow-lg leading-tight">
                            {trend[activeMetric]}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}

                  {/* Definitions for gradient */}
                  <defs>
                    <linearGradient id={activeConf.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeConf.color} />
                      <stop offset="100%" stopColor={activeConf.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* X-axis labels aligned with columns */}
              <div className="absolute inset-x-0 bottom-0 h-5 flex justify-between text-[10px] text-slate-400 font-bold px-1 pointer-events-none" id="chart-x-labels">
                {weeklyTrends.map((trend, i) => (
                  <span key={i}>{trend.label}</span>
                ))}
              </div>

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4" id="stats-trends-foot">
            <div className="flex flex-col animate-fade-in" id="trend-foot-clicks">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Ratios de consultation</span>
              <span className="text-base font-black text-slate-800 mt-0.5">{globalClickThrough}%</span>
              <p className="text-[10px] text-slate-400 leading-snug mt-0.5">Pourcentage de vues qui se transforment en consultations de la fiche.</p>
            </div>
            <div className="flex flex-col animate-fade-in" id="trend-foot-conv">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Taux de conversion contact</span>
              <span className="text-base font-black text-emerald-600 mt-0.5">{globalLeadConversion}%</span>
              <p className="text-[10px] text-slate-400 leading-snug mt-0.5">Pourcentage de consultations fiches qui débouchent sur un message ou appel.</p>
            </div>
          </div>

        </div>

        {/* Right Col: Portal Performance Distribution (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5 justify-between" id="stats-distribution-card">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">Efficacité des canaux</h4>
            <p className="text-xs text-slate-500 font-medium">Répartition globale du trafic accumulé.</p>
          </div>

          {/* Simple distribution bars */}
          <div className="flex flex-col gap-4 flex-1 justify-center mt-2" id="distribution-bars-list">
            {portalStats.map((portal) => {
              // Calculate percent compared to sum views
              const totalAllViews = portalStats.reduce((acc, p) => acc + p.views, 0);
              const viewPercent = totalAllViews > 0 ? Math.round((portal.views / totalAllViews) * 100) : 0;
              
              return (
                <div key={portal.portalName} className="flex flex-col gap-1.5" id={`dist-bar-${portal.portalName}`}>
                  <div className="flex justify-between items-center text-xs text-slate-700" id={`dist-info-${portal.portalName}`}>
                    <span className="font-extrabold">{portal.portalName}</span>
                    <span className="text-slate-400">
                      <strong className="text-slate-800 font-black">{formatNumber(portal.views)}</strong> v ({viewPercent}%)
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-50 border border-slate-100/40 rounded-full overflow-hidden flex" id={`dist-bar-wrapper-${portal.portalName}`}>
                    <div 
                      className="bg-[#00A0E2] rounded-full transition-all duration-500" 
                      style={{ width: `${viewPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold" id={`dist-metrics-${portal.portalName}`}>
                    <span>{portal.contacts} lead{portal.contacts > 1 ? 's' : ''}</span>
                    <span className="text-[#00A0E2]">Index: {portal.performanceIndex}/100</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 text-[11px] leading-relaxed text-slate-600 mt-2 flex gap-2" id="stats-distribution-footer">
            <Globe className="w-4 h-4 text-[#00A0E2] shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800 font-bold block mb-0.5">Diffusion Multi-Réseaux iad</strong>
              Cette synergie maximise les chances de capter l'intérêt d'acheteurs d'autres secteurs géographiques.
            </span>
          </div>

        </div>

      </div>

      {/* 4. Full Historical Follow-up Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4" id="stats-history-table-card">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00A0E2]" />
            Suivi Chronologique Hebdomadaire - {selectedPortal === 'All' ? 'Tous les réseaux' : selectedPortal}
          </h4>
          <p className="text-xs text-slate-500">Chiffres précis enregistrés période par période pour analyser la performance à long terme.</p>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl" id="stats-table-wrapper">
          <table className="w-full text-left border-collapse" id="stats-history-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">Période</th>
                <th className="px-5 py-3.5 text-right">Vues de recherche</th>
                <th className="px-5 py-3.5 text-right">Fiches consultées</th>
                <th className="px-5 py-3.5 text-right text-[#00A0E2]">Taux de clic (CTR)</th>
                <th className="px-5 py-3.5 text-right text-emerald-600">Demandes Contacts</th>
                <th className="px-5 py-3.5 text-right text-pink-600">Révélations Tél.</th>
                <th className="px-5 py-3.5 text-right text-indigo-600">Transfo. Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
              {weeklyTrends.map((trend, i) => {
                const ctr = trend.views > 0 ? ((trend.detailedViews / trend.views) * 100).toFixed(1) : '0';
                const conv = trend.detailedViews > 0 ? ((trend.contacts / trend.detailedViews) * 100).toFixed(1) : '0';
                
                return (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors" id={`table-row-${trend.label}`}>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{trend.label}</td>
                    <td className="px-5 py-3.5 text-right text-slate-600">{formatNumber(trend.views)}</td>
                    <td className="px-5 py-3.5 text-right text-slate-600">{formatNumber(trend.detailedViews)}</td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-[#00A0E2]">{ctr}%</td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-emerald-600">+{trend.contacts}</td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-pink-600">+{trend.phoneClicks}</td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-indigo-600">{conv}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Portal Breakdown Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-portal-breakdown-cards">
        {portalStats.map((p) => {
          const portalViews = p.views;
          const portalDetailed = p.detailedViews;
          const portalContacts = p.contacts;
          const portalClicks = p.phoneClicks;
          const portalCTR = portalViews > 0 ? ((portalDetailed / portalViews) * 100).toFixed(1) : '0';
          const portalConv = portalDetailed > 0 ? ((portalContacts / portalDetailed) * 100).toFixed(1) : '0';

          return (
            <div 
              key={p.portalName} 
              id={`portal-card-stats-${p.portalName}`}
              onClick={() => setSelectedPortal(p.portalName)}
              className={`bg-white rounded-2xl p-5 border cursor-pointer shadow-sm flex flex-col gap-4 hover:shadow-md transition-all group ${
                selectedPortal === p.portalName ? 'border-[#00A0E2] ring-2 ring-[#00A0E2]/5' : 'border-slate-100'
              }`}
            >
              <div className="flex justify-between items-center" id={`p-stat-header-${p.portalName}`}>
                <span className="text-xs font-black text-slate-800 group-hover:text-[#00A0E2] transition-colors">{p.portalName}</span>
                <span className="bg-slate-50 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded border border-slate-100">
                  Perf: {p.performanceIndex}/100
                </span>
              </div>

              <div className="bg-slate-50/60 rounded-xl p-3 border border-slate-100 flex justify-between items-center text-xs" id={`p-stat-box-${p.portalName}`}>
                <div className="flex flex-col" id={`p-stat-views-${p.portalName}`}>
                  <span className="text-[9px] text-slate-400 font-bold font-sans">VUES</span>
                  <span className="text-xs font-black text-slate-800">{formatNumber(portalViews)}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col" id={`p-stat-leads-${p.portalName}`}>
                  <span className="text-[9px] text-slate-400 font-bold font-sans">CONTACTS</span>
                  <span className="text-xs font-black text-emerald-600">{portalContacts}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col" id={`p-stat-index-${p.portalName}`}>
                  <span className="text-[9px] text-slate-400 font-bold font-sans">CLICS TÉL</span>
                  <span className="text-xs font-black text-pink-600">{portalClicks}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold" id={`p-stat-footer-${p.portalName}`}>
                <span>CTR: <strong className="text-slate-700 font-black">{portalCTR}%</strong></span>
                <span>Conv.: <strong className="text-slate-700 font-black">{portalConv}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
