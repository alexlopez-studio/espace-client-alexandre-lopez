import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Euro, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  Award, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { competitorProperties } from '../data';

interface PositioningSectionProps {
  referencePrice?: number;
  propertySize?: number;
}

export default function PositioningSection({ referencePrice = 400000, propertySize = 125 }: PositioningSectionProps) {
  const [targetPrice, setTargetPrice] = useState<number>(referencePrice);

  useEffect(() => {
    setTargetPrice(referencePrice);
  }, [referencePrice]);

  const targetPricePerSqm = useMemo(() => {
    return Math.round(targetPrice / propertySize);
  }, [targetPrice, propertySize]);

  // Compute stats dynamically based on simulator price!
  const stats = useMemo(() => {
    const totalCompetitors = competitorProperties.length;
    let cheaperCount = 0;
    let largerCount = 0;
    let cheaperAndLargerCount = 0;

    competitorProperties.forEach(prop => {
      // Skip reference item which represents "Votre bien"
      if (prop.id === 'prop-2') return;

      const isCheaper = prop.price < targetPrice;
      const isLarger = prop.surface > propertySize;

      if (isCheaper) cheaperCount++;
      if (isLarger) largerCount++;
      if (isCheaper && isLarger) cheaperAndLargerCount++;
    });

    const pctCheaper = Math.round((cheaperCount / (totalCompetitors - 1)) * 100);
    const pctLarger = Math.round((largerCount / (totalCompetitors - 1)) * 100);
    const pctCheaperAndLarger = Math.round((cheaperAndLargerCount / (totalCompetitors - 1)) * 100);

    // Calculate ranking of target price per sqm among competitors
    // Sort all competitor sqm prices (excluding prop-2) and insert our target price per sqm
    const competitorSqmPrices = competitorProperties
      .filter(p => p.id !== 'prop-2')
      .map(p => Math.round(p.price / p.surface));
    
    competitorSqmPrices.push(targetPricePerSqm);
    competitorSqmPrices.sort((a, b) => a - b);
    
    // Find index of our simulated sqm price in sorted list (1-indexed)
    const rank = competitorSqmPrices.indexOf(targetPricePerSqm) + 1;

    // Estimate delay to sell based on ranking percent
    let estimatedDelay = "45 - 90 jours";
    let delayColor = "text-[#00A0E2]";
    let delayBg = "bg-[#00A0E2]/10";
    let adviceText = "Prix de marché idéal. Le bien présente une forte attractivité tout en restant réaliste.";
    let adviceIcon = Lightbulb;
    let adviceIconColor = "text-[#00A0E2]";

    const rankPercent = rank / competitorSqmPrices.length;
    if (rankPercent <= 0.15) {
      estimatedDelay = "6 - 15 jours";
      delayColor = "text-emerald-700";
      delayBg = "bg-emerald-100/60";
      adviceText = "Prix d'appel ultra-compétitif. Risque fort de provoquer un effet coup de cœur immédiat avec offres multiples.";
      adviceIcon = Award;
      adviceIconColor = "text-emerald-600";
    } else if (rankPercent > 0.75) {
      estimatedDelay = "180 - 364 jours";
      delayColor = "text-rose-700";
      delayBg = "bg-rose-100/60";
      adviceText = "Attention : Prix trop élevé par rapport à la concurrence. Risque fort de stagner et de dévaluer l'attrait du bien.";
      adviceIcon = AlertTriangle;
      adviceIconColor = "text-rose-600";
    }

    return {
      pctCheaper,
      pctLarger,
      pctCheaperAndLarger,
      rank,
      totalCount: competitorSqmPrices.length,
      estimatedDelay,
      delayColor,
      delayBg,
      adviceText,
      adviceIcon,
      adviceIconColor
    };
  }, [targetPrice, targetPricePerSqm]);

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  // Scatter plot points (normalized coordinates)
  // X-axis: Surface (90m² to 150m²)
  // Y-axis: Price (320k€ to 600k€)
  const minX = 90;
  const maxX = 150;
  const minY = 320000;
  const maxY = 600000;

  const getScatterX = (surf: number) => {
    return 40 + ((surf - minX) / (maxX - minX)) * 320;
  };

  const getScatterY = (p: number) => {
    return 180 - ((p - minY) / (maxY - minY)) * 140;
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="positioning-section-container">
      
      {/* Simulation Workspace Panel */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white p-6 lg:p-8 rounded-3xl shadow-lg border border-slate-800 flex flex-col gap-6" id="simulator-workspace-panel">
        
        {/* Header inside workspace */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="simulator-header">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-4 h-4 animate-pulse" />
              Simulateur de Positionnement Commercial
            </span>
            <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">Ajustez le prix de vente pour simuler votre positionnement</h2>
            <p className="text-xs text-slate-300">Modifiez la réglette ci-dessous pour analyser instantanément l'impact de votre stratégie tarifaire.</p>
          </div>
          
          {/* Dynamic Price Display */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-700 flex flex-col items-end min-w-[180px]" id="simulator-value-display">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Prix de vente simulé</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{formatEuro(targetPrice)}</span>
            <span className="text-[10px] text-slate-400 font-mono">{targetPricePerSqm} € / m²</span>
          </div>
        </div>

        {/* Big Premium Slider */}
        <div className="bg-slate-950/30 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4 mt-1" id="simulator-slider-box">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-400" id="slider-limits">
            <span>Option Basse : 350 000 €</span>
            <span>Cible médiane d'expert : 410 000 €</span>
            <span>Option Haute : 530 000 €</span>
          </div>
          
          <input
            id="price-range-slider"
            type="range"
            min={350000}
            max={530000}
            step={5000}
            value={targetPrice}
            onChange={(e) => setTargetPrice(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00A0E2] focus:outline-none"
          />

          <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 mt-1" id="simulator-interactive-rank">
            <span className="font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#00A0E2]" />
              Classement prix/m² :
            </span>
            <span className="font-black font-mono text-white text-sm">
              {stats.rank}ème moins cher sur {stats.totalCount} biens
            </span>
          </div>
        </div>

        {/* Simulated Impact Outputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-2" id="simulator-outputs-grid">
          
          {/* Delays Estimate */}
          <div className={`p-4 rounded-2xl border flex flex-col gap-1 ${stats.delayBg} border-slate-700/40`} id="output-delay">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Délai estimé de vente</span>
            <span className={`text-xl font-black font-mono ${stats.delayColor}`}>{stats.estimatedDelay}</span>
          </div>

          {/* Cheaper % */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 flex flex-col gap-1" id="output-pct-cheaper">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Plus abordable que</span>
            <span className="text-xl font-black font-mono text-white">{100 - stats.pctCheaper}%</span>
            <span className="text-[9px] text-slate-500">des biens concurrents du secteur</span>
          </div>

          {/* Cheaper & Larger % */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 flex flex-col gap-1" id="output-pct-larger">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Biens moins chers & plus grands</span>
            <span className="text-xl font-black font-mono text-amber-400">{stats.pctCheaperAndLarger}%</span>
            <span className="text-[9px] text-slate-500">du marché local (avantage concurrentiel)</span>
          </div>

          {/* Dynamic Advisor Advice */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 flex items-start gap-3 md:col-span-1" id="output-advisor-tip">
            {React.createElement(stats.adviceIcon, { className: `w-5 h-5 shrink-0 ${stats.adviceIconColor} mt-0.5` })}
            <div className="flex flex-col gap-0.5 text-[10px] leading-relaxed text-slate-300">
              <span className="font-bold text-white uppercase font-mono">Conseil commercial</span>
              <span>{stats.adviceText}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Graphical Chart Visualizers based on SIMULATED PRICE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="simulator-visuals-grid">
        
        {/* Left Visual: Competitive Scatter Plot (Price vs Surface) (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4" id="scatter-plot-card">
          <div className="flex justify-between items-center" id="scatter-header">
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#00A0E2]" />
                Cartographie de la concurrence locale
              </h4>
              <p className="text-[10px] text-slate-400">Positionnement de votre bien par rapport au marché (Prix / Surface habitable).</p>
            </div>
          </div>

          {/* Custom scatter plot inside responsive view box */}
          <div className="flex-1 min-h-[220px] bg-slate-50 rounded-2xl border border-slate-100 relative p-4 flex items-center justify-center" id="scatter-plot-viewport">
            <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible" id="scatter-svg">
              {/* Axes lines */}
              <line x1="40" y1="180" x2="380" y2="180" stroke="#b0bec5" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="180" stroke="#b0bec5" strokeWidth="1.5" />

              {/* Grid axes texts */}
              <text x="380" y="195" textAnchor="end" fill="#78909c" className="text-[8px] font-mono font-bold">Surface habitable (m²)</text>
              <text x="35" y="15" textAnchor="start" fill="#78909c" className="text-[8px] font-mono font-bold">Prix de vente (€)</text>

              {/* Surface scale ticks (90m², 110m², 130m², 150m²) */}
              {[90, 110, 130, 150].map(s => (
                <g key={s}>
                  <line x1={getScatterX(s)} y1="180" x2={getScatterX(s)} y2="176" stroke="#78909c" />
                  <text x={getScatterX(s)} y="190" textAnchor="middle" fill="#78909c" className="text-[7px] font-mono">{s}m²</text>
                </g>
              ))}

              {/* Price scale ticks (350k, 450k, 550k) */}
              {[350000, 450000, 550000].map(p => (
                <g key={p}>
                  <line x1="40" y1={getScatterY(p)} x2="44" y2={getScatterY(p)} stroke="#78909c" />
                  <text x="35" y={getScatterY(p) + 2} textAnchor="end" fill="#78909c" className="text-[7px] font-mono">{p / 1000}k€</text>
                </g>
              ))}

              {/* Competitors circles */}
              {competitorProperties.map((comp) => {
                // Skip the simulated reference property, we render it specifically below
                if (comp.id === 'prop-2') return null;
                return (
                  <circle
                    key={comp.id}
                    cx={getScatterX(comp.surface)}
                    cy={getScatterY(comp.price)}
                    r="4"
                    fill={comp.status === 'vendu' ? '#94a3b8' : '#38bdf8'}
                    fillOpacity="0.6"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    className="cursor-pointer hover:r-6 hover:fill-slate-800 transition-all"
                    id={`scatter-node-${comp.id}`}
                  >
                    <title>{comp.title} - {formatEuro(comp.price)}</title>
                  </circle>
                );
              })}

              {/* SIMULATED PROPERTY ELEMENT (Your property) */}
              <motion.g
                id="scatter-interactive-marker"
                animate={{
                  x: getScatterX(propertySize),
                  y: getScatterY(targetPrice)
                }}
                transition={{ type: 'spring', damping: 20 }}
              >
                {/* Radar effect */}
                <circle cx="0" cy="0" r="14" fill="#00A0E2" fillOpacity="0.15" className="animate-ping" />
                <circle cx="0" cy="0" r="7" fill="#00A0E2" stroke="#ffffff" strokeWidth="1.5" className="shadow" />
                {/* Pointer card pointing up */}
                <foreignObject x="-45" y="-36" width="90" height="28">
                  <div className="bg-slate-900 text-white rounded px-1.5 py-0.5 border border-slate-700 text-center text-[7px] font-bold leading-none flex flex-col justify-center h-full shadow-md">
                    <span>VOTRE BIEN</span>
                    <span className="text-emerald-400 font-mono mt-0.5">{formatEuro(targetPrice)}</span>
                  </div>
                </foreignObject>
              </motion.g>

            </svg>
          </div>

          <div className="flex gap-4 justify-center text-[9px] font-mono font-bold text-slate-500 mt-1" id="scatter-legend">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#38bdf8] rounded-full inline-block" /> Actifs en vente</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#94a3b8] rounded-full inline-block" /> Biens récemment vendus</span>
            <span className="flex items-center gap-1 text-[#00A0E2]"><span className="w-2.5 h-2.5 bg-[#00A0E2] rounded-full inline-block animate-pulse" /> Votre bien (Simulé)</span>
          </div>

        </div>

        {/* Right Visual: Threshold comparison meters (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 justify-between" id="thresholds-comparison-card">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
              Ajustement selon les seuils de vente
            </h4>
            <p className="text-[10px] text-slate-400">Vérifiez comment se positionne votre prix simulé par rapport aux seuils psychologiques du marché.</p>
          </div>

          {/* Interactive Threshold Progress Bars */}
          <div className="flex flex-col gap-4 my-2" id="thresholds-visuals-list">
            
            {/* Low Threshold < 409,500 */}
            <div className="flex flex-col gap-1" id="threshold-low-meter">
              <div className="flex justify-between text-xs" id="threshold-low-label">
                <span className="text-slate-500 font-semibold">Seuil d'Appel Rapide (Vente éclair)</span>
                <span className="font-extrabold font-mono text-emerald-600">&lt; 409 500 €</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative" id="threshold-low-track">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300" 
                  style={{ width: `${Math.min(100, (targetPrice / 409500) * 100)}%` }} 
                />
                {targetPrice <= 409500 && (
                  <div className="absolute right-4 top-0.5 w-1 h-1 rounded-full bg-white animate-ping" />
                )}
              </div>
            </div>

            {/* Median Threshold = 487,000 */}
            <div className="flex flex-col gap-1" id="threshold-med-meter">
              <div className="flex justify-between text-xs" id="threshold-med-label">
                <span className="text-slate-500 font-semibold">Seuil de Marché Équilibré (Cible)</span>
                <span className="font-extrabold font-mono text-[#00A0E2]">487 000 €</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative" id="threshold-med-track">
                <div 
                  className="h-full bg-[#00A0E2] transition-all duration-300" 
                  style={{ width: `${Math.min(100, (targetPrice / 487000) * 100)}%` }} 
                />
                {targetPrice > 409500 && targetPrice <= 487000 && (
                  <div className="absolute right-4 top-0.5 w-1 h-1 rounded-full bg-white animate-ping" />
                )}
              </div>
            </div>

            {/* High Threshold > 532,250 */}
            <div className="flex flex-col gap-1" id="threshold-high-meter">
              <div className="flex justify-between text-xs" id="threshold-high-label">
                <span className="text-slate-500 font-semibold">Seuil Limite Haute (Risque de gel)</span>
                <span className="font-extrabold font-mono text-rose-600">&gt; 532 250 €</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative" id="threshold-high-track">
                <div 
                  className="h-full bg-rose-500 transition-all duration-300" 
                  style={{ width: `${Math.min(100, (targetPrice / 532250) * 100)}%` }} 
                />
                {targetPrice > 532250 && (
                  <div className="absolute right-4 top-0.5 w-1 h-1 rounded-full bg-white animate-ping" />
                )}
              </div>
            </div>

          </div>

          {/* Simulator status label card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between mt-1" id="thresholds-summary-box">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Statut Stratégique</span>
            <span className={`text-xs font-black font-mono px-3 py-1.5 rounded-full uppercase tracking-wider ${
              targetPrice <= 409500 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                : targetPrice > 532250 
                  ? 'bg-rose-50 text-rose-800 border border-rose-100' 
                  : 'bg-[#00A0E2]/10 text-blue-800 border border-blue-100'
            }`}>
              {targetPrice <= 409500 ? "Vente Éclair" : targetPrice > 532250 ? "Prix Bloquant" : "Marché Équilibré"}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
