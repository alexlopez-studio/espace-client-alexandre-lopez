import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MessageSquare, 
  Sparkles, 
  Award, 
  Briefcase, 
  Quote, 
  TrendingUp, 
  UserCheck, 
  ShieldCheck, 
  Globe, 
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Handshake,
  CheckCircle,
  Percent
} from 'lucide-react';
import { iadSoldProperties, clientReviews } from '../data';

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<'sold' | 'reviews' | 'ecosystem'>('sold');
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);
  const [estimatedSoldValue, setEstimatedSoldValue] = useState<number>(410000);

  // Digitalization / Adaptive fee simulator (Page 11)
  // Traditional agency charges 5% - 7% commission.
  // iad charges around 3.5% - 4.5% due to reduced operational overhead.
  const traditionalCommission = Math.round(estimatedSoldValue * 0.06);
  const iadCommission = Math.round(estimatedSoldValue * 0.04);
  const totalClientSavings = traditionalCommission - iadCommission;

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % clientReviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + clientReviews.length) % clientReviews.length);
  };

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="services-section-container">
      
      {/* Tab Switcher Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="services-header">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold text-[#00A0E2] uppercase tracking-wider">L'écosystème iad & Références</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Services sur mesure & Réussites</h2>
          <p className="text-xs text-slate-500">Découvrez nos réalisations locales, l'évaluation de nos clients et la force unique du premier réseau immobilier de France.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-center" id="services-tab-controls">
          <button
            id="btn-tab-sold"
            onClick={() => setActiveTab('sold')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sold' 
                ? 'bg-[#00A0E2] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Biens Vendus
          </button>
          <button
            id="btn-tab-reviews"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'reviews' 
                ? 'bg-[#00A0E2] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Avis Clients
          </button>
          <button
            id="btn-tab-ecosystem"
            onClick={() => setActiveTab('ecosystem')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ecosystem' 
                ? 'bg-[#00A0E2] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Les + iad & Honoraires
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        
        {/* Tab 1: Biens Vendus par iad */}
        {activeTab === 'sold' && (
          <motion.div
            key="sold-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            id="tab-content-sold"
          >
            {iadSoldProperties.map((prop, i) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                id={`sold-prop-card-${prop.id}`}
              >
                {/* Sold tag badge */}
                <div className="flex justify-between items-center" id="sold-prop-header">
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black font-mono px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100">
                    Vendu par mes soins
                  </span>
                  <span className="text-slate-400 font-bold font-mono text-[9px]">{prop.soldDate}</span>
                </div>

                <div className="flex flex-col gap-0.5" id="sold-prop-desc">
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight">{prop.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-none truncate">{prop.address}</p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-1" id="sold-prop-metrics">
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{formatEuro(prop.price)}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({prop.pricePerSqm} €/m²)</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tab 2: Avis Clients Testimonials */}
        {activeTab === 'reviews' && (
          <motion.div
            key="reviews-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            id="tab-content-reviews"
          >
            {/* Total reviews summary card (Page 10) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-4 border border-slate-800 relative overflow-hidden" id="reviews-satisfaction-card">
              {/* background lighting effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,160,226,0.15),transparent_100%)]" />
              
              <div className="w-16 h-16 rounded-full bg-[#00A0E2]/10 border border-[#00A0E2]/30 flex items-center justify-center text-[#00A0E2] z-10">
                <Star className="w-8 h-8 fill-current" />
              </div>

              <div className="z-10" id="reviews-ratings-summary">
                <h3 className="text-4xl font-black text-white leading-none">100%</h3>
                <p className="text-sm font-extrabold text-cyan-400 tracking-wide mt-1">de clients satisfaits</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Certifié par Immodvisor (NF ISO 20488)</p>
              </div>

              {/* Stars row */}
              <div className="flex gap-1 text-amber-400 z-10" id="stars-row">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4.5 h-4.5 fill-current" />)}
              </div>

              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed z-10">
                Une note moyenne globale de <span className="text-white font-bold">5/5 basée sur 57 avis vérifiés</span>. L'assurance d'un accompagnement sérieux, humain et performant.
              </p>
            </div>

            {/* Testimonials Quote Slider */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-6 justify-between min-h-[300px]" id="reviews-carousel-card">
              
              {/* Carousel Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4 flex-1"
                  id="carousel-body"
                >
                  <div className="flex justify-between items-start" id="carousel-header">
                    <div className="flex gap-1 text-amber-500" id="carousel-stars">
                      {Array.from({ length: clientReviews[currentReviewIndex].rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-slate-100 shrink-0" />
                  </div>

                  <div className="flex flex-col gap-1.5" id="carousel-text">
                    <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
                      "{clientReviews[currentReviewIndex].title}"
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {clientReviews[currentReviewIndex].comment}
                    </p>
                  </div>

                  <div className="flex flex-col gap-0.5 border-t border-slate-50 pt-3" id="carousel-author-row">
                    <span className="text-xs font-extrabold text-slate-800">{clientReviews[currentReviewIndex].author}</span>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">Publié le {clientReviews[currentReviewIndex].date}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation controls */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-4" id="carousel-controls">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  Témoignage {currentReviewIndex + 1} sur {clientReviews.length}
                </span>
                <div className="flex gap-2" id="carousel-btn-group">
                  <button
                    id="btn-carousel-prev"
                    onClick={prevReview}
                    className="p-2 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-carousel-next"
                    onClick={nextReview}
                    className="p-2 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* Tab 3: Ecosystem & Fee Optimizer (Page 11 and 12) */}
        {activeTab === 'ecosystem' && (
          <motion.div
            key="ecosystem-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            id="tab-content-ecosystem"
          >
            {/* Left Col: Portal Diffusion & Services list (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-6" id="ecosystem-portal-card">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#00A0E2]" />
                  Diffusion maximale de votre annonce
                </h4>
                <p className="text-xs text-slate-500">Grâce à la force de diffusion iad, votre bien est affiché sur les portails majeurs.</p>
              </div>

              {/* List of portal tiers (Page 11) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="portal-tiers-grid">
                
                {/* National */}
                <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow" id="portal-tier-national">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold font-mono text-xs">NAT</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Portails Nationaux</span>
                    <span className="text-xs font-extrabold text-slate-800 leading-tight">Leboncoin, SeLoger, Logic-Immo, ParuVendu, bien'ici...</span>
                  </div>
                </div>

                {/* Prestige */}
                <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow" id="portal-tier-prestige">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold font-mono text-xs">PRE</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Portails Prestige</span>
                    <span className="text-xs font-extrabold text-slate-800 leading-tight">Belles Demeures, Lux-Residence, LuxuryEstate...</span>
                  </div>
                </div>

                {/* International */}
                <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow" id="portal-tier-international">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-mono text-xs">INT</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">International</span>
                    <span className="text-xs font-extrabold text-slate-800 leading-tight">Properstar, Kyero, etc. (Touchant plus d'acheteurs étrangers)</span>
                  </div>
                </div>

              </div>

              {/* Partnership note (Propertips by iad) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-3.5 items-start" id="propertips-partnership">
                <div className="p-2 bg-white text-[#00A0E2] rounded-xl border border-slate-100 shadow-sm shrink-0 font-bold font-mono text-xs">Propertips</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Partenariat d'apport d'affaires</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    "iad s'appuie sur le partenariat exclusif Propertips par iad, la plateforme n°1 de recommandation immobilière d'Europe, pour multiplier par 10 les opportunités d'acheteurs potentiels qualifiés."
                  </p>
                </div>
              </div>

            </div>

            {/* Right Col: Interactive Commission Simulator (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5 justify-between" id="ecosystem-fees-card">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-[#00A0E2]" />
                  La numérisation au service de vos économies
                </h4>
                <p className="text-xs text-slate-500">Pas de vitrine physique coûteuse. Nous répercutons cette économie de charges directement sur nos honoraires.</p>
              </div>

              {/* Interactive fees slider simulator */}
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex flex-col gap-3.5" id="fees-simulator">
                <div className="flex justify-between items-center text-xs text-slate-600 font-semibold" id="fees-sim-header">
                  <span>Prix de vente du bien :</span>
                  <span className="font-extrabold text-slate-800 font-mono">{formatEuro(estimatedSoldValue)}</span>
                </div>
                
                <input
                  id="sold-value-slider"
                  type="range"
                  min={300000}
                  max={600000}
                  step={10000}
                  value={estimatedSoldValue}
                  onChange={(e) => setEstimatedSoldValue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A0E2] focus:outline-none"
                />

                {/* Comparison graphics */}
                <div className="flex flex-col gap-2 mt-2" id="fees-comparison-details">
                  <div className="flex justify-between text-xs text-slate-500" id="fees-row-agency">
                    <span>Agence classique (~6% d'honoraires) :</span>
                    <span className="font-bold text-slate-700 font-mono">{formatEuro(traditionalCommission)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-[#00A0E2]" id="fees-row-iad">
                    <span>Honoraires iad ajustés (~4%) :</span>
                    <span className="font-black font-mono">{formatEuro(iadCommission)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-emerald-600 border-t border-dashed border-slate-200 pt-2.5 mt-1" id="fees-row-savings">
                    <span>Économie nette pour vous :</span>
                    <span className="font-black font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{formatEuro(totalClientSavings)} de gain</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#00A0E2]/5 rounded-2xl p-4 border border-[#00A0E2]/20 flex gap-3 text-[11px] leading-relaxed text-slate-700" id="fees-formula-explainer">
                <CheckCircle className="w-5 h-5 text-[#00A0E2] shrink-0" />
                <span>
                  <strong className="text-slate-800 block mb-0.5 font-mono">Formule gagnante</strong>
                  Digitalisation de l'agence + Réduction drastique des frais de fonctionnement de réseau = Vos honoraires de transaction réduits et un gain financier direct !
                </span>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
