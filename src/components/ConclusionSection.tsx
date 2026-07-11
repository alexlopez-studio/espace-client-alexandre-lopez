import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  CheckSquare, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Briefcase,
  Smartphone,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { advisorInfo as defaultAdvisorInfo, clientInfo as defaultClientInfo } from '../data';

interface ConclusionSectionProps {
  clientInfo?: typeof defaultClientInfo;
  advisorInfo?: typeof defaultAdvisorInfo;
  recommendedPriceRange?: { low: number; high: number };
  propertySize?: number;
}

export default function ConclusionSection({ 
  clientInfo: propClient, 
  advisorInfo: propAdvisor, 
  recommendedPriceRange,
  propertySize = 125 
}: ConclusionSectionProps) {
  const activeClient = propClient || defaultClientInfo;
  const activeAdvisor = propAdvisor || defaultAdvisorInfo;
  const activePriceRange = recommendedPriceRange || { low: 400000, high: 420000 };

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  const formattedLow = formatEuro(activePriceRange.low);
  const formattedHigh = formatEuro(activePriceRange.high);
  const formattedLowPerSqm = formatEuro(Math.round(activePriceRange.low / propertySize));
  const formattedHighPerSqm = formatEuro(Math.round(activePriceRange.high / propertySize));

  const [activeStep, setActiveStep] = useState<number>(0);
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [meetingTime, setMeetingTime] = useState<string>('');
  const [isMeetingBooked, setIsMeetingBooked] = useState<boolean>(false);

  const [checklist, setChecklist] = useState([
    { id: 1, text: `Validation de la stratégie de prix de présentation (entre ${formattedLow} et ${formattedHigh})`, checked: true },
    { id: 2, text: "Constitution du dossier technique (Diagnostics immobiliers obligatoire : DPE, électricité, termites)", checked: false },
    { id: 3, text: "Reportage photos professionnel de valorisation par un photographe partenaire iad", checked: false },
    { id: 4, text: "Rédaction et optimisation de l'annonce immobilière ciblée", checked: false },
    { id: 5, text: "Lancement de la diffusion de l'annonce sur plus de 100 portails immobiliers nationaux & internationaux", checked: false },
    { id: 6, text: "Qualification et validation de la solvabilité financière des futurs acquéreurs avant visite", checked: false },
  ]);

  // Keep checklist ID 1 text in sync if props change
  React.useEffect(() => {
    setChecklist(prev => prev.map(item => item.id === 1 ? { ...item, text: `Validation de la stratégie de prix de présentation (entre ${formattedLow} et ${formattedHigh})` } : item));
  }, [formattedLow, formattedHigh]);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleBookMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingDate && meetingTime) {
      setIsMeetingBooked(true);
    }
  };

  const steps = [
    { title: "Estimation & Conseil", desc: `Avis de valeur certifié établi à ${Math.round(activePriceRange.low/1000)}k - ${Math.round(activePriceRange.high/1000)}k € sur la base des comparables locaux.`, icon: FileCheck },
    { title: "Préparation & Shooting", desc: "Mise en scène (home staging) et photographies haute définition pour sublimer le bien.", icon: Briefcase },
    { title: "Diffusion & Visites", desc: "Publication immédiate sur les plus grands portails immobiliers et qualification des offres.", icon: ShieldCheck },
  ];

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="conclusion-section-container">
      
      {/* Recommended Price Certificate (Avis de Valeur Certifié) */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-3xl p-8 lg:p-10 shadow-xl border border-slate-800 relative overflow-hidden text-center flex flex-col items-center gap-6" id="certified-value-card">
        {/* Background seal badge effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,160,226,0.12),transparent_100%)] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-[#00A0E2] rounded-full opacity-10 filter blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -top-24 w-64 h-64 bg-emerald-500 rounded-full opacity-10 filter blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center gap-1.5 z-10" id="certificate-header">
          <div className="w-12 h-12 rounded-full bg-[#00A0E2]/10 border border-[#00A0E2]/30 flex items-center justify-center text-[#00A0E2] mb-1.5 animate-pulse">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest">Avis de valeur officiel • iad france</span>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-none">Estimation recommandée de vente</h2>
          <p className="text-xs text-slate-300 max-w-lg mt-1">Établi par votre conseiller après étude approfondie des données réelles du marché en date du {activeClient.date}.</p>
        </div>

        {/* Big Certificate Price Numbers */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl py-6 px-8 lg:px-16 flex flex-col md:flex-row items-center gap-6 lg:gap-16 z-10 shadow-inner mt-2" id="certificate-price-box">
          <div className="flex flex-col text-center md:text-left" id="cert-val-range">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Prix de vente conseillé</span>
            <span className="text-3xl lg:text-4xl font-black text-emerald-400 font-mono tracking-tight mt-1">{formattedLow} - {formattedHigh}</span>
          </div>
          <div className="w-px h-10 bg-slate-800 hidden md:block" />
          <div className="flex flex-col text-center md:text-left" id="cert-val-sqm">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">Prix au m² correspondant</span>
            <span className="text-lg lg:text-xl font-black text-slate-200 font-mono mt-1">{formattedLowPerSqm} - {formattedHighPerSqm} / m²</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed z-10 mt-1">
          Cette recommandation tarifaire vise à positionner votre maison de manière stratégique sur la <span className="text-white font-semibold">fourchette haute d'attractivité</span> du marché. Elle permet d'attirer un volume maximal d'acquéreurs qualifiés dès le premier mois tout en préservant une marge de négociation saine.
        </p>
      </div>

      {/* Split Grid: Next Steps Interactive Checklist & Appointment Booker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="conclusion-split-grid">
        
        {/* Left Column: Next Steps Roadmap Checklist (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-5" id="onboarding-checklist-card">
          <div className="flex flex-col gap-1" id="checklist-header">
            <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-wider">Roadmap opérationnelle</span>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <CheckSquare className="w-5 h-5 text-emerald-600 animate-pulse" />
              Plan d'action pour la mise en vente
            </h3>
            <p className="text-xs text-slate-500">Cochez les étapes clés de préparation que nous allons mener ensemble pour réussir votre transaction.</p>
          </div>

          <div className="flex flex-col gap-3 mt-1" id="checklist-interactive-items">
            {checklist.map((item) => (
              <button
                key={item.id}
                id={`btn-checklist-item-${item.id}`}
                onClick={() => toggleChecklist(item.id)}
                className={`w-full text-left p-4 rounded-2xl border text-xs flex items-start gap-3.5 transition-all group ${
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
                <span className="font-semibold leading-relaxed">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Appointment Booker (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5" id="appointment-booker-card">
          <div className="flex flex-col gap-1" id="booker-header">
            <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-wider">Prendre rendez-vous</span>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-[#00A0E2]" />
              Planifier un débriefing stratégique
            </h3>
            <p className="text-xs text-slate-500">Choisissez un créneau horaire pour faire le point sur cette estimation avec {activeAdvisor.name}.</p>
          </div>

          <AnimatePresence mode="wait">
            {!isMeetingBooked ? (
              <motion.form 
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleBookMeeting}
                className="flex flex-col gap-4 mt-2"
                id="meeting-booker-form"
              >
                <div className="flex flex-col gap-1.5" id="form-group-date">
                  <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Date souhaitée</label>
                  <input 
                    id="input-meeting-date"
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5" id="form-group-time">
                  <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">Heure de rendez-vous</label>
                  <select 
                    id="select-meeting-time"
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                  >
                    <option value="">Sélectionner une heure</option>
                    <option value="09:00">09:00 - Matin</option>
                    <option value="10:30">10:30 - Matin</option>
                    <option value="14:00">14:00 - Après-midi</option>
                    <option value="16:00">16:00 - Après-midi</option>
                    <option value="18:30">18:30 - Fin de journée</option>
                  </select>
                </div>

                <button 
                  id="btn-confirm-meeting"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#00A0E2]/20 mt-2 transition-all"
                >
                  <span>Confirmer le rendez-vous</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="booking-confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 text-center flex flex-col items-center gap-4 py-8 mt-2"
                id="booking-success-panel"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">Rendez-vous pré-enregistré !</h4>
                  <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
                    {activeAdvisor.name} a bien reçu votre demande pour le <span className="font-extrabold">{new Date(meetingDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> à <span className="font-extrabold">{meetingTime}</span>. Un email de confirmation vient de vous être envoyé.
                  </p>
                </div>
                <button 
                  id="btn-reset-meeting"
                  onClick={() => setIsMeetingBooked(false)}
                  className="text-xs text-[#00A0E2] font-semibold hover:underline mt-2"
                >
                  Modifier le créneau
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
