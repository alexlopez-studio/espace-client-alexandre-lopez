import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Building2,
  TrendingUp,
  Gauge,
  Home,
  PieChart,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Euro,
  Percent,
} from 'lucide-react';
import type {
  SocioEconomicData,
  MarketDistribution,
  MarketTrend,
  MarketTension,
} from '../types';

interface MarketSectionProps {
  socioEconomicData?: SocioEconomicData;
  marketDistribution?: MarketDistribution;
  marketTrend?: MarketTrend;
  marketTension?: MarketTension;
}

type SubTab = 'socio-eco' | 'marche' | 'tendance' | 'tension';

export default function MarketSection({
  socioEconomicData,
  marketDistribution,
  marketTrend,
  marketTension,
}: MarketSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('socio-eco');

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val);
  const formatPercent = (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)} %`;

  const subTabs: { id: SubTab; label: string; icon: typeof Users }[] = [
    { id: 'socio-eco', label: 'Socio-économique', icon: Users },
    { id: 'marche', label: 'Marché immo.', icon: Building2 },
    { id: 'tendance', label: 'Tendance', icon: TrendingUp },
    { id: 'tension', label: 'Tension', icon: Gauge },
  ];

  const hasData = socioEconomicData || marketDistribution || marketTrend || marketTension;

  if (!hasData) {
    return (
      <div className="w-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#00A0E2]">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">Analyse du marché en préparation</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          Les données socio-économiques et l'analyse du marché seront visibles dès la publication de votre estimation.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="market-section-container">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Analyse du marché local</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Contexte & dynamique du secteur</h2>
          <p className="text-xs text-slate-500">Données INSEE, Banque de France et Yanport.</p>
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
                <motion.div layoutId="marketSubTab" className="absolute inset-0 bg-slate-100 rounded-xl -z-10" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />
              )}
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00A0E2]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
          {activeSubTab === 'socio-eco' && socioEconomicData && <SocioEconomicPanel data={socioEconomicData} formatNumber={formatNumber} formatEuro={formatEuro} />}
          {activeSubTab === 'marche' && marketDistribution && <MarketDistributionPanel data={marketDistribution} />}
          {activeSubTab === 'tendance' && marketTrend && <MarketTrendPanel data={marketTrend} formatEuro={formatEuro} formatPercent={formatPercent} />}
          {activeSubTab === 'tension' && marketTension && <MarketTensionPanel data={marketTension} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============= SOCIO-ECONOMIC PANEL (page 4) =============
function SocioEconomicPanel({
  data,
  formatNumber,
  formatEuro,
}: {
  data: SocioEconomicData;
  formatNumber: (v: number) => string;
  formatEuro: (v: number) => string;
}) {
  const buyerLabel: Record<string, string> = {
    PERSONNE_SEULE: 'Personne seule',
    COUPLE: 'Couple',
    FAMILLE: 'Famille',
    MONOPARENTALITE: 'Monoparental',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Key metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Population" value={formatNumber(data.population)} sub="habitants" color="bg-[#00A0E2]/10 text-[#00A0E2]" />
        <MetricCard icon={Home} label="Ménages" value={formatNumber(data.households)} sub="foyers" color="bg-indigo-50 text-indigo-600" />
        <MetricCard icon={Euro} label="Revenu médian" value={formatEuro(data.medianIncome)} sub="/mois" color="bg-emerald-50 text-emerald-600" />
        <MetricCard icon={Percent} label="Taux d'intérêt" value={`${data.interestRate.toFixed(2)} %`} sub="25 ans" color="bg-amber-50 text-amber-600" />
      </div>

      {/* Buyer profiles */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4">Profils acquéreurs du secteur</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.buyerProfiles.map((profile) => (
            <div key={profile.type} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">{buyerLabel[profile.type] || profile.type}</span>
              <span className="text-xs text-slate-500">Recherche : {profile.interestedIn}</span>
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-[10px] text-slate-400">Budget</span>
                <span className="text-xs font-bold text-slate-800">{formatEuro(profile.budgetRange.low)} – {formatEuro(profile.budgetRange.high)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400">Revenu nécessaire</span>
                <span className="text-xs font-bold text-slate-700">{formatEuro(profile.requiredIncomeRange.low)} – {formatEuro(profile.requiredIncomeRange.high)}/mois</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seniority & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seniority distribution */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4">Ancienneté d'emménagement</h3>
          <div className="flex items-end gap-1 h-32">
            {data.seniorityDistribution.map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-1" title={`${item.label}: ${item.percent}%`}>
                <span className="text-[10px] font-bold text-slate-600">{item.percent}%</span>
                <div className="w-full bg-[#00A0E2] rounded-t-md" style={{ height: `${item.percent * 1.5}px`, opacity: 0.2 + item.percent / 100 }} />
                <span className="text-[8px] text-slate-400 text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity distribution */}
        {data.activityDistribution && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4">Activité des ménages</h3>
            <div className="space-y-2">
              {([
                { key: 'retraites' as const, label: 'Retraités', color: 'bg-indigo-500' },
                { key: 'employes' as const, label: 'Employés', color: 'bg-[#00A0E2]' },
                { key: 'intermediaires' as const, label: 'Intermédiaires', color: 'bg-emerald-500' },
                { key: 'cadres' as const, label: 'Cadres', color: 'bg-amber-500' },
                { key: 'ouvriers' as const, label: 'Ouvriers', color: 'bg-orange-500' },
                { key: 'artisans' as const, label: 'Artisans', color: 'bg-violet-500' },
                { key: 'agriculteurs' as const, label: 'Agriculteurs', color: 'bg-teal-500' },
                { key: 'sansEmploi' as const, label: 'Sans emploi', color: 'bg-slate-400' },
              ]).map((item) => {
                const value = data.activityDistribution![item.key];
                if (!value) return null;
                return (
                  <div key={item.key} className="flex items-center gap-2 text-xs">
                    <span className="w-20 text-slate-500 font-medium">{item.label}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.min(value, 100)}%` }} />
                    </div>
                    <span className="w-8 text-right font-bold text-slate-700">{value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============= MARKET DISTRIBUTION PANEL (page 5) =============
function MarketDistributionPanel({ data }: { data: MarketDistribution }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Housing types + Occupancy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4">Répartition des logements</h3>
          <div className="flex gap-4 justify-center">
            <DonutChart segments={[
              { value: data.housingTypes.maison, color: '#00A0E2', label: 'Maisons' },
              { value: data.housingTypes.appartement, color: '#10b981', label: 'Appartements' },
              { value: data.housingTypes.hlm, color: '#f59e0b', label: 'HLM' },
            ]} size={120} />
            <div className="flex flex-col justify-center gap-2 text-xs">
              <LegendItem color="#00A0E2" label="Maisons" value={`${data.housingTypes.maison}%`} />
              <LegendItem color="#10b981" label="Appartements" value={`${data.housingTypes.appartement}%`} />
              <LegendItem color="#f59e0b" label="HLM" value={`${data.housingTypes.hlm}%`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4">Statut d'occupation</h3>
          <div className="flex gap-4 justify-center">
            <DonutChart segments={[
              { value: data.occupancy.principales, color: '#00A0E2', label: 'Résidences principales' },
              { value: data.occupancy.secondaires, color: '#8b5cf6', label: 'Secondaires' },
              { value: data.occupancy.vacants, color: '#94a3b8', label: 'Vacants' },
            ]} size={120} />
            <div className="flex flex-col justify-center gap-2 text-xs">
              <LegendItem color="#00A0E2" label="Résidences principales" value={`${data.occupancy.principales}%`} />
              <LegendItem color="#8b5cf6" label="Secondaires" value={`${data.occupancy.secondaires}%`} />
              <LegendItem color="#94a3b8" label="Vacants" value={`${data.occupancy.vacants}%`} />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms + Surface distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarDistributionCard title="Nombre de pièces" items={data.roomsDistribution} highlight={data.bienPosition.roomsCount} highlightUnit="p" />
        <BarDistributionCard title="Distribution des surfaces" items={data.surfaceDistribution} highlightLabel={data.bienPosition.surfaceRange} />
      </div>
    </div>
  );
}

// ============= MARKET TREND PANEL (page 6) =============
function MarketTrendPanel({
  data,
  formatEuro,
  formatPercent,
}: {
  data: MarketTrend;
  formatEuro: (v: number) => string;
  formatPercent: (v: number) => string;
}) {
  const trends = [
    { label: '6 mois', value: data.evolution6m },
    { label: '1 an', value: data.evolution1y },
    { label: '2 ans', value: data.evolution2y },
  ];

  const maxPrice = Math.max(...data.history.map((h) => h.highPrice));
  const minPrice = Math.min(...data.history.map((h) => h.lowPrice));

  return (
    <div className="flex flex-col gap-6">
      {/* Price range cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Prix/m² bas</span>
          <p className="text-lg font-extrabold text-emerald-600">{formatEuro(data.pricePerSqmLow)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#00A0E2]/30 bg-[#00A0E2]/5 p-4 text-center">
          <span className="text-[10px] text-[#00A0E2] font-bold uppercase">Prix/m² médian</span>
          <p className="text-lg font-extrabold text-[#0077B6]">{formatEuro(data.pricePerSqmMedian)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Prix/m² haut</span>
          <p className="text-lg font-extrabold text-rose-600">{formatEuro(data.pricePerSqmHigh)}</p>
        </div>
      </div>

      {/* Evolution badges */}
      <div className="flex gap-3">
        {trends.map((t) => (
          <div key={t.label} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ${
            t.value > 0 ? 'bg-emerald-50 text-emerald-700' : t.value < 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600'
          }`}>
            {t.value > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : t.value < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            <span>{t.label} : {formatPercent(t.value)}</span>
          </div>
        ))}
      </div>

      {/* History chart */}
      {data.history.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4">Évolution des prix du marché</h3>
          <div className="relative h-40">
            <svg viewBox={`0 0 ${data.history.length * 80} 160`} className="w-full h-full">
              {data.history.map((item, i) => {
                const x = i * 80 + 40;
                const yHigh = 10;
                const yLow = 150;
                const yMedian = yLow - ((item.medianPrice - minPrice) / (maxPrice - minPrice)) * (yLow - yHigh - 20);
                const yTop = yLow - ((item.highPrice - minPrice) / (maxPrice - minPrice)) * (yLow - yHigh - 20);
                const yBot = yLow - ((item.lowPrice - minPrice) / (maxPrice - minPrice)) * (yLow - yHigh - 20);
                return (
                  <g key={item.quarter}>
                    {/* Range line */}
                    <line x1={x} y1={yTop} x2={x} y2={yBot} stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                    {/* Median dot */}
                    <circle cx={x} cy={yMedian} r="5" fill="#00A0E2" />
                    <text x={x} y="165" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">{item.quarter}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// ============= MARKET TENSION PANEL (page 7) =============
function MarketTensionPanel({ data }: { data: MarketTension }) {
  const levelColors: Record<string, string> = {
    'très ralenti': 'bg-rose-500',
    'ralenti': 'bg-amber-500',
    'équilibré': 'bg-[#00A0E2]',
    'dynamique': 'bg-emerald-500',
    'très dynamique': 'bg-emerald-600',
  };
  const levels = ['très ralenti', 'ralenti', 'équilibré', 'dynamique', 'très dynamique'];
  const currentIdx = levels.indexOf(data.level);
  const colorClass = levelColors[data.level] || 'bg-[#00A0E2]';

  return (
    <div className="flex flex-col gap-6">
      {/* Tensiometer */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4">Tensiomètre</h3>
        <div className="flex items-center gap-1 h-4 rounded-full bg-slate-100 overflow-hidden">
          {levels.map((level, i) => (
            <div key={level} className={`flex-1 h-full ${i <= currentIdx ? colorClass : ''} ${i === currentIdx ? 'ring-2 ring-white ring-offset-1 rounded-full z-10' : ''}`} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-bold uppercase">
          <span>Très ralenti</span>
          <span>Équilibré</span>
          <span>Très dynamique</span>
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
          <span className="text-xs font-extrabold text-slate-800">{data.levelLabel}</span>
          <p className="text-xs text-slate-500 mt-1">{data.levelDescription}</p>
        </div>
      </div>

      {/* Sale delays */}
      <div className="grid grid-cols-3 gap-4">
        <DelayCard label="Vente rapide" value={`${data.saleDelays.fastest} j`} color="text-emerald-600" bg="bg-emerald-50" />
        <DelayCard label="Vente médiane" value={`${data.saleDelays.median} j`} color="text-[#00A0E2]" bg="bg-[#00A0E2]/10" />
        <DelayCard label="Vente lente" value={`${data.saleDelays.slowest} j`} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* Indicators */}
      {(data.stockIndicator || data.priceRevisionIndicator) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.stockIndicator && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#00A0E2]" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Stocks</span>
                <p className="text-xs text-slate-700 font-semibold">{data.stockIndicator}</p>
              </div>
            </div>
          )}
          {data.priceRevisionIndicator && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Révision des prix</span>
                <p className="text-xs text-slate-700 font-semibold">{data.priceRevisionIndicator}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============= SHARED COMPONENTS =============

function MetricCard({ icon: Icon, label, value, sub, color }: { icon: typeof Users; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
        <p className="text-base font-extrabold text-slate-800">{value}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function DonutChart({ segments, size }: { segments: { value: number; color: string; label: string }[]; size: number }) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = size / 2;
  const strokeWidth = radius * 0.35;

  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={radius} cy={radius} r={radius - strokeWidth / 2} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
      </svg>
    );
  }

  let cumulativePercent = 0;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const percent = seg.value / total;
        const dashArray = circumference * percent;
        const dashOffset = -cumulativePercent * circumference;
        cumulativePercent += percent;
        return (
          <circle
            key={i}
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        );
      })}
    </svg>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-slate-800 ml-auto">{value}</span>
    </div>
  );
}

function BarDistributionCard({
  title,
  items,
  highlight,
  highlightUnit,
  highlightLabel,
}: {
  title: string;
  items: { label: string; percent: number }[];
  highlight?: number;
  highlightUnit?: string;
  highlightLabel?: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <h3 className="text-sm font-extrabold text-slate-800 mb-4">{title}</h3>
      <div className="space-y-2.5">
        {items.map((item) => {
          const isHighlighted = (highlight !== undefined && item.label.includes(String(highlight))) || (highlightLabel && item.label === highlightLabel);
          return (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <span className={`w-24 font-medium ${isHighlighted ? 'text-[#00A0E2] font-bold' : 'text-slate-500'}`}>
                {item.label}
                {isHighlighted && highlightLabel && <span className="ml-1 text-[9px] text-[#00A0E2]">← Bien</span>}
              </span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isHighlighted ? 'bg-[#00A0E2]' : 'bg-slate-300'}`}
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                />
              </div>
              <span className={`w-10 text-right font-bold ${isHighlighted ? 'text-[#00A0E2]' : 'text-slate-600'}`}>{item.percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DelayCard({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className={`rounded-2xl border border-slate-100 p-4 text-center ${bg}`}>
      <span className="text-[10px] text-slate-400 font-bold uppercase">{label}</span>
      <p className={`text-lg font-extrabold mt-1 ${color}`}>{value}</p>
    </div>
  );
}