import { useState } from 'react';
import { 
  Compass, 
  CheckSquare, 
  ShieldCheck, 
  CheckCircle, 
  CheckCircle2, 
  FileCheck, 
  Sparkles, 
  LockKeyhole, 
  FolderOpen, 
  BarChart3, 
  Globe2, 
  Handshake, 
  Award,
} from 'lucide-react';
import type { AdvisorInfo, ClientInfo } from '../types';

interface ActionPlanSectionProps {
  advisor: AdvisorInfo;
  client: ClientInfo;
  recommendedPriceRange?: { low: number; high: number };
  onStartFollowUp?: () => void;
}

export default function ActionPlanSection({
  advisor,
  client,
  recommendedPriceRange,
}: ActionPlanSectionProps) {
  const [activeTeaserStep, setActiveTeaserStep] = useState(0);

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const lowText = recommendedPriceRange?.low ? formatEuro(recommendedPriceRange.low) : '470 000 €';
  const highText = recommendedPriceRange?.high ? formatEuro(recommendedPriceRange.high) : '520 000 €';

  const [checklist, setChecklist] = useState([
    { id: 1, text: `Validation de la stratégie de prix de présentation (entre ${lowText} et ${highText})`, checked: true, phase: 'Stratégie' },
    { id: 2, text: "Constitution du dossier technique (Diagnostics obligatoires : DPE, électricité, termites, assainissement)", checked: false, phase: 'Administratif' },
    { id: 3, text: "Reportage photos professionnel de valorisation par un photographe partenaire iad", checked: false, phase: 'Marketing' },
    { id: 4, text: "Rédaction et optimisation de l'annonce immobilière ciblée", checked: false, phase: 'Marketing' },
    { id: 5, text: "Lancement de la diffusion sur plus de 100 portails immobiliers nationaux & internationaux", checked: false, phase: 'Diffusion' },
    { id: 6, text: "Qualification et validation de la solvabilité financière des futurs acquéreurs avant visite", checked: false, phase: 'Sécurité' },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const commitments = [
    {
      step: '01',
      title: 'Valeur du bien objective & argumentée',
      desc: 'Une estimation chirurgicale basée sur l’analyse du marché réel local pour vendre au meilleur prix sans délai superflu.',
      icon: Award,
    },
    {
      step: '02',
      title: 'Stratégie de communication percutante',
      desc: 'Mise en avant ciblée de votre bien auprès des acheteurs finançables et diffusion massive sur les canaux leaders.',
      icon: Globe2,
    },
    {
      step: '03',
      title: 'Comptes-rendus systématiques sous 24h',
      desc: 'Un retour exhaustif après chaque visite consigné directement dans votre espace client pour un suivi limpide.',
      icon: CheckSquare,
    },
    {
      step: '04',
      title: 'Négociation rigoureuse à vos côtés',
      desc: 'Défense ferme de vos intérêts financiers pour maximiser la valeur de votre patrimoine.',
      icon: Handshake,
    },
    {
      step: '05',
      title: 'Gestion administrative & notariée complète',
      desc: 'Préparation du dossier technique, liaison notaire et suivi juridique jusqu’à la signature de l’acte authentique.',
      icon: FileCheck,
    },
    {
      step: '06',
      title: 'Accompagnement continu & bienveillant',
      desc: 'Conseils sur-mesure, assistance déménagement / conciergerie iad et écoute permanente.',
      icon: ShieldCheck,
    },
  ];

  const teaserSteps = [
    { number: 1, icon: FolderOpen, title: '1. Dossier vendeur', phase: 'Préparation', description: 'Centralisation de vos pièces administratives, titres de propriété, diagnostics techniques et documents légaux.' },
    { number: 2, icon: Compass, title: '2. Commercialisation', phase: 'Lancement', description: 'Élaboration du plan de vente personnalisé, shooting photo professionnel et diffusion ciblée sur les portails majeurs.' },
    { number: 3, icon: BarChart3, title: '3. Pilotage & Offres', phase: 'Suivi actif', description: 'Compte-rendu détaillé des visites en temps réel, analyse des propositions d’achat et accompagnement jusqu’au notaire.' },
  ];
  const currentTeaserStep = teaserSteps[activeTeaserStep];
  const CurrentTeaserIcon = currentTeaserStep.icon;

  return (
    <div className="w-full flex flex-col gap-8 lg:p-4" id="action-plan-section-container">
      
      {/* 1. Hero Header : Cap vers la vente */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-800 overflow-hidden" id="action-plan-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,160,226,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.15),transparent_40%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00A0E2]/20 border border-[#00A0E2]/40 text-[#00A0E2] text-xs font-bold tracking-wider uppercase">
              <Compass className="w-4 h-4" />
              <span>Prochaines étapes • Plan d'action</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5 text-[#00A0E2]" />
              <span>Méthode certifiée iad France</span>
            </div>
          </div>

          <div className="max-w-3xl flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              La feuille de route pour <span className="text-[#00A0E2]">concrétiser votre vente</span>.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Maintenant que la valeur de votre bien est établie, découvrez le déroulement chronologique des actions et nos 6 engagements d'excellence pour préparer la mise en vente avec {advisor.name}.
            </p>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-[#00A0E2]">6 Étapes</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Plan de lancement</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">6 Engagements</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Charte de confiance</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-cyan-400">&lt; 24h</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Comptes-rendus de visite</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-400">100% Sérénité</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Suivi de A à Z</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Onboarding Checklist */}
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-5" id="action-checklist-card">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Feuille de route opérationnelle</span>
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            Plan d'action pour la mise en vente
          </h3>
          <p className="text-xs text-slate-500">Cochez les étapes clés de préparation que nous allons mener ensemble pour réussir votre transaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1" id="checklist-interactive-items">
          {checklist.map((item) => (
            <button
              key={item.id}
              id={`btn-checklist-item-${item.id}`}
              onClick={() => toggleChecklist(item.id)}
              className={`w-full text-left p-4 rounded-2xl border text-xs flex items-start gap-3.5 transition-all group cursor-pointer ${
                item.checked 
                  ? 'bg-slate-50 border-slate-200 text-slate-500 line-through decoration-slate-300' 
                  : 'bg-white border-slate-100 text-slate-800 hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                item.checked 
                  ? 'bg-[#00A0E2] border-[#00A0E2] text-white' 
                  : 'border-slate-300 group-hover:border-[#00A0E2] text-transparent'
              }`}>
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold leading-relaxed">{item.text}</span>
                <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider not-italic">{item.phase}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Mes 6 engagements pour la réussite de votre vente */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6" id="action-plan-commitments">
        <div className="flex flex-col gap-1 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Charte de confiance certifiée</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mes 6 engagements pour la réussite de votre vente</h2>
          <p className="text-xs text-slate-500 mt-1">Un processus clair, rigoureux et transparent pour transformer votre projet en succès.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 hover:bg-slate-50 hover:border-[#00A0E2]/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#00A0E2] bg-[#00A0E2]/10 px-2 py-0.5 rounded-md">
                    Étape {item.step}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#00A0E2]" />
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Teaser interactif du suivi de vente une fois le mandat activé */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden" id="sales-followup-teaser-panel">
        <div className="relative p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,160,226,0.12),transparent_34%),linear-gradient(135deg,#fff,#f8fafc)] pointer-events-none" />
          
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00A0E2]/20 bg-[#00A0E2]/10 px-3 py-1 text-xs font-bold text-[#0077B6]">
              <LockKeyhole className="h-3.5 w-3.5" />
              Activé dès la signature du mandat
            </span>
            <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">Votre futur espace de suivi de vente en temps réel</h2>
            <p className="mt-2 text-sm text-slate-600">
              Dès l'activation de votre mandat de vente, votre portail client se transforme en cockpit complet : suivi des visites sous 24h, offres reçues, documents légaux et statistiques de visibilité.
            </p>
          </div>

          {/* Stepper Track */}
          <div className="relative mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-6 overflow-x-auto">
            <div className="relative min-w-max px-6 py-2">
              <div className="absolute left-10 right-10 top-7 h-1 bg-slate-200 rounded-full z-0" />
              <div 
                className="absolute left-10 h-1 bg-gradient-to-r from-[#00A0E2] to-cyan-500 rounded-full z-0 transition-all duration-500"
                style={{ width: `calc(${(activeTeaserStep / (teaserSteps.length - 1)) * 100}% * (100% - 80px) / 100)` }}
              />

              <div className="flex items-center justify-between gap-12 relative z-10">
                {teaserSteps.map((s, idx) => {
                  const IconComp = s.icon;
                  const isActive = idx === activeTeaserStep;
                  const isPassed = idx < activeTeaserStep;

                  return (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => setActiveTeaserStep(idx)}
                      className="flex flex-col items-center gap-2 text-center group cursor-pointer focus:outline-none min-w-32"
                    >
                      <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#00A0E2] border-[#00A0E2] text-white ring-4 ring-[#00A0E2]/25 scale-110 shadow-sm'
                          : isPassed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-slate-200 text-slate-400 group-hover:border-[#00A0E2]/60 group-hover:text-slate-700'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className={`text-xs font-bold transition-colors ${isActive ? 'text-[#00A0E2]' : 'text-slate-700'}`}>
                          {s.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{s.phase}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 bg-white border border-slate-200/70 rounded-xl p-5 flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#00A0E2]">
                <CurrentTeaserIcon className="w-4 h-4" />
                <span>Phase {currentTeaserStep.number} — {currentTeaserStep.phase}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                {currentTeaserStep.description}
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
