import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Grid, 
  Layers, 
  Trees, 
  Bed, 
  Hammer, 
  PlusCircle, 
  MinusCircle, 
  ChevronRight,
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { PropertyDetails, PropertyPoint } from '../types';

interface PropertySectionProps {
  propertyDetails: PropertyDetails;
  pointsForts: PropertyPoint[];
  pointsDefendre: PropertyPoint[];
}

export default function PropertySection({ 
  propertyDetails, 
  pointsForts, 
  pointsDefendre 
}: PropertySectionProps) {
  const [selectedPoint, setSelectedPoint] = useState<{
    point: PropertyPoint;
    type: 'fort' | 'defendre';
  } | null>(null);

  // Auto select first point on load or point list changes
  useEffect(() => {
    if (pointsForts && pointsForts.length > 0) {
      setSelectedPoint({ point: pointsForts[0], type: 'fort' });
    } else if (pointsDefendre && pointsDefendre.length > 0) {
      setSelectedPoint({ point: pointsDefendre[0], type: 'defendre' });
    } else {
      setSelectedPoint(null);
    }
  }, [pointsForts, pointsDefendre]);

  const specs = [
    { label: 'Surface habitable', value: `${propertyDetails.surface} m²`, icon: Home, bg: 'bg-[#00A0E2]/10', text: 'text-[#00A0E2]' },
    { label: 'Nombre de pièces', value: `${propertyDetails.rooms} pièces`, icon: Grid, bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Niveau / Étages', value: `${propertyDetails.floors} étage`, icon: Layers, bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Surface terrain', value: `${propertyDetails.landSurface} m²`, icon: Trees, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Chambres', value: `${propertyDetails.bedrooms} chambres`, icon: Bed, bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'Année de constr.', value: `${propertyDetails.year}`, icon: Hammer, bg: 'bg-slate-100', text: 'text-slate-600' },
  ];
  const locationLabel = propertyDetails.address ? ` de ${propertyDetails.address}` : '';

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="property-section-container">
      {/* Overview Block */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-6" id="property-overview-card">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Fiche technique du bien</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Caractéristiques principales</h2>
          <p className="text-xs text-slate-500">Synthèse technique complète du bien{locationLabel}.</p>
        </div>

        {/* Bento Grid of Specs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="property-specs-grid">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-50/50 rounded-2xl p-4.5 border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-all group"
                id={`property-spec-item-${i}`}
              >
                <div className={`w-10 h-10 rounded-xl ${spec.bg} ${spec.text} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">{spec.label}</p>
                  <p className="text-base font-extrabold text-slate-800 mt-1">{spec.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Written Description block */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex gap-4 items-start" id="property-description-panel">
          <div className="p-2.5 bg-white text-[#00A0E2] rounded-xl border border-slate-100 shadow-sm shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">L'avis d'expert de votre conseiller</span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "{propertyDetails.description}"
            </p>
          </div>
        </div>
      </div>

      {/* Strengths and Points to Defend split matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="property-matrix-split">
        
        {/* Left Hand: Clickable Lists of Points (lg:col-span-6) */}
        <div className="lg:col-span-6 grid grid-cols-1 gap-6" id="property-matrix-lists">
          
          {/* Points Forts (Strengths) Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4" id="property-points-forts-card">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              Points forts à valoriser
            </h3>
            
            {pointsForts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Aucun point fort renseigné.</p>
            ) : (
              <div className="flex flex-col gap-2" id="points-forts-list">
                {pointsForts.map((point) => {
                  const isSelected = selectedPoint?.point.text === point.text && selectedPoint?.type === 'fort';
                  return (
                    <button
                      key={point.text}
                      id={`btn-point-fort-${point.text.replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedPoint({ point, type: 'fort' })}
                      className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all group ${
                        isSelected 
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 shadow-sm' 
                          : 'bg-slate-50/40 hover:bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-emerald-400'}`} />
                        <span>{point.text}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-emerald-600' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Points à Défendre (Points to Defend) Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4" id="property-points-defendre-card">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-amber-500" />
              Points techniques à anticiper & défendre
            </h3>
            
            {pointsDefendre.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Aucun point technique renseigné.</p>
            ) : (
              <div className="flex flex-col gap-2" id="points-defendre-list">
                {pointsDefendre.map((point) => {
                  const isSelected = selectedPoint?.point.text === point.text && selectedPoint?.type === 'defendre';
                  return (
                    <button
                      key={point.text}
                      id={`btn-point-defendre-${point.text.replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedPoint({ point, type: 'defendre' })}
                      className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all group ${
                        isSelected 
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950 shadow-sm' 
                          : 'bg-slate-50/40 hover:bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-slate-300 group-hover:bg-amber-400'}`} />
                        <span>{point.text}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-amber-600' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Hand: Detailed Explainer Pane with Olivier's Strategy (lg:col-span-6) */}
        <div className="lg:col-span-6" id="property-matrix-explainer">
          <AnimatePresence mode="wait">
            {selectedPoint ? (
              <motion.div
                key={selectedPoint.point.text}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col h-full gap-5 relative overflow-hidden"
                id="property-explainer-pane"
              >
                {/* Decorative glowing badge background */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${
                  selectedPoint.type === 'fort' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />

                <div className="flex items-center gap-3" id="explainer-header">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedPoint.type === 'fort' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedPoint.type === 'fort' ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {selectedPoint.type === 'fort' ? "Argument de vente clé" : "Négociation & Objection"}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-800 tracking-tight">
                      {selectedPoint.point.text}
                    </h4>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4" id="explainer-body">
                  <div className="flex flex-col gap-1.5" id="explainer-description">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description du point</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {selectedPoint.point.description}
                    </p>
                  </div>

                  <div className={`rounded-2xl p-5 border ${
                    selectedPoint.type === 'fort' 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950' 
                      : 'bg-amber-50/40 border-amber-100 text-amber-950'
                  }`} id="explainer-strategy">
                    <span className="text-[9px] font-bold uppercase tracking-wider block mb-1.5">
                      {selectedPoint.type === 'fort' ? "Comment nous allons le valoriser" : "Ma stratégie de défense face aux acheteurs"}
                    </span>
                    <p className="text-xs leading-relaxed font-medium">
                      {selectedPoint.type === 'fort' 
                        ? `Ce point fort fera l'objet d'une mise en avant prioritaire dans l'annonce et lors des visites. Nous ferons coïncider les horaires de visite avec l'exposition idéale pour que les acquéreurs ressentent immédiatement le confort et l'énergie du lieu.`
                        : `Je suis préparé à cette objection. Face aux remarques sur ${selectedPoint.point.text.toLowerCase()}, je saurai valoriser ${
                            selectedPoint.point.text === "ESCALIER D'ACCÈS" 
                              ? "l'avantage d'être en hauteur : plus de luminosité, une sécurité accrue par rapport aux cambriolages, et surtout la magnifique vue préservée qu'offre cette élévation."
                              : selectedPoint.point.text === "TERRAIN EN PLUSIEURS RESTANQUES"
                                ? "le charme authentique provençal, la possibilité de créer des espaces thématiques (un potager sur une restanque, un coin piscine sur l'autre, un salon de jardin arboré), tout en minimisant la corvée d'entretien d'une grande pelouse plate."
                                : "l'opportunité d'une négociation encadrée, ou la possibilité de l'utiliser comme un bureau indépendant, atelier créatif ou chambre d'amis qui apporte un confort de vie réel indépendamment de la désignation cadastrale officielle."
                          }`}
                    </p>
                  </div>
                </div>

                {/* Footnote card with Olivier's avatar */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto" id="explainer-footer">
                  <span className="text-[10px] text-slate-400 italic">Votre conseiller immobilier</span>
                </div>

              </motion.div>
            ) : (
              <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-center p-8 text-slate-400" id="explainer-empty-state">
                <Info className="w-8 h-8 text-slate-300 mb-3" />
                <p className="text-xs font-bold">Sélectionnez un point fort ou à défendre</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">Cliquez sur un argument dans la liste de gauche pour découvrir la stratégie de valorisation commerciale correspondante.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
