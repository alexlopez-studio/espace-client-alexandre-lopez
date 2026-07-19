import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ArrowRight,
  TrendingUp,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { ClientInfo, AdvisorInfo, PropertyDetails } from '../types';
import IadLogo from './IadLogo';

interface CoverSectionProps {
  client: ClientInfo;
  advisor: AdvisorInfo;
  propertyDetails: PropertyDetails;
  estimationStatus: 'empty' | 'draft' | 'published';
  mandateStage: string | null;
  mandateSignedAt: string | null;
  onStart: () => void;
}

export default function CoverSection({ client, advisor, propertyDetails, estimationStatus, mandateStage, mandateSignedAt, onStart }: CoverSectionProps) {
  const propertySummary = [
    propertyDetails.surface > 0 ? `${propertyDetails.surface} m²` : null,
    propertyDetails.rooms > 0 ? `${propertyDetails.rooms} pièce${propertyDetails.rooms > 1 ? 's' : ''}` : null,
    propertyDetails.landSurface > 0 ? `Terrain ${propertyDetails.landSurface} m²` : null,
  ].filter(Boolean).join(' • ');
  const location = getLocationLabel(client.address);
  const hasAdvisorContact = advisor.phone || advisor.email;
  const isMandateSigned = mandateStage === 'Mandat signé' || mandateStage === 'Vendu';
  const formattedMandateSignedAt = mandateSignedAt ? new Date(mandateSignedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const statusLabel = isMandateSigned
    ? (mandateStage === 'Vendu' ? 'Bien vendu' : 'Commercialisation en cours')
    : (estimationStatus === 'published' ? 'Estimation publiée' : 'Estimation en préparation');
  const stageLabel = mandateStage || 'Dossier en cours';

  return (
    <div className="w-full flex flex-col gap-8 lg:p-4" id="cover-section-container">
      {/* Welcome Card & Document Title */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 lg:p-12 relative flex flex-col gap-6" id="cover-intro-card">
        {/* Decorative subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="flex justify-between items-start z-10" id="cover-header-row">
          <IadLogo className="h-14 self-start" color="#00A0E2" showText={true} />
          <div className="flex items-center gap-2 bg-slate-100 text-slate-800 text-[11px] font-semibold tracking-wider px-3 py-1.5 rounded-full uppercase" id="cover-badge">
            <BadgeCheck className="w-3.5 h-3.5 text-[#00A0E2]" />
            {stageLabel}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 z-10" id="cover-titles">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
            id="cover-main-title"
          >
            {isMandateSigned ? "Commercialisation & Suivi de vente" : "Estimation & Préparation"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl lg:text-2xl text-[#00A0E2] font-semibold tracking-tight mt-1"
            id="cover-subtitle"
          >
            {propertySummary || statusLabel}
          </motion.p>
        </div>

        {/* Client & Date Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-b border-slate-100 mt-2 z-10" id="cover-details-grid">
          <div className="flex flex-col gap-1.5" id="cover-detail-client">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{isMandateSigned ? 'Vendeur' : 'À l\'attention de'}</span>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-50 text-slate-700 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{client.names}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5" id="cover-detail-address">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Adresse du bien</span>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-50 text-slate-700 rounded-lg">
                <MapPin className="w-4 h-4 text-[#00A0E2]" />
              </div>
              <span className="text-sm font-semibold text-slate-800 truncate" title={client.address}>
                {client.address}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5" id="cover-detail-date">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{isMandateSigned ? 'Date de signature' : 'Date de réalisation'}</span>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-50 text-slate-700 rounded-lg">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{isMandateSigned ? formattedMandateSignedAt || 'À renseigner' : client.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenic Hero Picture and Overlay Contact Card */}
      <div className="relative rounded-3xl overflow-hidden min-h-[420px] shadow-lg group" id="cover-hero-container">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,160,226,0.25),transparent_32%),linear-gradient(135deg,#0f172a,#1e293b_48%,#0f172a)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />

        {/* Large overlay title on top of picture */}
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl px-5 py-3 flex flex-col items-end" id="cover-location-tag">
          <span className="text-[10px] font-semibold tracking-widest uppercase opacity-75">Statut</span>
          <span className="text-sm font-bold tracking-tight">{statusLabel}</span>
          {location && <span className="mt-1 text-xs opacity-75">{location}</span>}
        </div>

        {/* Advisor card at the bottom left */}
        <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-100 flex flex-col md:flex-row items-center gap-5 shadow-2xl max-w-lg" id="cover-advisor-profile">
          {advisor.avatar ? (
            <img 
              src={advisor.avatar} 
              alt={advisor.name} 
              className="advisor-portrait w-16 h-16 rounded-full object-cover border-2 border-[#00A0E2]/30 shadow"
              referrerPolicy="no-referrer"
              id="cover-advisor-avatar"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00A0E2]/30 bg-slate-100 text-lg font-black text-slate-700">
              {advisor.name.slice(0, 1)}
            </div>
          )}
          <div className="flex-1 flex flex-col text-center md:text-left gap-1">
            <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Votre conseiller iad</span>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">{advisor.name}</h3>
            
            {hasAdvisorContact && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs text-slate-500 mt-1">
                {advisor.phone && (
                  <a href={`tel:${advisor.phone.replace(/\s/g, '')}`} className="flex items-center justify-center md:justify-start gap-1.5 hover:text-[#00A0E2] transition-colors" id="cover-phone-link">
                    <Phone className="w-3.5 h-3.5 text-[#00A0E2]" />
                    <span>{advisor.phone}</span>
                  </a>
                )}
                {advisor.email && (
                  <a href={`mailto:${advisor.email}`} className="flex items-center justify-center md:justify-start gap-1.5 hover:text-[#00A0E2] transition-colors" id="cover-email-link">
                    <Mail className="w-3.5 h-3.5 text-[#00A0E2]" />
                    <span className="truncate max-w-[150px] md:max-w-none">{advisor.email}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Start button at the bottom right */}
        <div className="absolute bottom-6 right-6 hidden md:block">
          <button
            id="btn-start-presentation"
            onClick={onStart}
            className="flex items-center gap-2 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-semibold px-6 py-4 rounded-2xl shadow-xl shadow-[#00A0E2]/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <span>
              {isMandateSigned
                ? "Accéder au suivi de vente"
                : (estimationStatus === "published" ? "Démarrer la présentation" : "Voir l’état du dossier")}
            </span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Highlight metrics card block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" id="cover-highlights-metrics">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow" id="cover-metric-surface">
          <div className="w-12 h-12 rounded-xl bg-[#00A0E2]/10 flex items-center justify-center text-[#00A0E2]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Surface Totale</p>
            <p className="text-xl font-extrabold text-slate-800">{propertyDetails.surface > 0 ? `${propertyDetails.surface} m² habitables` : 'Non renseigné'}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow" id="cover-metric-rooms">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Configuration</p>
            <p className="text-xl font-extrabold text-slate-800">
              {propertyDetails.rooms > 0 ? `${propertyDetails.rooms} pièce${propertyDetails.rooms > 1 ? 's' : ''}` : 'Non renseigné'}
              {propertyDetails.bedrooms > 0 ? ` • ${propertyDetails.bedrooms} ch.` : ''}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow" id="cover-metric-parcel">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Terrain Cadastral</p>
            <p className="text-xl font-extrabold text-slate-800">{propertyDetails.landSurface > 0 ? `${propertyDetails.landSurface} m²` : 'Non renseigné'}</p>
          </div>
        </div>
      </div>

      {/* Mobile Start button */}
      <button
        id="btn-start-presentation-mobile"
        onClick={onStart}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-[#00A0E2] text-white font-bold py-4.5 rounded-2xl shadow-lg shadow-[#00A0E2]/20 mt-2"
      >
        <span>
          {isMandateSigned
            ? "Accéder au suivi de vente"
            : (estimationStatus === "published" ? "Accéder au dossier" : "Voir l’état du dossier")}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function getLocationLabel(address: string) {
  if (!address) return '';
  const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) ?? address;
}
