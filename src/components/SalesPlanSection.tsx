import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  User, 
  CheckSquare,
  RefreshCw,
  Users,
  Rocket,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Camera,
  Eye,
  PenTool,
  BarChart3,
  Footprints,
  Handshake,
  FileCheck,
  Key
} from 'lucide-react';
import { SalesStep } from '../types';

interface SalesPlanSectionProps {
  salesSteps: SalesStep[];
  onUpdateStepStatus: (id: string, status: SalesStep['status']) => void;
  isAdmin?: boolean;
  readOnly?: boolean;
}

function getStepIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('estimation') || t.includes('avis')) return BarChart3;
  if (t.includes('mandat') || t.includes('signature')) return PenTool;
  if (t.includes('photo') || t.includes('shooting')) return Camera;
  if (t.includes('virtuelle') || t.includes('3d')) return Eye;
  if (t.includes('diffusion') || t.includes('annonce') || t.includes('mise en ligne')) return Rocket;
  if (t.includes('visite')) return Footprints;
  if (t.includes('offre')) return Handshake;
  if (t.includes('compromis') || t.includes('promesse')) return FileCheck;
  if (t.includes('acte') || t.includes('clé') || t.includes('cles') || t.includes('authentique')) return Key;
  return Sparkles;
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
  const completionPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // View Mode: 'stepper' (Horizontal Stepper Timeline) or 'list' (Classic Vertical List)
  const [viewMode, setViewMode] = useState<'stepper' | 'list'>('stepper');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Automatically select the active step (first 'En cours' or 'A faire', otherwise last step)
  useEffect(() => {
    if (sortedSteps.length === 0) return;
    const activeIdx = sortedSteps.findIndex(s => s.status === 'En cours' || s.status === 'A faire');
    if (activeIdx !== -1) {
      setSelectedIndex(activeIdx);
    } else {
      setSelectedIndex(sortedSteps.length - 1);
    }
  }, [salesSteps.length]);

  const selectedStep = sortedSteps[selectedIndex] ?? sortedSteps[0];

  const getResponsibleLabel = (resp: SalesStep['responsible']) => {
    switch (resp) {
      case 'Conseiller':
        return (
          <span className="inline-flex items-center gap-1 bg-[#00A0E2]/10 text-[#00A0E2] text-[10px] font-bold px-2 py-0.5 rounded-md">
            <User className="w-3 h-3" />
            <span>Olivier (iad)</span>
          </span>
        );
      case 'Vendeur':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-100">
            <Users className="w-3 h-3" />
            <span>Vendeur</span>
          </span>
        );
      case 'Tous':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">
            <Users className="w-3 h-3" />
            <span>Ensemble</span>
          </span>
        );
    }
  };

  const handleCycleStatus = (step: SalesStep) => {
    if (readOnly) return;
    let nextStatus: SalesStep['status'] = 'A faire';
    if (step.status === 'A faire') nextStatus = 'En cours';
    else if (step.status === 'En cours') nextStatus = 'Terminé';
    else if (step.status === 'Terminé') nextStatus = 'A faire';
    onUpdateStepStatus(step.id, nextStatus);
  };

  const lastCompletedIdx = sortedSteps.reduce(
    (acc, step, idx) => (step.status === 'Terminé' ? idx : acc),
    -1
  );

  const activeProgressWidth = totalSteps <= 1 ? 0 : Math.min(100, Math.max(0, (Math.max(lastCompletedIdx, selectedIndex) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full flex flex-col gap-6" id="sales-plan-root">
      
      {/* Top Banner Progress */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6 lg:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden" id="sales-plan-progress-header">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,160,226,0.12),transparent_100%)] pointer-events-none" />
        
        <div className="flex-1 flex flex-col gap-1.5" id="sales-plan-progress-labels">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Plan opérationnel de transaction</span>
          <h3 className="text-xl font-black text-white tracking-tight">Fil directeur de votre vente</h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Suivez d'un coup d'œil l'avancement chronologique de la transaction, étape par étape, depuis l'estimation initiale jusqu'à la signature de l'acte authentique.
          </p>
        </div>

        {/* Circular Progress & View Switcher */}
        <div className="flex items-center gap-4 shrink-0 z-10">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shrink-0" id="sales-plan-progress-box">
            <div className="flex flex-col text-right" id="progress-box-text">
              <span className="text-[9px] text-slate-400 font-bold uppercase">ÉTAPES VALIDÉES</span>
              <span className="text-xl font-black text-emerald-400 mt-0.5">{completedSteps} / {totalSteps}</span>
              <span className="text-[10px] text-slate-300 font-semibold mt-0.5">({completionPercent}%)</span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="w-14 h-14 relative" id="progress-svg-container">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                <circle cx="28" cy="28" r="24" stroke="#00A0E2" strokeWidth="4" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 24}
                        strokeDashoffset={2 * Math.PI * 24 * (1 - completionPercent / 100)} 
                        className="transition-all duration-700" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                {completionPercent}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-6" id="sales-plan-timeline-card">
        
        {/* Header & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4" id="timeline-card-header">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#00A0E2]" />
              Chronologie des étapes de vente iad
            </h4>
            <p className="text-xs text-slate-500">
              {!readOnly
                ? "Cliquez sur une étape pour consulter ses détails ou mettre à jour son statut."
                : "Consultez le statut de préparation, d'administration et de commercialisation."
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('stepper')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'stepper'
                    ? 'bg-white text-[#00A0E2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Stepper</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#00A0E2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Liste</span>
              </button>
            </div>
          </div>
        </div>

        {sortedSteps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center" id="empty-sales-plan-message">
            <CheckSquare className="mx-auto h-7 w-7 text-slate-300" />
            <p className="mt-3 text-xs font-bold text-slate-700">Aucune étape de vente publiée pour le moment</p>
            <p className="mt-1 text-[11px] text-slate-400">Votre conseiller affichera ici les étapes du suivi dès qu’elles seront prêtes.</p>
          </div>
        ) : viewMode === 'stepper' ? (
          <div className="flex flex-col gap-6" id="horizontal-stepper-view">
            
            {/* Horizontal Stepper Node Bar */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 overflow-x-auto scrollbar-thin">
              <div className="relative min-w-max px-6 py-3">
                {/* Connecting Track Line */}
                <div className="absolute left-10 right-10 top-8 h-1 bg-slate-200 rounded-full z-0" />
                <div 
                  className="absolute left-10 h-1 bg-gradient-to-r from-emerald-500 via-[#00A0E2] to-cyan-500 rounded-full z-0 transition-all duration-500"
                  style={{ width: `calc(${activeProgressWidth}% * (100% - 80px) / 100)` }}
                />

                {/* Stepper Nodes */}
                <div className="flex items-start justify-between gap-8 relative z-10">
                  {sortedSteps.map((step, index) => {
                    const isCompleted = step.status === 'Terminé';
                    const isInProgress = step.status === 'En cours';
                    const isSelected = index === selectedIndex;
                    const StepIconComp = getStepIcon(step.title);

                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className="group flex flex-col items-center gap-2 focus:outline-none min-w-28 text-center"
                      >
                        {/* Circle Node */}
                        <div
                          className={`flex w-11 h-11 items-center justify-center rounded-full text-xs font-black transition-all duration-200 border-2 bg-white ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : isInProgress
                              ? 'border-[#00A0E2] bg-[#00A0E2] text-white animate-pulse shadow-sm'
                              : 'border-slate-200 text-slate-400 group-hover:border-[#00A0E2]/50 group-hover:text-slate-700'
                          } ${
                            isSelected ? 'ring-4 ring-[#00A0E2]/30 scale-110 border-[#00A0E2] font-black z-20' : ''
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-5 h-5 stroke-[3]" />
                          ) : (
                            <StepIconComp className="w-4 h-4" />
                          )}
                        </div>

                        {/* Node Short Label */}
                        <div className="flex flex-col items-center gap-1 max-w-32">
                          <span 
                            className={`text-xs font-bold truncate leading-snug ${
                              isSelected ? 'text-[#00A0E2]' : isCompleted ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'
                            }`}
                            title={step.title}
                          >
                            {step.order}. {step.title}
                          </span>

                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border transition-colors ${
                            isCompleted 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                              : isInProgress 
                                ? 'bg-[#00A0E2]/10 border-[#00A0E2]/20 text-[#00A0E2]' 
                                : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Selected Step Inspector Card */}
            {selectedStep && (
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col gap-5 shadow-xs">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex w-10 h-10 items-center justify-center rounded-xl border border-[#00A0E2]/20 bg-[#00A0E2]/10 text-[#00A0E2] text-sm font-black shrink-0">
                      #{selectedStep.order}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                          {selectedStep.title}
                        </h4>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          selectedStep.status === 'Terminé'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : selectedStep.status === 'En cours'
                            ? 'bg-[#00A0E2]/10 border-[#00A0E2]/30 text-[#00A0E2]'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {selectedStep.status}
                        </span>
                        {getResponsibleLabel(selectedStep.responsible)}
                      </div>
                      {selectedStep.completedDate && (
                        <span className="text-xs text-emerald-600 font-semibold">
                          Validé le {selectedStep.completedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Node Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={selectedIndex === 0}
                      onClick={() => setSelectedIndex(prev => Math.max(0, prev - 1))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Précédent
                    </button>
                    <button
                      type="button"
                      disabled={selectedIndex === totalSteps - 1}
                      onClick={() => setSelectedIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                    >
                      Suivant
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Description & Détails de l'action
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {selectedStep.description || "Aucun détail complémentaire pour cette étape."}
                  </p>
                </div>

                {/* Status Toggle Action Button */}
                {!readOnly && (
                  <div className="flex justify-end border-t border-slate-200/60 pt-4">
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(selectedStep)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-slate-800 hover:border-[#00A0E2] hover:text-[#00A0E2] shadow-2xs transition-all group"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#00A0E2] group-hover:rotate-45 transition-transform duration-300" />
                      Faire évoluer le statut : {selectedStep.status === 'A faire' ? 'Passer en cours' : selectedStep.status === 'En cours' ? 'Marquer terminé' : 'Remettre à faire'}
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        ) : (
          /* Classic Vertical List View Mode */
          <div className="relative pl-6 sm:pl-10 flex flex-col gap-5 mt-2" id="timeline-items-flow">
            <div className="absolute left-[13px] sm:left-[21px] top-4 bottom-4 w-1 bg-slate-100 z-0 rounded-full" />

            {sortedSteps.map((step) => {
              const isCompleted = step.status === 'Terminé';
              const isInProgress = step.status === 'En cours';
              
              return (
                <div 
                  key={step.id}
                  id={`timeline-item-${step.id}`}
                  onClick={() => handleCycleStatus(step)}
                  className={`relative z-10 p-4.5 rounded-2xl border text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 group ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
                    isCompleted ? 'border-emerald-200 bg-emerald-50/20 text-emerald-800' : isInProgress ? 'border-[#00A0E2]/30 bg-[#00A0E2]/5 text-[#00A0E2]' : 'border-slate-100 bg-white text-slate-400'
                  } hover:shadow-sm`}
                >
                  <div 
                    className={`absolute -left-[23px] sm:-left-[35px] top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-all z-10 ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : isInProgress 
                          ? 'bg-[#00A0E2] border-[#00A0E2] text-white animate-pulse' 
                          : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'
                    }`}
                  >
                    {isCompleted ? '✓' : step.order}
                  </div>

                  <div className="flex-1 flex flex-col gap-1 pr-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h5 className={`text-xs font-black tracking-tight ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                        {step.title}
                      </h5>
                      {getResponsibleLabel(step.responsible)}
                    </div>
                    <p className={`text-[11px] leading-relaxed mt-0.5 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                      {step.description}
                    </p>
                    {isCompleted && step.completedDate && (
                      <span className="text-[9px] text-emerald-600 font-bold mt-1">
                        Validé le {step.completedDate}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border transition-colors ${
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
        )}

      </div>

    </div>
  );
}
