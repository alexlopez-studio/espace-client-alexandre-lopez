import React from 'react';
import { 
  Award, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  Compass,
  FileCheck
} from 'lucide-react';
import type { AdvisorInfo, ClientInfo } from '../types';

interface ConclusionSectionProps {
  clientInfo: ClientInfo;
  advisorInfo: AdvisorInfo;
  recommendedPriceRange: { low: number; high: number };
  propertySize?: number;
  onGoToActionPlan?: () => void;
}

export default function ConclusionSection({ 
  clientInfo: propClient, 
  advisorInfo: propAdvisor, 
  recommendedPriceRange,
  propertySize = 0,
  onGoToActionPlan
}: ConclusionSectionProps) {
  const activeClient = propClient;
  const activeAdvisor = propAdvisor;
  const activePriceRange = recommendedPriceRange;

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  const formattedLow = formatEuro(activePriceRange.low);
  const formattedHigh = formatEuro(activePriceRange.high);
  const formattedLowPerSqm = propertySize > 0 ? formatEuro(Math.round(activePriceRange.low / propertySize)) : '—';
  const formattedHighPerSqm = propertySize > 0 ? formatEuro(Math.round(activePriceRange.high / propertySize)) : '—';

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="conclusion-section-container">
      
      {/* Recommended Price Certificate (Valeur du Bien Certifiée) */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-800 relative overflow-hidden text-center flex flex-col items-center gap-6" id="certified-value-card">
        {/* Background seal badge effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,160,226,0.14),transparent_100%)] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-[#00A0E2] rounded-full opacity-10 filter blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -top-24 w-64 h-64 bg-emerald-500 rounded-full opacity-10 filter blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center gap-1.5 z-10" id="certificate-header">
          <div className="w-14 h-14 rounded-2xl bg-[#00A0E2]/15 border border-[#00A0E2]/30 flex items-center justify-center text-[#00A0E2] mb-1.5 shadow-lg shadow-[#00A0E2]/20">
            <Award className="w-7 h-7" />
          </div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Valeur du bien officielle • iad France</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight mt-1">Estimation recommandée de vente</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-1">
            Établie par {activeAdvisor.name} après étude comparative approfondie des données réelles du marché local en date du {activeClient.date}.
          </p>
        </div>

        {/* Big Certificate Price Numbers */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-3xl py-8 px-8 sm:px-16 flex flex-col md:flex-row items-center gap-6 lg:gap-16 z-10 shadow-inner mt-2 w-full max-w-3xl justify-center" id="certificate-price-box">
          <div className="flex flex-col text-center md:text-left" id="cert-val-range">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Fourchette de prix conseillée</span>
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 tracking-tight mt-1.5">{formattedLow} - {formattedHigh}</span>
          </div>
          <div className="w-px h-12 bg-slate-800 hidden md:block" />
          <div className="flex flex-col text-center md:text-left" id="cert-val-sqm">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Prix au m² correspondant</span>
            <span className="text-xl sm:text-2xl font-black text-slate-200 mt-1.5">{formattedLowPerSqm} - {formattedHighPerSqm} / m²</span>
          </div>
        </div>

        <div className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed z-10 mt-2 space-y-2">
          <p>
            Cette recommandation tarifaire vise à positionner votre propriété sur la <span className="text-white font-bold">fourchette haute d'attractivité</span> du marché. Elle garantit un volume maximal de contacts et d'acquéreurs qualifiés dès les premières semaines de commercialisation.
          </p>
        </div>

        {/* 3 Pillars of Pricing Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl z-10 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Prix certifié & défendable</span>
              <span className="text-[11px] text-slate-400">Fondé sur les ventes réelles DVF</span>
            </div>
          </div>
          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-left flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-[#00A0E2] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Attractivité maximale</span>
              <span className="text-[11px] text-slate-400">Positionné face aux biens concurrents</span>
            </div>
          </div>
          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-left flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Négociation maîtrisée</span>
              <span className="text-[11px] text-slate-400">Marge saine pour préserver la valeur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Next Steps CTA Block (Passer à l'action / Plan d'action) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6" id="action-plan-cta-banner">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-[#00A0E2]/20 border border-[#00A0E2]/40 text-[#00A0E2] flex items-center justify-center shrink-0 hidden sm:flex">
            <Compass className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider bg-[#00A0E2]/10 px-2 py-0.5 rounded">
                Étape suivante
              </span>
              <span className="text-xs text-slate-400 font-medium">Prêt pour la commercialisation</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Découvrez le Plan d'action & nos 6 Engagements
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Consultez les 6 étapes de préparation, notre charte de confiance et planifiez votre débriefing stratégique avec {activeAdvisor.name}.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToActionPlan}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#00A0E2] hover:bg-[#008ec9] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#00A0E2]/30 transition-all transform hover:-translate-y-0.5 shrink-0 cursor-pointer w-full md:w-auto"
          id="btn-go-to-action-plan"
        >
          <span>Voir le Plan d'action</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
