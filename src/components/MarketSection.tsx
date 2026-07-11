import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  Calendar,
  Euro,
  Sparkles,
  Search,
  ArrowRight
} from 'lucide-react';
import { marketPriceRanges as defaultMarketPriceRanges, marketHistory, marketDelays } from '../data';

interface MarketSectionProps {
  marketPriceRanges?: {
    low: number;
    median: number;
    high: number;
    currentReferencePrice?: number;
    currentReferencePricePerSqm?: number;
  };
  propertySize?: number;
}

export default function MarketSection({ marketPriceRanges: propMarketPriceRanges, propertySize }: MarketSectionProps) {
  const [valuationMode, setValuationMode] = useState<'sqm' | 'total'>('sqm');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);
  const [selectedDelayProfile, setSelectedDelayProfile] = useState<'fast' | 'median' | 'slow'>('median');

  const sizeToDisplay = propertySize || 125;
  const activeMarketPriceRanges = propMarketPriceRanges || defaultMarketPriceRanges;

  // Values calculated based on sqm price range
  const lowTotal = activeMarketPriceRanges.low * sizeToDisplay;
  const medianTotal = activeMarketPriceRanges.median * sizeToDisplay;
  const highTotal = activeMarketPriceRanges.high * sizeToDisplay;

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  // SVG Chart Dimensions & Computations
  const width = 600;
  const height = 220;
  const paddingX = 50;
  const paddingY = 30;

  const minVal = 2000;
  const maxVal = 6000;

  const getX = (index: number) => {
    return paddingX + (index * (width - paddingX * 2)) / (marketHistory.length - 1);
  };

  const getY = (price: number) => {
    return height - paddingY - ((price - minVal) * (height - paddingY * 2)) / (maxVal - minVal);
  };

  // Generate SVG Points
  const medianPoints = marketHistory.map((item, i) => `${getX(i)},${getY(item.medianPrice)}`).join(' ');
  const highPoints = marketHistory.map((item, i) => `${getX(i)},${getY(item.highPrice)}`).join(' ');
  const lowPoints = marketHistory.map((item, i) => `${getX(i)},${getY(item.lowPrice)}`).join(' ');

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="market-section-container">
      {/* Search Criteria Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="market-search-bar">
        <div className="flex items-center gap-3" id="search-criteria-indicator">
          <div className="p-2.5 bg-[#00A0E2]/10 text-[#00A0E2] rounded-xl shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Critères de l'étude locale</span>
            <p className="text-sm font-extrabold text-slate-800">Maison de 5 pièces et + • Secteur Marseille 11e</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl" id="valuation-mode-tabs">
          <button
            id="btn-val-mode-sqm"
            onClick={() => setValuationMode('sqm')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              valuationMode === 'sqm' 
                ? 'bg-[#00A0E2] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Prix au m²
          </button>
          <button
            id="btn-val-mode-total"
            onClick={() => setValuationMode('total')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              valuationMode === 'total' 
                ? 'bg-[#00A0E2] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Estimation totale (125m²)
          </button>
        </div>
      </div>

      {/* Main Split Grid: Price Ranges & Delays */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="market-split-grid">
        
        {/* Left Hand: Range Visuals (lg:col-span-12 or similar, let's stack them gracefully) */}
        {/* Price Ranges Bento Card */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-6" id="market-ranges-card">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-wider">Fourchette des prix de vente</span>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Analyse des prix pratiqués sur le secteur</h3>
            <p className="text-xs text-slate-500">Données issues des transactions réelles publiées au T2 2026.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="ranges-slider-grid">
            {/* Low Range */}
            <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100 flex flex-col gap-1.5 hover:shadow-md transition-shadow relative overflow-hidden group" id="market-range-low">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Fourchette Basse</span>
              <p className="text-2xl font-black text-slate-800">
                {valuationMode === 'sqm' ? `${activeMarketPriceRanges.low} €/m²` : formatEuro(lowTotal)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {valuationMode === 'sqm' 
                  ? "Correspond aux biens nécessitant d'importants travaux de rénovation ou ayant des défauts majeurs."
                  : `Valeur estimée de ${formatEuro(lowTotal)} pour ${sizeToDisplay} m² habitables.`}
              </p>
              <div className="absolute right-4 bottom-4 w-1.5 h-8 bg-amber-400 rounded-full opacity-60 group-hover:scale-y-110 transition-transform origin-bottom" />
            </div>

            {/* Median Range (Main highlight) */}
            <div className="bg-[#00A0E2]/5 rounded-2xl p-5 border border-[#00A0E2]/20 flex flex-col gap-1.5 hover:shadow-md transition-shadow relative overflow-hidden group" id="market-range-median">
              <div className="absolute top-4 right-4 bg-[#00A0E2] text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">Médian</div>
              <span className="text-[9px] text-[#00A0E2] font-bold uppercase tracking-wider font-mono">Prix Médian du Marché</span>
              <p className="text-3xl font-black text-[#00A0E2]">
                {valuationMode === 'sqm' ? `${activeMarketPriceRanges.median} €/m²` : formatEuro(medianTotal)}
              </p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">
                {valuationMode === 'sqm' 
                  ? "Le juste milieu pour un bien standard dans le secteur, prêt à vivre et avec prestations courantes."
                  : `Valeur théorique de ${formatEuro(medianTotal)} pour ${sizeToDisplay} m² habitables.`}
              </p>
              <div className="absolute right-4 bottom-4 w-1.5 h-12 bg-[#00A0E2] rounded-full opacity-80 group-hover:scale-y-110 transition-transform origin-bottom" />
            </div>

            {/* High Range */}
            <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100 flex flex-col gap-1.5 hover:shadow-md transition-shadow relative overflow-hidden group" id="market-range-high">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Fourchette Haute</span>
              <p className="text-2xl font-black text-slate-800">
                {valuationMode === 'sqm' ? `${activeMarketPriceRanges.high} €/m²` : formatEuro(highTotal)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {valuationMode === 'sqm' 
                  ? "Concerne les maisons d'exception, d'architecte, de plain pied parfait, ou avec prestations très haut de gamme."
                  : `Valeur haute estimée à ${formatEuro(highTotal)} pour ${sizeToDisplay} m².`}
              </p>
              <div className="absolute right-4 bottom-4 w-1.5 h-8 bg-emerald-400 rounded-full opacity-60 group-hover:scale-y-110 transition-transform origin-bottom" />
            </div>
          </div>
        </div>
      </div>

      {/* Evolution over time SVG Chart & Sale delays block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="market-dynamics-grid">
        
        {/* Left Column: Price Index Over 24 Months Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4" id="market-chart-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2" id="chart-header">
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#00A0E2]" />
                Évolution des prix immobiliers
              </h4>
              <p className="text-[11px] text-slate-400">Historique trimestriel médian et bandes de prix (T2 2022 à T2 2026).</p>
            </div>
            
            {/* Chart legend indicators */}
            <div className="flex items-center gap-3.5 text-[10px] font-bold font-mono text-slate-500" id="chart-legend">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Bas/Haut
              </span>
              <span className="flex items-center gap-1.5 text-[#00A0E2]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A0E2] inline-block animate-pulse" /> Prix médian
              </span>
            </div>
          </div>

          {/* Interactive Line Chart SVG */}
          <div className="flex-1 relative bg-slate-50 rounded-2xl border border-slate-100 p-4 min-h-[260px] flex items-center justify-center" id="chart-viewport">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full h-full overflow-visible"
              id="market-price-svg-chart"
            >
              {/* Grid Y-Lines */}
              {[2000, 3000, 4000, 5000, 6000].map((val) => (
                <g key={val} id={`grid-y-line-${val}`}>
                  <line 
                    x1={paddingX} 
                    y1={getY(val)} 
                    x2={width - paddingX} 
                    y2={getY(val)} 
                    stroke="#eceff1" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={paddingX - 10} 
                    y={getY(val) + 4} 
                    textAnchor="end" 
                    fill="#90a4ae" 
                    className="text-[9px] font-mono font-bold"
                  >
                    {val} €
                  </text>
                </g>
              ))}

              {/* Shaded Price Band Area between Low and High */}
              <polygon
                points={`
                  ${marketHistory.map((h, i) => `${getX(i)},${getY(h.highPrice)}`).join(' ')} 
                  ${marketHistory.map((h, i) => `${getX(marketHistory.length - 1 - i)},${getY(marketHistory[marketHistory.length - 1 - i].lowPrice)}`).join(' ')}
                `}
                fill="#00A0E2"
                fillOpacity="0.05"
                id="chart-shaded-area"
              />

              {/* Low & High bound lines */}
              <polyline points={highPoints} fill="none" stroke="#cfd8dc" strokeWidth="1" strokeDasharray="3,3" />
              <polyline points={lowPoints} fill="none" stroke="#cfd8dc" strokeWidth="1" strokeDasharray="3,3" />

              {/* Median Line */}
              <polyline 
                points={medianPoints} 
                fill="none" 
                stroke="#00A0E2" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                id="chart-median-line"
              />

              {/* Interactive mouse guides or data nodes */}
              {marketHistory.map((item, i) => {
                const isHovered = hoveredDataPoint === i;
                return (
                  <g key={item.quarter} id={`data-node-group-${i}`}>
                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line 
                        x1={getX(i)} 
                        y1={paddingY} 
                        x2={getX(i)} 
                        y2={height - paddingY} 
                        stroke="#00A0E2" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4" 
                      />
                    )}

                    {/* Interactive hover target node */}
                    <circle 
                      cx={getX(i)} 
                      cy={getY(item.medianPrice)} 
                      r={isHovered ? 8 : 4.5} 
                      fill={isHovered ? '#00A0E2' : '#ffffff'} 
                      stroke="#00A0E2" 
                      strokeWidth={isHovered ? 3 : 2.5} 
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredDataPoint(i)}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                    />

                    {/* Static labels for main markers (T2 intervals) to prevent clutter */}
                    {(item.quarter.includes('T2') || isHovered) && (
                      <text 
                        x={getX(i)} 
                        y={height - paddingY + 16} 
                        textAnchor="middle" 
                        fill={isHovered ? '#00A0E2' : '#78909c'} 
                        className={`text-[9px] font-mono font-bold ${isHovered ? 'scale-110' : ''}`}
                      >
                        {item.quarter}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Custom Interactive Tooltip Element */}
            {hoveredDataPoint !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs flex flex-col gap-1 min-w-[180px] z-10"
                id="chart-live-tooltip"
              >
                <div className="flex justify-between items-center border-b border-slate-800 pb-1" id="tooltip-header">
                  <span className="font-bold text-[#00A0E2] font-mono">{marketHistory[hoveredDataPoint].quarter}</span>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                    marketHistory[hoveredDataPoint].changePercent > 0 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {marketHistory[hoveredDataPoint].changePercent > 0 ? '+' : ''}
                    {marketHistory[hoveredDataPoint].changePercent}%
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 mt-1" id="tooltip-metrics">
                  <div className="flex justify-between text-slate-400" id="tooltip-sqm">
                    <span>Prix Médian :</span>
                    <span className="font-bold text-white font-mono">{marketHistory[hoveredDataPoint].medianPrice} €/m²</span>
                  </div>
                  <div className="flex justify-between text-slate-400" id="tooltip-total">
                    <span>Val. (125m²) :</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {formatEuro(marketHistory[hoveredDataPoint].medianPrice * propertySize)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Time Delays Dial (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5 justify-between" id="market-delays-card">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00A0E2]" />
              Délais moyen de vente
            </h4>
            <p className="text-xs text-slate-500">Combien de temps faut-il pour vendre votre maison dans Marseille 11e ?</p>
          </div>

          {/* Interactive dial profile tabs */}
          <div className="flex flex-col gap-2.5 my-3" id="delays-profile-selector">
            
            {/* Fast 6 days */}
            <button
              id="btn-delay-fast"
              onClick={() => setSelectedDelayProfile('fast')}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                selectedDelayProfile === 'fast' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-sm' 
                  : 'bg-slate-50/40 hover:bg-slate-50 border-slate-100 text-slate-600'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold font-mono text-emerald-600">PROPRIÉTÉ TRÈS RECHERCHÉE</span>
                <span className="font-extrabold">Les 10% les plus rapides</span>
              </div>
              <span className="text-lg font-black text-emerald-700 font-mono">6 jours</span>
            </button>

            {/* Median 100 days */}
            <button
              id="btn-delay-median"
              onClick={() => setSelectedDelayProfile('median')}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                selectedDelayProfile === 'median' 
                  ? 'bg-[#00A0E2]/5 border-[#00A0E2]/20 text-slate-900 shadow-sm' 
                  : 'bg-slate-50/40 hover:bg-slate-50 border-slate-100 text-slate-600'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold font-mono text-[#00A0E2]">PRIX PARFAIT DE MARCHÉ</span>
                <span className="font-extrabold">Durée moyenne d'une transaction</span>
              </div>
              <span className="text-lg font-black text-[#00A0E2] font-mono">100 jours</span>
            </button>

            {/* Slow 364 days */}
            <button
              id="btn-delay-slow"
              onClick={() => setSelectedDelayProfile('slow')}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                selectedDelayProfile === 'slow' 
                  ? 'bg-amber-50 border-amber-200 text-amber-950 shadow-sm' 
                  : 'bg-slate-50/40 hover:bg-slate-50 border-slate-100 text-slate-600'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold font-mono text-amber-600">PRIX SURESTIMÉ OU DÉFAUTS</span>
                <span className="font-extrabold">Les 10% les plus lentes</span>
              </div>
              <span className="text-lg font-black text-amber-700 font-mono">364 jours</span>
            </button>

          </div>

          {/* Expert tip explanation based on selected profile */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-3 text-slate-700" id="delay-profile-explainer">
            <Sparkles className="w-5 h-5 text-[#00A0E2] shrink-0" />
            <div className="flex flex-col gap-0.5 text-[11px] leading-relaxed">
              <span className="font-bold text-slate-800 uppercase font-mono">
                {selectedDelayProfile === 'fast' ? "L'effet d'urgence (6j)" : selectedDelayProfile === 'median' ? "Le rythme normal (100j)" : "Le risque de gel (364j)"}
              </span>
              <span>
                {selectedDelayProfile === 'fast' 
                  ? "Une vente en moins de 10 jours s'explique par un prix particulièrement attractif ou un coup de cœur absolu d'un acheteur solvable (souvent sans condition de prêt suspensive)." 
                  : selectedDelayProfile === 'median' 
                    ? "C'est le délai d'instruction standard : publication, visites qualifiées, négociation, signature du compromis et obtention du crédit bancaire par l'acquéreur." 
                    : "Un délai approchant l'année indique presque toujours une surestimation initiale du bien. Le bien est alors qualifié de 'brûlé' sur les portails d'annonces, nécessitant des baisses de prix successives."}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
