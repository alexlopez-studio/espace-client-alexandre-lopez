import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitCompare, 
  MapPin, 
  Layers, 
  Calendar, 
  CheckCircle,
  TrendingDown,
  ChevronRight,
  Sparkles,
  Award,
  Grid,
  Trees,
  Bed,
  Euro
} from 'lucide-react';
import { ComparableProperty, PropertyDetails } from '../types';

interface ComparablesSectionProps {
  soldComparables?: ComparableProperty[];
  propertyDetails?: PropertyDetails;
  referencePrice?: number;
}

export default function ComparablesSection({ soldComparables: propComparables, propertyDetails: propDetails, referencePrice }: ComparablesSectionProps) {
  const activeComparables = propComparables ?? [];
  const activeDetails = propDetails ?? {
    surface: 0,
    rooms: 0,
    floors: 0,
    landSurface: 0,
    bedrooms: 0,
    year: 0,
    address: '',
    description: '',
  };
  const safeReferencePrice = referencePrice ?? 0;

  const [selectedComparable, setSelectedComparable] = useState<ComparableProperty | null>(activeComparables[0] || null);
  const [filterQuery, setFilterQuery] = useState<'all' | 'escourtines' | 'eauxvives' | 'other'>('all');

  useEffect(() => {
    setSelectedComparable(activeComparables[0] || null);
  }, [activeComparables]);

  const referencePricePerSqm = safeReferencePrice && activeDetails.surface ? Math.round(safeReferencePrice / activeDetails.surface) : 0;

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredComparables = activeComparables.filter(comp => {
    if (filterQuery === 'all') return true;
    if (filterQuery === 'escourtines') return comp.address.toLowerCase().includes('escourtines');
    if (filterQuery === 'eauxvives') return comp.address.toLowerCase().includes('eaux vives');
    if (filterQuery === 'other') return !comp.address.toLowerCase().includes('escourtines') && !comp.address.toLowerCase().includes('eaux vives');
    return true;
  });

  // Calculate some average metrics of our selection
  const avgSqmPrice = activeComparables.length > 0 ? Math.round(activeComparables.reduce((acc, c) => acc + c.pricePerSqm, 0) / activeComparables.length) : 0;
  const minSqmPrice = activeComparables.length > 0 ? Math.min(...activeComparables.map(c => c.pricePerSqm)) : 0;
  const maxSqmPrice = activeComparables.length > 0 ? Math.max(...activeComparables.map(c => c.pricePerSqm)) : 0;

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="comparables-section-container">
      
      {/* Title block */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="comparables-header">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-wider">Analyse comparative du marché</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Biens comparables récemment vendus</h2>
          <p className="text-xs text-slate-500">Sélection publiée par votre conseiller depuis Mandat OS.</p>
        </div>
        
        {/* Neighborhood Filter Tags */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-center" id="comparable-filters">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'escourtines', label: 'Secteur A' },
            { id: 'eauxvives', label: 'Secteur B' },
            { id: 'other', label: 'Autres' },
          ].map(tab => (
            <button
              key={tab.id}
              id={`btn-comp-filter-${tab.id}`}
              onClick={() => setFilterQuery(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterQuery === tab.id 
                  ? 'bg-[#00A0E2] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive split view: List on left, Side-by-Side comparison on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="comparables-split-grid">
        
        {/* Left Side: Cards of Comparables (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-3.5 max-h-[560px] overflow-y-auto pr-1" id="comparables-cards-list">
          {filteredComparables.map((comp) => {
            const isSelected = selectedComparable.id === comp.id;
            return (
              <motion.div
                layout
                key={comp.id}
                id={`comparable-card-${comp.id}`}
                onClick={() => setSelectedComparable(comp)}
                className={`cursor-pointer rounded-2xl p-5 border text-xs flex flex-col gap-3.5 transition-all relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-[#00A0E2]/5 border-[#00A0E2] shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border-slate-100'
                }`}
              >
                {/* Sold Tag */}
                <div className="flex justify-between items-start" id="comp-card-header">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-white text-[9px] font-black font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Vendu
                    </span>
                    {comp.underCompromise && (
                      <span className="bg-amber-500 text-white text-[9px] font-black font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Sous compromis
                      </span>
                    )}
                    <span className="text-slate-400 font-bold font-mono text-[10px]">{comp.soldDate}</span>
                  </div>
                  <span className="text-base font-extrabold text-slate-800 font-mono">
                    {formatEuro(comp.price)}
                  </span>
                </div>

                <div className="flex flex-col gap-1" id="comp-card-desc">
                  <h4 className="text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-[#00A0E2] transition-colors">
                    {comp.title}
                  </h4>
                  <p className="text-slate-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-300" />
                    <span>{comp.address}</span>
                  </p>
                </div>

                {/* Badges/Specs summary */}
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3" id="comp-card-specs">
                  <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-bold font-mono text-[10px]">
                    {comp.surface} m²
                  </span>
                  <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-bold font-mono text-[10px]">
                    Terrain {comp.landSurface} m²
                  </span>
                  <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-bold font-mono text-[10px]">
                    {comp.rooms} p.
                  </span>
                  <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-bold font-mono text-[10px]">
                    {comp.bedrooms} ch.
                  </span>
                  <span className="bg-[#00A0E2]/10 text-[#00A0E2] ml-auto px-2.5 py-1 rounded-lg font-extrabold font-mono text-[10px]">
                    {comp.pricePerSqm} €/m²
                  </span>
                </div>

                {/* Selected arrow indicator */}
                {isSelected && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#00A0E2] rounded-l-full" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Interactive Matrix Comparison (lg:col-span-5) */}
        <div className="lg:col-span-5" id="comparables-matrix-comparison">
          <AnimatePresence mode="wait">
            {selectedComparable && (
              <motion.div
                key={selectedComparable.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5 h-full justify-between"
                id="comparisons-pane"
              >
                <div className="flex flex-col gap-1.5" id="comp-pane-header">
                  <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-widest flex items-center gap-1">
                    <GitCompare className="w-3.5 h-3.5" />
                    Comparateur d'actifs
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                    Votre bien VS {selectedComparable.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">Analyse détaillée de l'écart de valeur technique.</p>
                </div>

                {/* Structured comparison grid */}
                <div className="flex-1 flex flex-col gap-2.5 my-3" id="comp-table-body">
                  
                  {/* Row: Surface */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-slate-50 text-xs" id="row-surface">
                    <div className="text-slate-500 font-semibold">Surface</div>
                    <div className="text-slate-400 font-mono">Votre bien : <span className="font-extrabold text-slate-700">{activeDetails.surface}m²</span></div>
                    <div className="text-right font-mono font-bold text-slate-800">
                      {selectedComparable.surface}m² 
                      <span className={`ml-1.5 text-[10px] ${
                        activeDetails.surface > selectedComparable.surface ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        ({activeDetails.surface > selectedComparable.surface ? '+' : ''}{activeDetails.surface - selectedComparable.surface}m²)
                      </span>
                    </div>
                  </div>

                  {/* Row: Terrain */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-slate-50 text-xs" id="row-terrain">
                    <div className="text-slate-500 font-semibold">Terrain</div>
                    <div className="text-slate-400 font-mono">Votre bien : <span className="font-extrabold text-slate-700">{activeDetails.landSurface}m²</span></div>
                    <div className="text-right font-mono font-bold text-slate-800">
                      {selectedComparable.landSurface}m²
                      <span className={`ml-1.5 text-[10px] ${
                        activeDetails.landSurface > selectedComparable.landSurface ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        ({activeDetails.landSurface > selectedComparable.landSurface ? '+' : ''}{activeDetails.landSurface - selectedComparable.landSurface}m²)
                      </span>
                    </div>
                  </div>

                  {/* Row: Pièces */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-slate-50 text-xs" id="row-rooms">
                    <div className="text-slate-500 font-semibold">Pièces / Ch.</div>
                    <div className="text-slate-400 font-mono">Votre bien : <span className="font-extrabold text-slate-700">{activeDetails.rooms}p / {activeDetails.bedrooms}ch</span></div>
                    <div className="text-right font-mono font-bold text-slate-800">
                      {selectedComparable.rooms}p / {selectedComparable.bedrooms}ch
                    </div>
                  </div>

                  {/* Row: Price */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-slate-50 text-xs" id="row-price">
                    <div className="text-slate-500 font-semibold">Prix de vente</div>
                    <div className="text-slate-400 font-mono font-medium">Référence : <span className="font-extrabold text-slate-700">{Math.round(safeReferencePrice / 1000)}k €</span></div>
                    <div className="text-right font-mono font-bold text-[#00A0E2]">
                      {formatEuro(selectedComparable.price)}
                    </div>
                  </div>

                  {/* Row: Price/sqm */}
                  <div className="grid grid-cols-3 items-center py-2 border-b border-slate-50 text-xs" id="row-price-sqm">
                    <div className="text-slate-500 font-semibold">Prix au m²</div>
                    <div className="text-slate-400 font-mono">Référence : <span className="font-extrabold text-slate-700">{new Intl.NumberFormat('fr-FR').format(referencePricePerSqm)} €</span></div>
                    <div className="text-right font-mono font-black text-slate-800">
                      {selectedComparable.pricePerSqm} €/m²
                    </div>
                  </div>

                </div>

                {/* Professional analytical observation */}
                <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex gap-3 text-[11px] leading-relaxed text-slate-700" id="comp-analysis-box">
                  <Sparkles className="w-4 h-4 text-[#00A0E2] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block uppercase font-mono">Note comparative d'expert</span>
                    <span>
                      {selectedComparable.pricePerSqm > referencePricePerSqm 
                        ? `Le bien situé ${selectedComparable.address.split(',')[0]} s'est vendu plus cher au m² (${selectedComparable.pricePerSqm} €/m²). Cela s'explique par sa configuration de plain-pied ou sa rénovation récente. Néanmoins, votre bien offre une opportunité compétitive grâce à son prix d'appel à ${new Intl.NumberFormat('fr-FR').format(referencePricePerSqm)} €/m².`
                        : `Vendu à ${selectedComparable.pricePerSqm} €/m², ce bien se situe en dessous de notre cible estimée. Cependant, il présentait un état technique inférieur ou un terrain moins qualitatif par rapport à votre bien.`}
                    </span>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Selector metrics graphic slider at bottom (Page 6 layout) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4" id="comparables-summary-bar">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2" id="summary-bar-header">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
            Moyenne de la sélection des comparables
          </span>
          <span className="text-sm font-black text-[#00A0E2] font-mono">
            Moyenne : {avgSqmPrice} €/m²
          </span>
        </div>

        {/* Visual range graphic line */}
        <div className="relative py-4" id="comparable-range-visual">
          {/* Main bar track */}
          <div className="h-4 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full opacity-70 relative" id="range-track">
            {/* Median Tick mark */}
            <div 
              style={{ left: `${((avgSqmPrice - minSqmPrice) / (maxSqmPrice - minSqmPrice)) * 80 + 10}%` }}
              className="absolute -top-1 w-6 h-6 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center shadow shadow-slate-900/40 text-[9px] font-bold text-white shrink-0 -translate-x-1/2 z-10"
              id="range-tick-avg"
            >
              M
            </div>
            
            {/* Low point mark */}
            <div className="absolute -top-1 left-4 w-1.5 h-6 bg-slate-900 border border-white rounded-full -translate-x-1/2" id="range-tick-low" />
            {/* High point mark */}
            <div className="absolute -top-1 right-4 w-1.5 h-6 bg-slate-900 border border-white rounded-full translate-x-1/2" id="range-tick-high" />
          </div>

          <div className="flex justify-between text-[10px] font-bold font-mono text-slate-400 mt-2" id="range-tick-labels">
            <span>Prix Bas : {minSqmPrice} €/m²</span>
            <span>Moyenne de la sélection : {avgSqmPrice} €/m²</span>
            <span>Prix Haut : {maxSqmPrice} €/m²</span>
          </div>
        </div>
      </div>

    </div>
  );
}
