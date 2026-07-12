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
import { ClientInfo, AdvisorInfo } from '../types';
import IadLogo from './IadLogo';

interface CoverSectionProps {
  client: ClientInfo;
  advisor: AdvisorInfo;
  onStart: () => void;
}

export default function CoverSection({ client, advisor, onStart }: CoverSectionProps) {
  return (
    <div className="w-full flex flex-col gap-8 lg:p-4" id="cover-section-container">
      {/* Welcome Card & Document Title */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 lg:p-12 relative flex flex-col gap-6" id="cover-intro-card">
        {/* Decorative subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="flex justify-between items-start z-10" id="cover-header-row">
          <IadLogo className="h-14 self-start" color="#00A0E2" showText={true} />
          <div className="flex items-center gap-2 bg-slate-100 text-slate-800 text-[11px] font-semibold tracking-wider px-3 py-1.5 rounded-full uppercase font-mono" id="cover-badge">
            <BadgeCheck className="w-3.5 h-3.5 text-[#00A0E2]" />
            Dossier Certifié
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
            {client.projectTitle || "Dossier de commercialisation & Suivi de vente"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl lg:text-2xl text-[#00A0E2] font-semibold tracking-tight mt-1"
            id="cover-subtitle"
          >
            Maison de 125 m² • 5 pièces • Terrain 350 m²
          </motion.p>
        </div>

        {/* Client & Date Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-b border-slate-100 mt-2 z-10" id="cover-details-grid">
          <div className="flex flex-col gap-1.5" id="cover-detail-client">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">À l'attention de</span>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-50 text-slate-700 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{client.names}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5" id="cover-detail-address">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Adresse du bien</span>
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
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Date de réalisation</span>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-50 text-slate-700 rounded-lg">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{client.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenic Hero Picture and Overlay Contact Card */}
      <div className="relative rounded-3xl overflow-hidden min-h-[420px] shadow-lg group" id="cover-hero-container">
        {/* Generated landscape background image */}
        <img 
          src="/src/assets/images/marseille_landscape_1783766780681.jpg" 
          alt="Marseille Landscape" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 referrerPolicy='no-referrer'"
          id="cover-hero-image"
        />
        
        {/* Solid & Gradient Overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-800/10" />

        {/* Large overlay title on top of picture */}
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl px-5 py-3 flex flex-col items-end" id="cover-location-tag">
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-75">Secteur</span>
          <span className="text-sm font-bold tracking-tight">Marseille 11e (13011)</span>
        </div>

        {/* Advisor card at the bottom left */}
        <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-100 flex flex-col md:flex-row items-center gap-5 shadow-2xl max-w-lg" id="cover-advisor-profile">
          <img 
            src={advisor.avatar} 
            alt={advisor.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-[#00A0E2]/30 shadow referrerPolicy='no-referrer'"
            id="cover-advisor-avatar"
          />
          <div className="flex-1 flex flex-col text-center md:text-left gap-1">
            <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-wider">Votre conseiller iad</span>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">{advisor.name}</h3>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs text-slate-500 mt-1">
              <a href={`tel:${advisor.phone.replace(/\s/g, '')}`} className="flex items-center justify-center md:justify-start gap-1.5 hover:text-[#00A0E2] transition-colors" id="cover-phone-link">
                <Phone className="w-3.5 h-3.5 text-[#00A0E2]" />
                <span>{advisor.phone}</span>
              </a>
              <a href={`mailto:${advisor.email}`} className="flex items-center justify-center md:justify-start gap-1.5 hover:text-[#00A0E2] transition-colors" id="cover-email-link">
                <Mail className="w-3.5 h-3.5 text-[#00A0E2]" />
                <span className="truncate max-w-[150px] md:max-w-none">{advisor.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Start button at the bottom right */}
        <div className="absolute bottom-6 right-6 hidden md:block">
          <button 
            id="btn-start-presentation"
            onClick={onStart}
            className="flex items-center gap-2 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-semibold px-6 py-4 rounded-2xl shadow-xl shadow-[#00A0E2]/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <span>Démarrer la Présentation</span>
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
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Surface Totale</p>
            <p className="text-xl font-extrabold text-slate-800">125 m² habitables</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow" id="cover-metric-rooms">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Configuration</p>
            <p className="text-xl font-extrabold text-slate-800">5 pièces • 4 ch.</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow" id="cover-metric-parcel">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Terrain Cadastral</p>
            <p className="text-xl font-extrabold text-slate-800">343 m² (2 parcelles)</p>
          </div>
        </div>
      </div>

      {/* Mobile Start button */}
      <button 
        id="btn-start-presentation-mobile"
        onClick={onStart}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-[#00A0E2] text-white font-bold py-4.5 rounded-2xl shadow-lg shadow-[#00A0E2]/20 mt-2"
      >
        <span>Accéder au Dossier Suivi</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
