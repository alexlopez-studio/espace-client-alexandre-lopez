import React from 'react';
import { 
  GitCommit, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  User, 
  ShieldAlert, 
  TrendingUp, 
  CheckSquare,
  RefreshCw,
  Users
} from 'lucide-react';
import { SalesStep } from '../types';

interface SalesPlanSectionProps {
  salesSteps: SalesStep[];
  onUpdateStepStatus: (id: string, status: SalesStep['status']) => void;
  isAdmin?: boolean;
  readOnly?: boolean;
}

export default function SalesPlanSection({ 
  salesSteps, 
  onUpdateStepStatus,
  isAdmin = false,
  readOnly = false,
}: SalesPlanSectionProps) {
  
  // Sort steps by order
  const sortedSteps = [...salesSteps].sort((a, b) => a.order - b.order);

  // Stats
  const totalSteps = sortedSteps.length;
  const completedSteps = sortedSteps.filter(s => s.status === 'Terminé').length;
  const inProgressSteps = sortedSteps.filter(s => s.status === 'En cours').length;
  const completionPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const getStatusIcon = (status: SalesStep['status']) => {
    switch (status) {
      case 'Terminé':
        return <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />;
      case 'En cours':
        return <Clock className="w-5 h-5 text-[#00A0E2] animate-pulse" />;
      case 'A faire':
        return <HelpCircle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusStyle = (status: SalesStep['status']) => {
    switch (status) {
      case 'Terminé':
        return 'border-emerald-200 bg-emerald-50/20 text-emerald-800';
      case 'En cours':
        return 'border-[#00A0E2]/30 bg-[#00A0E2]/5 text-[#00A0E2]';
      case 'A faire':
        return 'border-slate-100 bg-white text-slate-400';
    }
  };

  const getResponsibleLabel = (resp: SalesStep['responsible']) => {
    switch (resp) {
      case 'Conseiller':
        return (
          <span className="inline-flex items-center gap-1 bg-[#00A0E2]/10 text-[#00A0E2] text-[9px] font-bold px-2 py-0.5 rounded-md">
            <User className="w-2.5 h-2.5" />
            <span>Olivier (iad)</span>
          </span>
        );
      case 'Vendeur':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-md border border-amber-100">
            <Users className="w-2.5 h-2.5" />
            <span>Vendeur (Mme/M. Verger)</span>
          </span>
        );
      case 'Tous':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-md border border-purple-100">
            <Users className="w-2.5 h-2.5" />
            <span>Ensemble</span>
          </span>
        );
    }
  };

  // Click to Cycle Status (For quick and visual interactive user feedback)
  const handleCycleStatus = (step: SalesStep) => {
    if (readOnly) return;
    let nextStatus: SalesStep['status'] = 'A faire';
    if (step.status === 'A faire') nextStatus = 'En cours';
    else if (step.status === 'En cours') nextStatus = 'Terminé';
    else if (step.status === 'Terminé') nextStatus = 'A faire';
    onUpdateStepStatus(step.id, nextStatus);
  };

  return (
    <div className="w-full flex flex-col gap-6" id="sales-plan-root">
      
      {/* Top Banner Progress */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6 lg:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden" id="sales-plan-progress-header">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,160,226,0.12),transparent_100%)] pointer-events-none" />
        
        <div className="flex-1 flex flex-col gap-1.5" id="sales-plan-progress-labels">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Plan opérationnel de transaction</span>
          <h3 className="text-xl font-black text-white tracking-tight">Fil directeur de votre vente</h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Suivez d'un coup d'œil l'avancement chronologique de la transaction, étape par étape, depuis l'estimation initiale jusqu'à la signature de l'acte authentique chez le notaire.
          </p>
        </div>

        {/* Big circular progress or bar */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-5 shrink-0 z-10" id="sales-plan-progress-box">
          <div className="flex flex-col text-right" id="progress-box-text">
            <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">ÉTAPES VALIDÉES</span>
            <span className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{completedSteps} / {totalSteps}</span>
            <span className="text-[10px] text-slate-300 font-semibold mt-1">({completionPercent}% d'accomplissement)</span>
          </div>
          <div className="w-px h-12 bg-slate-800" />
          <div className="w-16 h-16 relative" id="progress-svg-container">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="#1e293b" strokeWidth="4.5" fill="transparent" />
              <circle cx="32" cy="32" r="28" stroke="#00A0E2" strokeWidth="4.5" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - completionPercent / 100)} 
                      className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white font-mono">
              {completionPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Steps Vertical Timeline layout */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-6" id="sales-plan-timeline-card">
        
        <div className="flex justify-between items-center border-b border-slate-50 pb-4" id="timeline-card-header">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-[#00A0E2]" />
              Chronologie des étapes de vente iad
            </h4>
            <p className="text-xs text-slate-500">
              {isAdmin && !readOnly
                ? "Cliquez directement sur n'importe quelle étape pour faire évoluer son statut (À faire → En cours → Terminé)."
                : "Consultez le statut de préparation, d'administration et de commercialisation de votre maison."
              }
            </p>
          </div>

          <div className="flex gap-4 text-[10px] font-bold text-slate-400 shrink-0" id="timeline-legend">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Terminé</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00A0E2]" /> En cours</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> À faire</span>
          </div>
        </div>

        {/* Timeline Line Grid */}
        <div className="relative pl-6 sm:pl-10 flex flex-col gap-5 mt-2" id="timeline-items-flow">
          {/* Timeline background vertical line */}
          <div className="absolute left-[13px] sm:left-[21px] top-4 bottom-4 w-1 bg-slate-100 z-0 rounded-full" />

          {sortedSteps.map((step, index) => {
            const isCompleted = step.status === 'Terminé';
            const isInProgress = step.status === 'En cours';
            
            return (
              <div 
                key={step.id}
                id={`timeline-item-${step.id}`}
                onClick={() => handleCycleStatus(step)}
                className={`relative z-10 p-4.5 rounded-2xl border text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 group ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${getStatusStyle(step.status)} hover:shadow-sm`}
              >
                {/* Number & Icon indicators on the absolute left outside the card */}
                <div 
                  className={`absolute -left-[23px] sm:-left-[35px] top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-[10px] font-black font-mono transition-all z-10 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isInProgress 
                        ? 'bg-[#00A0E2] border-[#00A0E2] text-white animate-pulse' 
                        : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'
                  }`}
                  id={`timeline-bullet-${step.id}`}
                >
                  {isCompleted ? '✓' : step.order}
                </div>

                {/* Step Info Content */}
                <div className="flex-1 flex flex-col gap-1 pr-4" id={`timeline-content-${step.id}`}>
                  <div className="flex items-center gap-2.5 flex-wrap" id={`timeline-title-row-${step.id}`}>
                    <h5 className={`text-xs font-black tracking-tight ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {step.title}
                    </h5>
                    {getResponsibleLabel(step.responsible)}
                  </div>
                  <p className={`text-[11px] leading-relaxed mt-0.5 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                    {step.description}
                  </p>
                  {isCompleted && step.completedDate && (
                    <span className="text-[9px] text-emerald-600 font-bold font-mono mt-1">
                      Validé le {step.completedDate}
                    </span>
                  )}
                </div>

                {/* Status Selector Trigger */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" id={`timeline-status-badge-${step.id}`}>
                  <span className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded border transition-colors ${
                    isCompleted 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : isInProgress 
                        ? 'bg-[#00A0E2]/10 border-[#00A0E2]/20 text-[#00A0E2]' 
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    {step.status}
                  </span>
                  
                  {!readOnly && (
                    <div className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <RefreshCw className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-300 group-hover:rotate-45" />
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
