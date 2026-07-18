import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  GitCompare,
  TrendingUp,
  MapPin,
  Euro,
  Award,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import type {
  ExtendedComparableProperty,
  PositioningData,
  SynthesisData,
  PropertyDetails,
} from '../types';

interface CompetitionSectionProps {
  competingProperties?: ExtendedComparableProperty[];
  unsoldProperties?: ExtendedComparableProperty[];
  positioningData?: PositioningData;
  synthesisData?: SynthesisData;
  propertyDetails?: PropertyDetails;
  referencePrice?: number;
}

type SubTab = 'concurrence' | 'positionnement' | 'synthese';

export default function CompetitionSection({
  competingProperties,
  unsoldProperties,
  positioningData,
  synthesisData,
  propertyDetails,
  referencePrice,
}: CompetitionSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('concurrence');

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const subTabs: { id: SubTab; label: string; icon: typeof Target }[] = [
    { id: 'concurrence', label: 'Concurrence', icon: Target },
    { id: 'positionnement', label: 'Positionnement', icon: GitCompare },
    { id: 'synthese', label: 'Synthèse', icon: BarChart3 },
  ];

  const hasData = competingProperties || unsoldProperties || positioningData || synthesisData;

  if (!hasData) {
    return (
      <div className="w-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#00A0E2]">
          <GitCompare className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">Analyse concurrentielle en préparation</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          L'analyse de la concurrence et le positionnement seront visibles après publication de votre estimation.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="competition-section-container">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Analyse de la concurrence</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Positionnement prix & synthèse</h2>
          <p className="text-xs text-slate-500">Comparaison avec les biens du marché et croisement des méthodes d'estimation.</p>
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
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60'
              }`}
            >
              {isActive && (
                <motion.div layoutId="compSubTab" className="absolute inset-0 bg-slate-100 rounded-xl -z-10" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />
              )}
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00A0E2]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {activeSubTab === 'concurrence' && (
            <ConcurrencePanel
              competing={competingProperties}
              unsold={unsoldProperties}
              formatEuro={formatEuro}
            />
          )}
          {activeSubTab === 'positionnement' && positioningData && (
            <PositioningPanel
              data={positioningData}
              formatEuro={formatEuro}
            />
          )}
          {activeSubTab === 'synthese' && synthesisData && (
            <SynthesisPanel
              data={synthesisData}
              formatEuro={formatEuro}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============= CONCURRENCE PANEL (pages 8-9) =============
function ConcurrencePanel({
  competing,
  unsold,
  formatEuro,
}: {
  competing?: ExtendedComparableProperty[];
  unsold?: ExtendedComparableProperty[];
  formatEuro: (v: number) => string;
}) {
  const [filter, setFilter] = useState<'all' | 'vente' | 'invendu'>('all');

  const allProperties = [
    ...(competing ?? []).map((p) => ({ ...p, category: 'vente' as const })),
    ...(unsold ?? []).map((p) => ({ ...p, category: 'invendu' as const })),
  ];

  const filtered = filter === 'all' ? allProperties : allProperties.filter((p) => p.category === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Filter pills */}
      <div className="flex gap-2">
        {([
          { id: 'all' as const, label: 'Tous', count: allProperties.length },
          { id: 'vente' as const, label: 'En vente', count: competing?.length ?? 0 },
          { id: 'invendu' as const, label: 'Invendus', count: unsold?.length ?? 0 },
        ]).map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === item.id ? 'bg-[#00A0E2] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* Properties list */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-xs text-slate-400">Aucun bien dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    property.status === 'En vente' ? 'bg-[#00A0E2]/10 text-[#00A0E2]' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {property.status}
                  </span>
                  {property.daysOnMarket && (
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                      {property.daysOnMarket}
                    </span>
                  )}
                </div>
                <span className="text-sm font-extrabold text-slate-800">{formatEuro(property.price)}</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-800">{property.title}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {property.address}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
                <Badge label={`${property.surface} m²`} />
                <Badge label={`Terrain ${property.landSurface} m²`} />
                <Badge label={`${property.rooms} p.`} />
                <Badge label={`${property.bedrooms} ch.`} />
                {property.year && <Badge label={`${property.year}`} />}
                <span className="ml-auto text-xs font-extrabold text-[#00A0E2]">{property.pricePerSqm} €/m²</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============= POSITIONING PANEL (page 10) =============
function PositioningPanel({
  data,
  formatEuro,
}: {
  data: PositioningData;
  formatEuro: (v: number) => string;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Positioning metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PositioningMetricCard
          label="Rang prix/m²"
          value={`${data.pricePerSqmRank}ᵉ / ${data.totalCompetitors}`}
          color="bg-[#00A0E2]/10 text-[#00A0E2]"
          icon={Award}
        />
        <PositioningMetricCard
          label="Moins chers"
          value={`${data.cheaperPercent}%`}
          color="bg-emerald-50 text-emerald-600"
          icon={TrendingUp}
        />
        <PositioningMetricCard
          label="Plus grands"
          value={`${data.largerPercent}%`}
          color="bg-amber-50 text-amber-600"
          icon={Target}
        />
        <PositioningMetricCard
          label="Moins chers & + grands"
          value={`${data.cheaperAndLargerPercent}%`}
          color="bg-rose-50 text-rose-600"
          icon={Sparkles}
        />
      </div>

      {/* Price thresholds */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4">Seuils de prix par positionnement</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <span className="text-[10px] text-emerald-600 font-bold uppercase">10% les moins chers</span>
            <p className="text-lg font-extrabold text-emerald-700 mt-1">{'<'} {formatEuro(data.priceThresholds.low)}</p>
          </div>
          <div className="bg-[#00A0E2]/10 rounded-2xl p-4 border border-[#00A0E2]/20">
            <span className="text-[10px] text-[#00A0E2] font-bold uppercase">Prix médian</span>
            <p className="text-lg font-extrabold text-[#0077B6] mt-1">{formatEuro(data.priceThresholds.median)}</p>
          </div>
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
            <span className="text-[10px] text-rose-600 font-bold uppercase">10% les plus chers</span>
            <p className="text-lg font-extrabold text-rose-700 mt-1">{'>'} {formatEuro(data.priceThresholds.high)}</p>
          </div>
        </div>
      </div>

      {/* Average competitor price */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Euro className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Prix moyen de la concurrence</span>
          <p className="text-sm font-extrabold text-slate-800">{data.averageCompetitorPricePerSqm} €/m²</p>
        </div>
      </div>
    </div>
  );
}

// ============= SYNTHESIS PANEL (page 11) =============
function SynthesisPanel({
  data,
  formatEuro,
}: {
  data: SynthesisData;
  formatEuro: (v: number) => string;
}) {
  const methods = [
    { label: 'Prix du marché', icon: TrendingUp, data: data.marketMethod, description: 'Basé sur les prix observés des biens similaires dans le secteur.' },
    { label: 'Biens comparables', icon: GitCompare, data: data.comparablesMethod, description: 'Calculé à partir des biens vendus récemment à proximité.' },
    { label: 'Moteur IA', icon: Sparkles, data: data.aiMethod, description: 'Estimation ajustée par intelligence artificielle selon les caractéristiques du bien.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Method cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <div key={method.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#00A0E2]/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#00A0E2]" />
                </div>
                <span className="text-xs font-extrabold text-slate-800">{method.label}</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Médiane</span>
                  <span className="font-bold text-[#00A0E2]">{formatEuro(method.data.median)}/m²</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Bas</span>
                  <span className="font-bold text-emerald-600">{formatEuro(method.data.low)}/m²</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Haut</span>
                  <span className="font-bold text-rose-600">{formatEuro(method.data.high)}/m²</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{method.description}</p>
            </div>
          );
        })}
      </div>

      {/* Summary insight */}
      <div className="bg-gradient-to-r from-[#00A0E2]/5 to-indigo-50 rounded-3xl border border-[#00A0E2]/20 p-6 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-[#00A0E2]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-[#00A0E2]" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">Croisement des méthodes</h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            En comparant ces trois méthodes, nous obtenons une estimation précise de votre bien. Chaque méthode apporte une perspective unique et complémentaire, permettant ainsi d'ajuster la valeur selon les spécificités du bien. L'indice de fiabilité est jugé <span className="font-bold text-[#00A0E2]">bon</span> pour cette estimation.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============= SHARED COMPONENTS =============

function Badge({ label }: { label: string }) {
  return (
    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg font-bold text-[10px]">
      {label}
    </span>
  );
}

function PositioningMetricCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: typeof Award;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
        <p className="text-lg font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
}