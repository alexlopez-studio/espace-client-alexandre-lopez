import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  GitCompare,
  TrendingUp,
  Euro,
  Award,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import type { PositioningData, SynthesisData } from '../types';

interface CompetitionSectionProps {
  positioningData?: PositioningData;
  synthesisData?: SynthesisData;
}

type SubTab = 'positionnement' | 'synthese';

export default function CompetitionSection({
  positioningData,
  synthesisData,
}: CompetitionSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('positionnement');

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const subTabs: { id: SubTab; label: string; icon: typeof Target }[] = [
    { id: 'positionnement', label: 'Positionnement prix', icon: Target },
    { id: 'synthese', label: 'Synthèse des méthodes', icon: BarChart3 },
  ];

  const hasData = positioningData || synthesisData;

  if (!hasData) {
    return (
      <div className="w-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#00A0E2]"><GitCompare className="h-6 w-6" /></div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">Positionnement en préparation</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Le positionnement et la synthèse seront visibles après publication.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="competition-section-container">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Analyse de la concurrence</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Positionnement prix & synthèse</h2>
          <p className="text-xs text-slate-500">Croisement des méthodes d'estimation pour un prix juste.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isActive && <motion.div layoutId="compSubTab" className="absolute inset-0 bg-slate-100 rounded-xl -z-10" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />}
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00A0E2]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {activeSubTab === 'positionnement' && positioningData && <PositioningPanel data={positioningData} formatEuro={formatEuro} />}
          {activeSubTab === 'synthese' && synthesisData && <SynthesisPanel data={synthesisData} formatEuro={formatEuro} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PositioningPanel({ data, formatEuro }: { data: PositioningData; formatEuro: (v: number) => string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Award} label="Rang prix/m²" value={`${data.pricePerSqmRank}ᵉ / ${data.totalCompetitors}`} color="bg-[#00A0E2]/10 text-[#00A0E2]" />
        <MetricCard icon={TrendingUp} label="Moins chers" value={`${data.cheaperPercent}%`} color="bg-emerald-50 text-emerald-600" />
        <MetricCard icon={Target} label="Plus grands" value={`${data.largerPercent}%`} color="bg-amber-50 text-amber-600" />
        <MetricCard icon={Sparkles} label="Moins chers & + grands" value={`${data.cheaperAndLargerPercent}%`} color="bg-rose-50 text-rose-600" />
      </div>

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

      <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Euro className="w-5 h-5 text-slate-500" /></div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Prix moyen de la concurrence</span>
          <p className="text-sm font-extrabold text-slate-800">{data.averageCompetitorPricePerSqm} €/m²</p>
        </div>
      </div>
    </div>
  );
}

function SynthesisPanel({ data, formatEuro }: { data: SynthesisData; formatEuro: (v: number) => string }) {
  const methods = [
    { label: 'Prix du marché', icon: TrendingUp, data: data.marketMethod, desc: 'Basé sur les prix observés des biens similaires.' },
    { label: 'Biens comparables', icon: GitCompare, data: data.comparablesMethod, desc: 'Biens vendus récemment à proximité.' },
    { label: 'Moteur IA', icon: Sparkles, data: data.aiMethod, desc: 'Estimation ajustée par IA selon les caractéristiques.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((m) => {
          const I = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#00A0E2]/10 flex items-center justify-center"><I className="w-4 h-4 text-[#00A0E2]" /></div>
                <span className="text-xs font-extrabold text-slate-800">{m.label}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Row label="Médiane" value={formatEuro(m.data.median)} color="text-[#00A0E2]" />
                <Row label="Bas" value={formatEuro(m.data.low)} color="text-emerald-600" />
                <Row label="Haut" value={formatEuro(m.data.high)} color="text-rose-600" />
              </div>
              <p className="text-[10px] text-slate-400">{m.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-[#00A0E2]/5 to-indigo-50 rounded-3xl border border-[#00A0E2]/20 p-6 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#00A0E2]/10 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-[#00A0E2]" /></div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">Croisement des méthodes</h3>
          <p className="text-xs text-slate-600 mt-1.5">
            En comparant ces trois méthodes, nous obtenons une estimation précise. Chaque méthode apporte une perspective unique. L'indice de fiabilité est jugé <span className="font-bold text-[#00A0E2]">bon</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between text-[10px]">
      <span className="text-slate-400">{label}</span>
      <span className={`font-bold ${color}`}>{value}/m²</span>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: typeof Award; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
        <p className="text-lg font-extrabold text-slate-800">{value}</p>
      </div>
    </div>
  );
}