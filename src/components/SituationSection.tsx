import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, 
  Layers, 
  Grid, 
  Info, 
  Maximize2, 
  Navigation,
  Compass,
  MapPin,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { CadastralParcel } from '../types';

interface SituationSectionProps {
  cadastralParcels?: CadastralParcel[];
  clientAddress?: string;
}

export default function SituationSection({ cadastralParcels: propParcels, clientAddress }: SituationSectionProps) {
  const [mapType, setMapType] = useState<'street' | 'aerial' | 'cadastre'>('street');
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [hoveredParcel, setHoveredParcel] = useState<string | null>(null);

  const activeParcels = propParcels ?? [];
  const totalSuperficie = activeParcels.reduce((acc, p) => acc + parseInt((p.superficie || 0).toString()), 0);
  const addressToDisplay = clientAddress || "Adresse du bien";

  const getCity = (addr: string) => {
    const parts = addr.split(',');
    return parts[parts.length - 1]?.trim() || "À renseigner";
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="situation-section-container">
      {/* Title & Description Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" id="situation-header">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Plan de situation & Cadastre</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{addressToDisplay}</h2>
          <p className="text-xs text-slate-500">Localisation précise du bien et analyse parcellaire officielle issue du cadastre national.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-full border border-emerald-100" id="situation-commune-badge">
          <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
          <span>Commune : {getCity(addressToDisplay)}</span>
        </div>
      </div>

      {/* Main Interactive Map & Cadastre Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="situation-split-grid">
        
        {/* Left Column: Interactive Map Widget (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px]" id="situation-map-card">
          
          {/* Map Header Controls */}
          <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center justify-between" id="map-controls">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00A0E2]" />
              Visualisation du terrain
            </span>
            <div className="flex bg-slate-200/60 p-1 rounded-xl" id="map-type-tabs">
              <button
                id="btn-map-street"
                onClick={() => setMapType('street')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mapType === 'street' 
                    ? 'bg-[#00A0E2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Plan</span>
              </button>
              <button
                id="btn-map-aerial"
                onClick={() => setMapType('aerial')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mapType === 'aerial' 
                    ? 'bg-[#00A0E2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Aérienne</span>
              </button>
              <button
                id="btn-map-cadastre"
                onClick={() => setMapType('cadastre')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mapType === 'cadastre' 
                    ? 'bg-[#00A0E2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Cadastre</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Visual Element */}
          <div className="flex-1 relative bg-slate-900 overflow-hidden" id="map-viewport">
            
            {/* Street Map View (Vector style) */}
            {mapType === 'street' && (
              <motion.div 
                key="street-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-100"
              >
                {/* Beautiful custom vector street map SVG */}
                <svg viewBox="0 0 500 400" className="w-full h-full" id="svg-street-map">
                  {/* Land/Forest outlines */}
                  <path d="M0 0 L500 0 L500 200 C400 150, 300 180, 200 120 C100 60, 50 120, 0 80 Z" fill="#e2ece9" opacity="0.6" />
                  <path d="M0 400 L500 400 L500 300 C450 320, 420 280, 380 340 C340 400, 200 350, 100 380 Z" fill="#e6eedf" opacity="0.6" />
                  
                  {/* Water Huveaune River */}
                  <path d="M-10 150 Q120 180 250 150 T510 160" fill="none" stroke="#90caf9" strokeWidth="12" strokeLinecap="round" />
                  <text x="180" y="145" fill="#1565c0" className="text-[10px] font-semibold italic opacity-60">L'Huveaune</text>

                  {/* Motorway A50 */}
                  <path d="M-10 80 L510 110" fill="none" stroke="#ffa726" strokeWidth="8" />
                  <path d="M-10 80 L510 110" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="370" y="95" fill="#b76c00" className="text-[9px] font-bold tracking-wider">AUTOROUTE A50</text>

                  {/* Local Streets */}
                  <path d="M120 0 L150 400" fill="none" stroke="#ffffff" strokeWidth="8" />
                  <path d="M120 0 L150 400" fill="none" stroke="#cfd8dc" strokeWidth="4" />
                  <text x="70" y="220" fill="#78909c" className="text-[8px] rotate-75 font-semibold">Ch. de la Penne-sur-Huveaune</text>
                  
                  {/* Représentation schématique du secteur */}
                  <path d="M135 180 Q250 220 320 280 T450 390" fill="none" stroke="#ffffff" strokeWidth="10" />
                  <path d="M135 180 Q250 220 320 280 T450 390" fill="none" stroke="#b0bec5" strokeWidth="5" />
                  <text x="210" y="245" fill="#546e7a" className="text-[9px] font-bold">Secteur du bien</text>

                  {/* Other minor streets */}
                  <path d="M300 263 L500 240" fill="none" stroke="#cfd8dc" strokeWidth="3" />
                  <path d="M300 263 L100 320" fill="none" stroke="#cfd8dc" strokeWidth="3" />

                  {/* Property Marker */}
                  <g className="cursor-pointer" id="map-property-pin">
                    <circle cx="320" cy="280" r="28" fill="#00A0E2" fillOpacity="0.15" className="animate-pulse" />
                    <circle cx="320" cy="280" r="14" fill="#00A0E2" fillOpacity="0.3" />
                    {/* MapPin SVG representation */}
                    <path d="M320 262 C310 262 302 270 302 280 C302 295 320 310 320 310 C320 310 338 295 338 280 C338 270 330 262 320 262 Z" fill="#e11d48" />
                    <circle cx="320" cy="277" r="5" fill="#ffffff" />
                  </g>
                  
                  {/* Location label card */}
                  <foreignObject x="215" y="308" width="210" height="60" id="map-info-card-box">
                    <div className="bg-slate-900/90 text-white p-2.5 rounded-xl border border-slate-700 text-center flex flex-col gap-0.5 shadow-lg">
                      <span className="text-[10px] font-bold text-[#00A0E2]">VOTRE MAISON</span>
                      <span className="text-[9px] text-slate-300">{addressToDisplay}</span>
                    </div>
                  </foreignObject>
                </svg>
              </motion.div>
            )}

            {/* Aerial view Map */}
            {mapType === 'aerial' && (
              <motion.div 
                key="aerial-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950"
              >
                {/* Visualisation schématique du terrain */}
                <svg viewBox="0 0 500 400" className="w-full h-full object-cover" id="svg-aerial-map">
                  {/* Sat photo simulated background */}
                  <rect width="500" height="400" fill="#2d3725" />
                  {/* Vegetation clumps */}
                  <circle cx="100" cy="80" r="80" fill="#1b2513" opacity="0.8" />
                  <circle cx="420" cy="320" r="90" fill="#1b2513" opacity="0.8" />
                  <circle cx="280" cy="60" r="50" fill="#1e2715" opacity="0.7" />
                  <circle cx="50" cy="300" r="60" fill="#1a2312" opacity="0.9" />

                  {/* Neighbors roofs */}
                  <polygon points="80,120 120,110 140,150 100,160" fill="#d84315" opacity="0.85" />
                  <polygon points="400,100 440,90 450,130 410,140" fill="#9e9d24" opacity="0.8" />
                  <polygon points="350,330 380,310 400,345 370,365" fill="#ef6c00" opacity="0.85" />

                  {/* Voie d'accès */}
                  <path d="M0 240 Q150 230 250 250 T500 320" fill="none" stroke="#37474f" strokeWidth="18" />
                  <path d="M0 240 Q150 230 250 250 T500 320" fill="none" stroke="#263238" strokeWidth="16" />

                  {/* Target parcel boundaries highlighted on satellite */}
                  <g className="cursor-pointer" id="aerial-target-parcel">
                    {/* Parcel polygon */}
                    <polygon 
                      points="180,200 290,170 310,240 200,270" 
                      fill="#00A0E2" 
                      fillOpacity="0.25" 
                      stroke="#00A0E2" 
                      strokeWidth="2.5" 
                      className="animate-pulse"
                    />
                    
                    {/* Swimming pool in the garden */}
                    <rect x="250" y="210" width="22" height="12" rx="2" fill="#29b6f6" stroke="#ffffff" strokeWidth="1.5" transform="rotate(-15, 250, 210)" />
                    {/* Main house roof */}
                    <polygon points="195,215 240,202 250,235 205,248" fill="#e64a19" stroke="#b71c1c" strokeWidth="1" />
                    
                    {/* Highlight label */}
                    <line x1="245" y1="225" x2="330" y2="130" stroke="#00A0E2" strokeWidth="1.5" strokeDasharray="3,3" />
                    <circle cx="245" cy="225" r="3" fill="#00A0E2" />
                    
                    <foreignObject x="310" y="80" width="160" height="60" id="aerial-label">
                      <div className="bg-[#00A0E2] text-white p-2 rounded-lg border border-cyan-400 text-center flex flex-col shadow-xl">
                        <span className="text-[10px] font-bold">ZONE PARCELLES</span>
                        <span className="text-[9px]">343 m² • Maison & Piscine</span>
                      </div>
                    </foreignObject>
                  </g>
                </svg>
              </motion.div>
            )}

            {/* Cadastre Map (Cadastral boundaries) */}
            {mapType === 'cadastre' && (
              <motion.div 
                key="cadastre-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#faf8f5]"
              >
                {/* Genuine cadastral look: yellow-cream background, fine black borders, numbers */}
                <svg viewBox="0 0 500 400" className="w-full h-full" id="svg-cadastre-map">
                  {/* Parcel lines of neighbors */}
                  <polygon points="10,10 120,10 110,150 10,130" fill="none" stroke="#a1887f" strokeWidth="1" />
                  <text x="50" y="80" fill="#8d6e63" className="text-[9px]">110</text>

                  <polygon points="120,10 280,10 260,140 110,150" fill="none" stroke="#a1887f" strokeWidth="1" />
                  <text x="180" y="80" fill="#8d6e63" className="text-[9px]">112</text>

                  <polygon points="280,10 490,10 470,160 260,140" fill="none" stroke="#a1887f" strokeWidth="1" />
                  <text x="360" y="80" fill="#8d6e63" className="text-[9px]">113</text>

                  {/* PARCELLE 111 (Maison principale) */}
                  <g 
                    id="cadastre-p-111"
                    className="cursor-pointer group"
                    onClick={() => setSelectedParcel(activeParcels[0] || null)}
                    onMouseEnter={() => setHoveredParcel('111')}
                    onMouseLeave={() => setHoveredParcel(null)}
                  >
                    <polygon 
                      points="110,150 260,140 285,260 135,275" 
                      fill={selectedParcel?.numero === '111' || hoveredParcel === '111' ? '#00A0E2' : '#00A0E2'} 
                      fillOpacity={selectedParcel?.numero === '111' || hoveredParcel === '111' ? '0.25' : '0.1'} 
                      stroke="#00A0E2" 
                      strokeWidth={selectedParcel?.numero === '111' || hoveredParcel === '111' ? '2.5' : '1.5'} 
                      transition="all 0.3s"
                    />
                    <text x="180" y="210" fill="#0284c7" className="text-xs font-bold">D - 111</text>
                    <text x="165" y="225" fill="#546e7a" className="text-[9px]">276 m²</text>
                  </g>

                  {/* PARCELLE 548 (Allée / Accès / Restanque) */}
                  <g 
                    id="cadastre-p-548"
                    className="cursor-pointer group"
                    onClick={() => setSelectedParcel(activeParcels[1] || null)}
                    onMouseEnter={() => setHoveredParcel('548')}
                    onMouseLeave={() => setHoveredParcel(null)}
                  >
                    <polygon 
                      points="135,275 285,260 295,305 145,320" 
                      fill={selectedParcel?.numero === '548' || hoveredParcel === '548' ? '#10b981' : '#10b981'} 
                      fillOpacity={selectedParcel?.numero === '548' || hoveredParcel === '548' ? '0.25' : '0.1'} 
                      stroke="#10b981" 
                      strokeWidth={selectedParcel?.numero === '548' || hoveredParcel === '548' ? '2.5' : '1.5'} 
                      transition="all 0.3s"
                    />
                    <text x="190" y="295" fill="#047857" className="text-[10px] font-bold">D - 548</text>
                    <text x="180" y="307" fill="#546e7a" className="text-[8px]">67 m²</text>
                  </g>

                  {/* Neighbors below */}
                  <polygon points="135,275 10,290 10,380 145,320" fill="none" stroke="#a1887f" strokeWidth="1" />
                  <text x="50" y="340" fill="#8d6e63" className="text-[9px]">114</text>
                  
                  <polygon points="285,260 490,240 490,380 295,305" fill="none" stroke="#a1887f" strokeWidth="1" />
                  <text x="380" y="310" fill="#8d6e63" className="text-[9px]">115</text>

                  {/* Access road */}
                  <path d="M145 320 L295 305 L300 325 L150 340 Z" fill="#e0e0e0" opacity="0.5" />
                  <text x="200" y="333" fill="#757575" className="text-[7px] font-semibold tracking-wider">CHEMIN D'ACCÈS PRIVÉ</text>
                </svg>
              </motion.div>
            )}

            {/* Floating indicator info */}
            <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md text-white py-1.5 px-3 rounded-lg text-[10px] font-medium flex items-center gap-1.5" id="map-orientation-tag">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Système géoréférencé Yanport | iad</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Cadastral Ledger (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-5" id="situation-cadastre-ledger">
          
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col gap-4 relative overflow-hidden" id="cadastre-summary-card">
            {/* Background design accents */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-[#00A0E2] rounded-full opacity-10 filter blur-xl" />
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-emerald-500 rounded-full opacity-10 filter blur-xl" />

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Contenance cadastrale</span>
              <h3 className="text-3xl font-extrabold tracking-tight mt-1" id="total-superficie-text">
                {totalSuperficie} m² <span className="text-xs font-normal text-slate-400">de terrain</span>
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              La propriété est constituée de <span className="font-bold text-[#00A0E2]">deux parcelles contiguës</span> sous la section <span className="font-bold text-white">D</span>. Ce cumul offre un espace extérieur appréciable, en plusieurs restanques arborées.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-700/60" id="cadastre-mini-metrics">
              <div className="flex flex-col gap-0.5" id="mini-metric-1">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Parcelle Principale</span>
                <span className="text-sm font-extrabold text-white">276 m² (N° 111)</span>
              </div>
              <div className="flex flex-col gap-0.5" id="mini-metric-2">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Parcelle Secondaire</span>
                <span className="text-sm font-extrabold text-[#10b981]">67 m² (N° 548)</span>
              </div>
            </div>
          </div>

          {/* Interactive Parcels Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex-1 flex flex-col gap-4" id="cadastre-details-card">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2" id="cadastre-table-title">
              <Grid className="w-4 h-4 text-[#00A0E2]" />
              Détail des parcelles cadastrales
            </h4>

            <div className="flex-1 overflow-x-auto" id="cadastre-table-wrapper">
              <table className="w-full text-left border-collapse" id="cadastral-ledger-table">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-2">Section</th>
                    <th className="py-2.5 px-2">Préfixe</th>
                    <th className="py-2.5 px-2">Numéro</th>
                    <th className="py-2.5 px-2 text-right">Superficie</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {activeParcels.map((parcel) => (
                    <tr 
                      key={parcel.numero}
                      id={`parcel-row-${parcel.numero}`}
                      onMouseEnter={() => setHoveredParcel(parcel.numero)}
                      onMouseLeave={() => setHoveredParcel(null)}
                      onClick={() => setSelectedParcel(selectedParcel?.numero === parcel.numero ? null : parcel)}
                      className={`cursor-pointer border-b border-slate-50 transition-all ${
                        selectedParcel?.numero === parcel.numero 
                          ? 'bg-slate-50 font-semibold' 
                          : hoveredParcel === parcel.numero 
                            ? 'bg-slate-50/50' 
                            : ''
                      }`}
                    >
                      <td className="py-3 px-2">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {parcel.section}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-600">{parcel.prefixe}</td>
                      <td className="py-3 px-2 text-slate-800 font-bold">{parcel.numero}</td>
                      <td className="py-3 px-2 text-right font-extrabold text-slate-900">{parcel.superficie} m²</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Interactive Parcel Detail Drawer/Card inside sidebar */}
            <AnimatePresence mode="wait">
              {selectedParcel ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-[#00A0E2]/5 rounded-2xl p-4 border border-[#00A0E2]/20 flex flex-col gap-2 mt-auto"
                  id="parcel-info-panel"
                >
                  <div className="flex items-center justify-between" id="parcel-info-header">
                    <span className="text-[11px] font-bold text-[#00A0E2] uppercase">Focus : Parcelle {selectedParcel.numero}</span>
                    <button 
                      id="btn-close-parcel-info"
                      onClick={() => setSelectedParcel(null)} 
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Fermer
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed" id="parcel-info-body">
                    {selectedParcel.numero === '111' 
                      ? "La parcelle D 111 supporte la maison d'habitation ainsi que sa terrasse, l'ancienne cave réaménagée et une partie du jardin paysager en restanques." 
                      : "Cette parcelle comprend principalement une zone d'accès ou un espace annexe selon les informations cadastrales publiées."}
                  </p>
                </motion.div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center text-slate-400 text-xs flex items-center justify-center gap-2 mt-auto" id="no-parcel-placeholder">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Survolez ou cliquez sur une parcelle pour voir les détails d'urbanisme.</span>
                </div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
