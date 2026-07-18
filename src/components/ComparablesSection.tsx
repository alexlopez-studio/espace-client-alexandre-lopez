import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitCompare,
  MapPin,
  Calendar,
  Sparkles,
  TrendingUp,
  Target,
  History,
  Bed,
  Trees,
  Euro,
} from 'lucide-react';
import type { ComparableProperty, ExtendedComparableProperty, PropertyDetails } from '../types';

interface ComparablesSectionProps {
  soldComparables?: ComparableProperty[];
  competingProperties?: ExtendedComparableProperty[];
  unsoldProperties?: ExtendedComparableProperty[];
  propertyDetails?: PropertyDetails;
  referencePrice?: number;
}

type SubTab = 'concurrence' | 'vendus' | 'invendus';

export default function ComparablesSection({
  soldComparables: propComparables,
  competingProperties,
  unsoldProperties,
  propertyDetails: propDetails,
  referencePrice,
}: ComparablesSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('concurrence');

  const activeComparables = propComparables ?? [];
  const activeDetails = propDetails ?? {
    surface: 0, rooms: 0, floors: 0, landSurface: 0, bedrooms: 0, year: 0, address: '', description: '',
  };
  const safeReferencePrice = referencePrice ?? 0;

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const referencePricePerSqm = safeReferencePrice && activeDetails.surface ? Math.round(safeReferencePrice / activeDetails.surface) : 0;

  // Compute current tab data
  const currentData = (() => {
    if (activeSubTab === 'concurrence') return (competingProperties ?? []).map(p => ({ ...p, _type: 'competing' as const }));
    if (activeSubTab === 'vendus') return activeComparables.map(c => ({
      id: c.id, title: c.title, price: c.price, pricePerSqm: c.pricePerSqm, surface: c.surface,
      landSurface: c.landSurface, rooms: c.rooms, bedrooms: c.bedrooms, year: c.year,
      address: c.address, daysOnMarket: c.soldDate, status: 'Vendu' as const, energyLabel: c.energyLabel,
      _type: 'sold' as const,
    }));
    return (unsoldProperties ?? []).map(p => ({ ...p, _type: 'unsold' as const }));
  })();

  const avgSqmPrice = currentData.length > 0 ? Math.round(currentData.reduce((acc, c) => acc + c.pricePerSqm, 0) / currentData.length) : 0;
  const minSqmPrice = currentData.length > 0 ? Math.min(...currentData.map(c => c.pricePerSqm)) : 0;
  const maxSqmPrice = currentData.length > 0 ? Math.max(...currentData.map(c => c.pricePerSqm)) : 0;

  const subTabs: { id: SubTab; label: string; icon: typeof GitCompare; count: number }[] = [
    { id: 'concurrence', label: 'En concurrence', icon: TrendingUp, count: competingProperties?.length ?? 0 },
    { id: 'vendus', label: 'Vendus récemment', icon: History, count: activeComparables.length },
    { id: 'invendus', label: 'Invendus', icon: Target, count: unsoldProperties?.length ?? 0 },
  ];

  const hasData = competingProperties || activeComparables.length > 0 || unsoldProperties;

  if (!hasData || currentData.length === 0) {
    return (
      <div className="w-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#00A0E2]"><GitCompare className="h-6 w-6" /></div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">Comparables en préparation</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Les biens comparables seront visibles après publication de votre estimation.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="comparables-section-container">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Analyse comparative du marché</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Biens comparables</h2>
          <p className="text-xs text-slate-500">Sélection publiée par votre conseiller depuis le rapport d'estimation.</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isActive && <motion.div layoutId="compSubTab" className="absolute inset-0 bg-slate-100 rounded-xl -z-10" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />}
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00A0E2]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${isActive ? 'bg-[#00A0E2]/15 text-[#00A0E2]' : 'bg-slate-100 text-slate-600'}`}>{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Split view: list left, comparison right */}
      <AnimatePresence mode="wait">
        <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          <ComparableListView
            items={currentData}
            activeDetails={activeDetails}
            safeReferencePrice={safeReferencePrice}
            referencePricePerSqm={referencePricePerSqm}
            avgSqmPrice={avgSqmPrice}
            minSqmPrice={minSqmPrice}
            maxSqmPrice={maxSqmPrice}
            formatEuro={formatEuro}
            tabType={activeSubTab}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

type UnifiedComparable = {
  id: string;
  title: string;
  price: number;
  pricePerSqm: number;
  surface: number;
  landSurface: number;
  rooms: number;
  bedrooms: number;
  year?: number;
  address: string;
  daysOnMarket?: string;
  status: 'En vente' | 'Vendu' | 'Invendu';
  energyLabel?: string;
  _type: 'competing' | 'sold' | 'unsold';
  stairs?: number;
  garage?: number;
};

function ComparableListView({
  items,
  activeDetails,
  safeReferencePrice,
  referencePricePerSqm,
  avgSqmPrice,
  minSqmPrice,
  maxSqmPrice,
  formatEuro,
  tabType,
}: {
  items: UnifiedComparable[];
  activeDetails: PropertyDetails;
  safeReferencePrice: number;
  referencePricePerSqm: number;
  avgSqmPrice: number;
  minSqmPrice: number;
  maxSqmPrice: number;
  formatEuro: (val: number) => string;
  tabType: SubTab;
}) {
  const [selected, setSelected] = useState<UnifiedComparable | null>(items[0] || null);

  useEffect(() => {
    setSelected(items[0] || null);
  }, [items]);

  const statusStyle = (status: string) => {
    if (status === 'Vendu') return 'bg-emerald-500 text-white';
    if (status === 'Invendu') return 'bg-amber-100 text-amber-700';
    return 'bg-[#00A0E2]/10 text-[#00A0E2]';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Cards list */}
      <div className="lg:col-span-7 flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
        {items.map((comp) => {
          const isSelected = selected?.id === comp.id;
          return (
            <motion.div
              layout
              key={comp.id}
              onClick={() => setSelected(comp)}
              className={`cursor-pointer rounded-2xl p-5 border text-xs flex flex-col gap-3 transition-all relative ${
                isSelected ? 'bg-[#00A0E2]/5 border-[#00A0E2] shadow-sm' : 'bg-white hover:bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${statusStyle(comp.status)}`}>
                    {comp.status}
                  </span>
                  {comp.daysOnMarket && (
                    <span className="text-[10px] text-slate-400 font-bold">{comp.daysOnMarket}</span>
                  )}
                </div>
                <span className="text-base font-extrabold text-slate-800">{formatEuro(comp.price)}</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-[#00A0E2]">{comp.title}</h4>
                <p className="text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" />{comp.address}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <SpecBadge label={`${comp.surface} m²`} />
                <SpecBadge label={`Terrain ${comp.landSurface} m²`} />
                <SpecBadge label={`${comp.rooms} p.`} />
                <SpecBadge label={`${comp.bedrooms} ch.`} />
                <span className="bg-[#00A0E2]/10 text-[#00A0E2] ml-auto px-2.5 py-1 rounded-lg font-extrabold text-[10px]">{comp.pricePerSqm} €/m²</span>
              </div>
              {isSelected && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#00A0E2] rounded-l-full" />}
            </motion.div>
          );
        })}
      </div>

      {/* Right: Comparison matrix */}
      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5 h-full justify-between"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-[#00A0E2] uppercase flex items-center gap-1"><GitCompare className="w-3.5 h-3.5" />Comparateur</span>
                <h3 className="text-base font-extrabold text-slate-800">Votre bien VS {selected.title}</h3>
              </div>

              <div className="flex-1 flex flex-col gap-2 my-3">
                <CompareRow label="Surface" yours={`${activeDetails.surface}m²`} theirs={`${selected.surface}m²`} diff={activeDetails.surface - selected.surface} unit="m²" />
                <CompareRow label="Terrain" yours={`${activeDetails.landSurface}m²`} theirs={`${selected.landSurface}m²`} diff={activeDetails.landSurface - selected.landSurface} unit="m²" />
                <CompareRow label="Pièces / Ch." yours={`${activeDetails.rooms}p / ${activeDetails.bedrooms}ch`} theirs={`${selected.rooms}p / ${selected.bedrooms}ch`} />
                <CompareRow label="Prix" yours={`Réf. ${Math.round(safeReferencePrice / 1000)}k €`} theirs={formatEuro(selected.price)} highlight />
                <CompareRow label="Prix/m²" yours={`Réf. ${new Intl.NumberFormat('fr-FR').format(referencePricePerSqm)} €`} theirs={`${selected.pricePerSqm} €/m²`} highlight />
              </div>

              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex gap-3 text-[11px] leading-relaxed text-slate-700">
                <Sparkles className="w-4 h-4 text-[#00A0E2] shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block uppercase">Note comparative</span>
                  <span>
                    {selected.pricePerSqm > referencePricePerSqm
                      ? `Ce bien s'est vendu plus cher au m² (${selected.pricePerSqm} €/m²). Votre prix d'appel à ${new Intl.NumberFormat('fr-FR').format(referencePricePerSqm)} €/m² est compétitif.`
                      : `Vendu à ${selected.pricePerSqm} €/m², ce bien conforte notre estimation.`}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CompareRow({ label, yours, theirs, diff, unit, highlight }: { label: string; yours: string; theirs: string; diff?: number; unit?: string; highlight?: boolean }) {
  return (
    <div className="grid grid-cols-3 items-center py-2 border-b border-slate-50 text-xs">
      <div className="text-slate-500 font-semibold">{label}</div>
      <div className="text-slate-400">Votre bien : <span className="font-extrabold text-slate-700">{yours}</span></div>
      <div className={`text-right font-bold ${highlight ? 'text-[#00A0E2]' : 'text-slate-800'}`}>
        {theirs}
        {diff !== undefined && (
          <span className={`ml-1.5 text-[10px] ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-amber-600' : ''}`}>
            ({diff > 0 ? '+' : ''}{diff}{unit || ''})
          </span>
        )}
      </div>
    </div>
  );
}

function SpecBadge({ label }: { label: string }) {
  return <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-bold text-[10px]">{label}</span>;
}