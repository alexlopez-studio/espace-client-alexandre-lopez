import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Award,
  ShieldCheck,
  TrendingUp,
  Building2,
  Users,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Globe2,
  Camera,
  Layers,
  FileCheck,
  Scale,
  Handshake,
  Star,
  MapPin,
  ArrowRight,
  Clock,
  Laptop
} from 'lucide-react';
import type { AdvisorInfo, ClientInfo, SoldPropertyByIad } from '../types';

interface WhyMeSectionProps {
  advisor: AdvisorInfo;
  client?: ClientInfo;
  iadTrackRecord?: SoldPropertyByIad[];
}

export default function WhyMeSection({ advisor, client, iadTrackRecord }: WhyMeSectionProps) {
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [isMeetingBooked, setIsMeetingBooked] = useState(false);

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const hasTrackRecord = iadTrackRecord && iadTrackRecord.length > 0;

  const handleBookMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingDate && meetingTime) {
      setIsMeetingBooked(true);
    }
  };

  const iadStrengths = [
    {
      icon: Users,
      title: '+15 000 conseillers en synergie',
      description: 'Votre bien est partagé en direct avec l’ensemble du réseau iad et leur vivier d’acquéreurs qualifiés en France et en Europe.',
    },
    {
      icon: Globe2,
      title: 'Diffusion multicanale 100% maximale',
      description: 'Visibilité prioritaire sur plus de 100 portails nationaux et internationaux (SeLoger, Leboncoin, Belles Demeures, Logic-Immo, Figaro...).',
    },
    {
      icon: Building2,
      title: 'Modèle agile & honoraires justes',
      description: 'Sans vitrine physique coûteuse inutile, nous investissons là où sont les acheteurs : sur le digital et la promotion active de votre bien.',
    },
    {
      icon: ShieldCheck,
      title: 'Sécurisation juridique & financière',
      description: 'Encadrement par un réseau de partenaires certifiés : juristes, offices notariaux, courtiers en crédit et diagnostiqueurs.',
    },
  ];

  const advisorStrengths = [
    {
      icon: Handshake,
      title: 'Un interlocuteur unique & dédié 7j/7',
      description: 'Je gère personnellement votre projet de bout en bout, avec une disponibilité continue et un investissement total.',
    },
    {
      icon: Laptop,
      title: 'Transparence absolue & Espace Client',
      description: 'Accédez à votre portail dédié en temps réel : comptes-rendus de visite sous 24h, statistiques de diffusion et suivi des offres.',
    },
    {
      icon: Camera,
      title: 'Valorisation & Marketing d’excellence',
      description: 'Reportage photo professionnel, mise en valeur soignée des atouts de votre propriété et ciblage précis des acheteurs.',
    },
    {
      icon: FileCheck,
      title: 'Filtrage strict & validation du financement',
      description: 'Aucune visite de complaisance : vérification systématique de la faisabilité financière et validation bancaire des acquéreurs.',
    },
  ];

  const commitments = [
    {
      step: '01',
      title: 'Avis de valeur objectif & argumenté',
      desc: 'Une estimation chirurgicale basée sur l’analyse du marché réel local pour vendre au meilleur prix sans délai superflu.',
    },
    {
      step: '02',
      title: 'Stratégie de communication percutante',
      desc: 'Mise en avant ciblée de votre bien auprès des acheteurs finançables et diffusion massive sur les canaux leaders.',
    },
    {
      step: '03',
      title: 'Comptes-rendus systématiques sous 24h',
      desc: 'Un retour exhaustif après chaque visite consigné directement dans votre espace client pour un suivi limpide.',
    },
    {
      step: '04',
      title: 'Négociation rigoureuse à vos côtés',
      desc: 'Défense ferme de vos intérêts financiers pour maximiser la valeur de votre patrimoine.',
    },
    {
      step: '05',
      title: 'Gestion administrative & notariée complète',
      desc: 'Préparation du dossier technique, liaison notaire et suivi juridique jusqu’à la signature de l’acte authentique.',
    },
    {
      step: '06',
      title: 'Accompagnement continu & bienveillant',
      desc: 'Conseils sur-mesure, assistance déménagement / conciergerie iad et écoute permanente.',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 lg:p-4" id="why-me-section-container">
      {/* Hero Banner with Direct CTA */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-800 overflow-hidden" id="why-me-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,160,226,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.15),transparent_40%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00A0E2]/20 border border-[#00A0E2]/40 text-[#00A0E2] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Pourquoi me choisir ?</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>99% de clients satisfaits</span>
            </div>
          </div>

          <div className="max-w-3xl flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              La force du <span className="text-[#00A0E2]">n°1 de l'immobilier</span>, l'engagement d'un conseiller dédié.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Pour concrétiser la vente de votre bien au meilleur prix et en toute sérénité, bénéficiez de l'alliance parfaite entre la puissance commerciale du réseau iad et un accompagnement sur-mesure de proximité.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-[#00A0E2]">N°1</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Réseau mandataire France</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">+15 000</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Conseillers en synergie</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-cyan-400">100%</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Multi-diffusion portails</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-400">1 Seul</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5">Interlocuteur de A à Z</div>
            </div>
          </div>

          {/* Hero Quick CTA */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {advisor.phone && (
              <a
                href={`tel:${advisor.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00A0E2] hover:bg-[#008ec9] text-white text-xs font-bold shadow-lg shadow-[#00A0E2]/30 transition-all transform hover:-translate-y-0.5"
                id="why-me-call-btn"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler {advisor.name}</span>
              </a>
            )}
            {advisor.email && (
              <a
                href={`mailto:${advisor.email}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all"
                id="why-me-mail-btn"
              >
                <Mail className="w-4 h-4" />
                <span>Échanger par email</span>
              </a>
            )}
            <a
              href="#strategic-appointment"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all ml-auto"
            >
              <Calendar className="w-4 h-4 text-[#00A0E2]" />
              <span>Planifier un rendez-vous</span>
            </a>
          </div>
        </div>
      </div>

      {/* Dual Pillar: La Puissance iad vs Mon Accompagnement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="why-me-pillars-grid">
        {/* Pillar 1: La puissance du réseau iad */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6" id="pillar-iad">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-[#00A0E2]/10 text-[#00A0E2] flex items-center justify-center font-black">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Le Réseau N°1</span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">La puissance de frappe iad</h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {iadStrengths.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#00A0E2]/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#00A0E2]/10 text-[#00A0E2] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pillar 2: Mon Profil & Mon Engagement */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6" id="pillar-advisor">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            {advisor.avatar ? (
              <img
                src={advisor.avatar}
                alt={advisor.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#00A0E2]/40 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                {advisor.name.slice(0, 1)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Votre Conseiller Dédié</span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Mon engagement personnel</h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {advisorStrengths.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Track Record : Biens vendus dans le secteur */}
      {hasTrackRecord && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8" id="why-me-track-record">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Preuve d’efficacité locale</span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-[#00A0E2]" />
                Nos biens vendus dans le secteur
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">{iadTrackRecord.length} référence{iadTrackRecord.length > 1 ? 's' : ''} enregistrée{iadTrackRecord.length > 1 ? 's' : ''}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {iadTrackRecord.map((property) => (
              <div
                key={property.id}
                className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 hover:shadow-md hover:border-[#00A0E2]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Vendu
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{property.soldDate}</span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">{property.title}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                      {property.type}
                    </span>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {property.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-extrabold text-[#00A0E2]">
                    {formatEuro(property.price)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {property.pricePerSqm} €/m²
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 Commitments Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6" id="why-me-commitments">
        <div className="flex flex-col gap-1 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Charte de confiance</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mes 6 engagements pour la réussite de votre vente</h2>
          <p className="text-xs text-slate-500 mt-1">Un processus clair, rigoureux et transparent pour transformer votre projet en succès.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {commitments.map((item, idx) => (
            <div key={idx} className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#00A0E2] bg-[#00A0E2]/10 px-2 py-0.5 rounded-md">
                  Étape {item.step}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Conversion Section & Appointment Booker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="strategic-appointment">
        {/* Left Column: Direct Call / Profile Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-56 h-56 bg-[#00A0E2] rounded-full opacity-10 filter blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-3">
              {advisor.avatar ? (
                <img
                  src={advisor.avatar}
                  alt={advisor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#00A0E2]/40 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-lg">
                  {advisor.name.slice(0, 1)}
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Votre Conseiller Privilégié</span>
                <h3 className="text-xl font-black text-white">{advisor.name}</h3>
                <p className="text-xs text-slate-400">{advisor.title}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
              Prêt à concrétiser votre vente dans les meilleures conditions ? Je suis à votre entière disposition pour répondre à toutes vos questions, affiner la stratégie et lancer la commercialisation de votre bien.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {advisor.phone && (
                <a
                  href={`tel:${advisor.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#00A0E2] hover:bg-[#008ec9] text-white font-bold text-xs shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-medium text-white/80">Téléphone direct</span>
                    <span>{advisor.phone}</span>
                  </div>
                </a>
              )}

              {advisor.email && (
                <a
                  href={`mailto:${advisor.email}`}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all truncate"
                >
                  <Mail className="w-4 h-4 text-[#00A0E2] shrink-0" />
                  <div className="flex flex-col text-left truncate min-w-0">
                    <span className="text-[10px] font-medium text-slate-400">Courriel direct</span>
                    <span className="truncate">{advisor.email}</span>
                  </div>
                </a>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 relative z-10">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Estimation confidentielle & sans engagement. Mandat encadré juridiquement.</span>
          </div>
        </div>

        {/* Right Column: Appointment Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col justify-between gap-5" id="booker-card">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Discutons de votre projet</span>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-[#00A0E2]" />
              Planifier un débriefing
            </h3>
            <p className="text-xs text-slate-500">Choisissez une date pour échanger ensemble sur votre estimation et la mise en vente.</p>
          </div>

          <AnimatePresence mode="wait">
            {!isMeetingBooked ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleBookMeeting}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Date souhaitée</label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20 focus:border-[#00A0E2]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Créneau horaire</label>
                  <select
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A0E2]/20 focus:border-[#00A0E2]"
                  >
                    <option value="">Sélectionnez une heure...</option>
                    <option value="09:00">09:00 - Matinée</option>
                    <option value="11:00">11:00 - Fin de matinée</option>
                    <option value="14:00">14:00 - Début d'après-midi</option>
                    <option value="16:30">16:30 - Fin d'après-midi</option>
                    <option value="18:30">18:30 - Soirée</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00A0E2] hover:bg-[#008ec9] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-1"
                >
                  <span>Confirmer la demande de rendez-vous</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-emerald-900">Demande enregistrée !</h4>
                <p className="text-xs text-emerald-700">
                  Votre demande pour le <span className="font-bold">{meetingDate}</span> à <span className="font-bold">{meetingTime}</span> a bien été transmise à {advisor.name}. Vous recevrez une confirmation rapidement.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
