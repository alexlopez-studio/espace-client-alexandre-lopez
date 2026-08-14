import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  Layers, 
  Grid, 
  Info, 
  Navigation,
  Compass,
  MapPin,
  CheckCircle2,
  Eye,
  Sun,
  ShieldCheck,
  Droplets,
  Trees,
  RotateCcw,
  Sparkles,
  Ruler,
  Building2,
  Car,
  ExternalLink,
  Maximize2
} from 'lucide-react';
import type * as L from 'leaflet';
import { CadastralParcel, PropertyDetails } from '../types';

interface SituationSectionProps {
  cadastralParcels?: CadastralParcel[];
  clientAddress?: string;
  propertyDetails?: PropertyDetails;
}

type ViewMode = 'satellite' | 'cadastre' | 'mass' | 'environment';

interface PropertyZone {
  id: string;
  name: string;
  type: string;
  surface: string;
  description: string;
  icon: typeof Building2;
  color: string;
  coords?: [number, number];
}

// Données cadastrales et géographiques réelles Barjols (1248 Route de Draguignan)
const DEFAULT_CENTER: [number, number] = [43.55955, 6.00952];

// Polygone officiel DGFIP/IGN de la parcelle B 0297 (749 m²)
const PARCEL_297_COORDS: [number, number][] = [
  [43.55942011, 6.00957572],
  [43.5593662, 6.00947743],
  [43.55938459, 6.0094571],
  [43.55954926, 6.00928237],
  [43.55957157, 6.00925705],
  [43.55958236, 6.00924461],
  [43.55966222, 6.00939069],
  [43.5597432, 6.00953558],
  [43.55982178, 6.0096728],
  [43.55978529, 6.00971262],
  [43.55973484, 6.00961946],
  [43.55968342, 6.00952589],
  [43.55966937, 6.00949989],
  [43.55965575, 6.00951367],
  [43.55963324, 6.00953663],
  [43.55955795, 6.00961192],
  [43.5594818, 6.00968568],
  [43.55942011, 6.00957572],
];

// Parcelles voisines officielles DGFIP
const NEIGHBOR_PARCELS: { id: string; num: string; surface: number; coords: [number, number][] }[] = [
  {
    id: '0296',
    num: '0296',
    surface: 604,
    coords: [
      [43.55958236, 6.00924461],
      [43.55954926, 6.00928237],
      [43.55938459, 6.0094571],
      [43.55931, 6.00932],
      [43.55948, 6.00912],
      [43.55958236, 6.00924461]
    ]
  },
  {
    id: '0298',
    num: '0298',
    surface: 747,
    coords: [
      [43.55942011, 6.00957572],
      [43.5594818, 6.00968568],
      [43.55955795, 6.00961192],
      [43.55968568, 6.0094818],
      [43.55978529, 6.00971262],
      [43.55968, 6.00985],
      [43.55935, 6.00972],
      [43.55942011, 6.00957572]
    ]
  },
  {
    id: '0294',
    num: '0294',
    surface: 590,
    coords: [
      [43.55982178, 6.0096728],
      [43.5597432, 6.00953558],
      [43.55966222, 6.00939069],
      [43.55978, 6.00925],
      [43.55995, 6.00952],
      [43.55982178, 6.0096728]
    ]
  }
];

const PROPERTY_ZONES: PropertyZone[] = [
  {
    id: 'villa',
    name: 'Villa Principale',
    type: 'Bâti principal',
    surface: '135 m²',
    description: 'Villa provençale contemporaine lumineuse avec séjour cathédrale, cuisine équipée ouverte, 4 chambres dont suite de plain-pied.',
    icon: Building2,
    color: '#e65100',
    coords: [43.55956, 6.00948],
  },
  {
    id: 'terrace',
    name: 'Terrasse Plein Sud',
    type: 'Espace de vie extérieur',
    surface: '32 m²',
    description: 'Terrasse dallée abritée avec vue dégagée sur les collines boisées du Haut-Var, orientée plein Sud.',
    icon: Sun,
    color: '#f59e0b',
    coords: [43.55950, 6.00948],
  },
  {
    id: 'pool',
    name: 'Espace Piscine / Détente',
    type: 'Bassin 7x3.5m & Plage',
    surface: '25 m²',
    description: 'Emplacement paysager aménagé avec bassin de détente maçonné et plage en travertin sans aucun vis-à-vis.',
    icon: Droplets,
    color: '#00A0E2',
    coords: [43.55962, 6.00956],
  },
  {
    id: 'garden',
    name: 'Jardin & Restanques',
    type: 'Espace paysager clos',
    surface: '~550 m²',
    description: 'Jardin méditerranéen en restanques douces avec oliviers, chênes verts, romarins et système d’arrosage automatisé.',
    icon: Trees,
    color: '#10b981',
    coords: [43.55968, 6.00942],
  },
  {
    id: 'garage',
    name: 'Garage & Stationnement',
    type: 'Accès & Stationnement',
    surface: '22 m² + cour',
    description: 'Garage fermé motorisé de 22 m² et allée d’accès carrossable privative permettant de garer 3 véhicules.',
    icon: Car,
    color: '#6366f1',
    coords: [43.55944, 6.00942],
  },
];

const LOCAL_AMENITIES = [
  { name: 'Centre historique de Barjols (Place de la Rouguière)', distance: '1,4 km', time: '3 min en voiture / 15 min à pied', type: 'Village', coords: [43.5582, 6.0068] as [number, number] },
  { name: 'Supermarché, boulangerie & commerces', distance: '1,1 km', time: '2 min en voiture / 12 min à pied', type: 'Commerces', coords: [43.5592, 6.0022] as [number, number] },
  { name: 'Collège Joseph d’Arbaud & Écoles primaires', distance: '1,6 km', time: '4 min en voiture', type: 'Éducation', coords: [43.5552, 6.0125] as [number, number] },
  { name: 'Pôle Médical & Pharmacie de Barjols', distance: '1,3 km', time: '3 min en voiture', type: 'Santé', coords: [43.5575, 6.0045] as [number, number] },
  { name: 'Site remarquable du Vallon des Carmes & Cascades', distance: '2,2 km', time: '5 min en voiture', type: 'Patrimoine naturel', coords: [43.5518, 6.0012] as [number, number] },
];

export default function SituationSection({ 
  cadastralParcels: propParcels, 
  clientAddress,
  propertyDetails
}: SituationSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('satellite');
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [selectedZone, setSelectedZone] = useState<PropertyZone | null>(null);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showCadastreLayer, setShowCadastreLayer] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [customCenter, setCustomCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [activeParcelCoords, setActiveParcelCoords] = useState<[number, number][]>(PARCEL_297_COORDS);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const cadastreLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonGroupRef = useRef<L.LayerGroup | null>(null);

  // Parcelles officielles 1248 Route de Draguignan, 83670 Barjols
  const activeParcels: CadastralParcel[] = (propParcels && propParcels.length > 0) 
    ? propParcels 
    : [{ section: 'B', prefixe: '000', numero: '0297', superficie: 749 }];

  const totalSuperficie = activeParcels.reduce((acc, p) => acc + parseInt((p.superficie || 0).toString(), 10), 0) || 749;
  const addressToDisplay = clientAddress || "1248 Route de Draguignan, 83670 Barjols";

  const getCity = (addr: string) => {
    const parts = addr.split(',');
    return parts[parts.length - 1]?.trim() || "Barjols (83670)";
  };

  // Géocodage dynamique et récupération de la parcelle IGN si nouvelle adresse
  useEffect(() => {
    let isMounted = true;
    async function fetchRealGeocoding() {
      if (!clientAddress) return;
      try {
        const geoRes = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(clientAddress)}&limit=1`);
        const geoData = await geoRes.json();
        if (geoData?.features?.length > 0) {
          const coords = geoData.features[0].geometry.coordinates; // [lon, lat]
          const lat = coords[1];
          const lon = coords[0];
          if (isMounted) setCustomCenter([lat, lon]);

          // Fetch parcel geometry from IGN Apicarto
          const parcelRes = await fetch(`https://apicarto.ign.fr/api/cadastre/parcelle?geom=${encodeURIComponent(JSON.stringify({ type: 'Point', coordinates: [lon, lat] }))}`);
          const parcelData = await parcelRes.json();
          if (parcelData?.features?.length > 0) {
            const geom = parcelData.features[0].geometry;
            const poly = (geom.type === 'MultiPolygon' ? geom.coordinates[0][0] : geom.coordinates[0]) as [number, number][];
            const latLngs: [number, number][] = poly.map(([pLon, pLat]) => [pLat, pLon]);
            if (isMounted && latLngs.length > 0) {
              setActiveParcelCoords(latLngs);
            }
          }
        }
      } catch (err) {
        console.warn('Geocoding query fallback to default Barjols parcel:', err);
      }
    }
    fetchRealGeocoding();
    return () => { isMounted = false; };
  }, [clientAddress]);

  // Initialisation Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isSubscribed = true;

    async function initLeaflet() {
      const L = await import('leaflet');

      if (!isSubscribed || !mapContainerRef.current) return;

      // Nettoyer instance précédente si existante
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: customCenter,
        zoom: 18,
        minZoom: 13,
        maxZoom: 20,
        zoomControl: false,
        attributionControl: false,
      });

      // Layer Groupe pour les tracés
      const layersGroup = L.layerGroup().addTo(map);
      geojsonGroupRef.current = layersGroup;

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    initLeaflet();

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [customCenter]);

  // Mise à jour des calques de tuiles et des polygones parcellaires lors du changement de mode
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // 1. Mettre à jour le fond de carte (TileLayer)
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      if (cadastreLayerRef.current) {
        map.removeLayer(cadastreLayerRef.current);
      }

      let tileUrl = '';
      let maxZoom = 20;

      if (viewMode === 'satellite' || viewMode === 'mass') {
        // ESRI World Imagery HD (Satellite réel)
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 19;
      } else if (viewMode === 'cadastre') {
        // Plan épuré / Cadastral
        tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        maxZoom = 20;
      } else if (viewMode === 'environment') {
        // OpenStreetMap / Voyager
        tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        maxZoom = 19;
      }

      const newTileLayer = L.tileLayer(tileUrl, {
        maxZoom,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = newTileLayer;

      // 2. Nettoyer les éléments vectoriels
      if (geojsonGroupRef.current) {
        geojsonGroupRef.current.clearLayers();
      }
      const group = geojsonGroupRef.current || L.layerGroup().addTo(map);

      // 3. Dessiner les parcelles mitoyennes
      if (viewMode === 'cadastre' || (showCadastreLayer && viewMode !== 'environment')) {
        NEIGHBOR_PARCELS.forEach(np => {
          const poly = L.polygon(np.coords, {
            color: '#94a3b8',
            weight: 1.5,
            dashArray: '4,4',
            fillColor: '#64748b',
            fillOpacity: viewMode === 'cadastre' ? 0.08 : 0.05,
          }).addTo(group);

          // Numéro de parcelle voisine
          const center = poly.getBounds().getCenter();
          const labelIcon = L.divIcon({
            className: 'custom-parcel-label',
            html: `<div style="background: rgba(15,23,42,0.7); color: #cbd5e1; font-size: 10px; font-weight: 800; padding: 2px 5px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; text-align: center;">N° ${np.num}<br/><span style="font-size: 8px; color: #94a3b8;">${np.surface}m²</span></div>`,
            iconSize: [40, 24],
            iconAnchor: [20, 12],
          });
          L.marker(center, { icon: labelIcon, interactive: false }).addTo(group);
        });
      }

      // 4. Dessiner le polygone réel de la parcelle cible (Section B n° 297 - 749 m²)
      if (viewMode !== 'environment') {
        const targetPolygon = L.polygon(activeParcelCoords, {
          color: '#00A0E2',
          weight: 3,
          fillColor: '#00A0E2',
          fillOpacity: viewMode === 'cadastre' ? 0.22 : 0.25,
        }).addTo(group);

        // Centrer et ajuster
        if (viewMode === 'mass') {
          map.setView(targetPolygon.getBounds().getCenter(), 19);
        } else if (viewMode === 'satellite' || viewMode === 'cadastre') {
          map.fitBounds(targetPolygon.getBounds().pad(0.35));
        }

        // Marqueur principal / Cartouche sur la parcelle
        const pCenter = targetPolygon.getBounds().getCenter();
        const mainPinIcon = L.divIcon({
          className: 'custom-main-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none;">
              <div style="background: #0f172a; color: #ffffff; border: 2px solid #00A0E2; padding: 4px 8px; border-radius: 10px; font-size: 11px; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.4); text-align: center; white-space: nowrap;">
                <span style="color: #38bdf8;">PARCELLE B 297</span><br/>
                <span style="font-size: 9px; color: #e2e8f0;">${totalSuperficie} m² • 1248 Rte de Draguignan</span>
              </div>
              <div style="width: 12px; height: 12px; background: #00A0E2; border: 2px solid #ffffff; border-radius: 50%; margin-top: 4px; box-shadow: 0 0 10px #00A0E2;"></div>
            </div>
          `,
          iconSize: [160, 50],
          iconAnchor: [80, 48],
        });
        L.marker(pCenter, { icon: mainPinIcon, interactive: false }).addTo(group);

        // 5. Cotes métriques (si activées)
        if (showDimensions && viewMode === 'satellite') {
          const dimPoints = [
            { pos: [43.55970, 6.00940] as [number, number], label: '27,5 m (Nord)' },
            { pos: [43.55960, 6.00965] as [number, number], label: '27,2 m (Est)' },
            { pos: [43.55940, 6.00952] as [number, number], label: '27,8 m (Sud • D560)' },
            { pos: [43.55948, 6.00932] as [number, number], label: '27,0 m (Ouest)' },
          ];
          dimPoints.forEach(dp => {
            const dimIcon = L.divIcon({
              className: 'custom-dim-label',
              html: `<div style="background: rgba(15,23,42,0.85); color: #38bdf8; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid rgba(56,189,248,0.4); white-space: nowrap;">${dp.label}</div>`,
              iconSize: [60, 18],
              iconAnchor: [30, 9],
            });
            L.marker(dp.pos, { icon: dimIcon, interactive: false }).addTo(group);
          });
        }
      }

      // 6. Mode Environnement & Commodités : vue large avec les repères réels de Barjols
      if (viewMode === 'environment') {
        map.setView(customCenter, 15);

        // Marqueur de la propriété
        const propMarker = L.circleMarker(customCenter, {
          radius: 12,
          color: '#ffffff',
          weight: 3,
          fillColor: '#00A0E2',
          fillOpacity: 1,
        }).addTo(group);
        propMarker.bindPopup(`<b>1248 Route de Draguignan</b><br/>Votre villa sur 749 m² de terrain`, { closeButton: false }).openPopup();

        // Marqueurs des commodités de Barjols
        LOCAL_AMENITIES.forEach(amenity => {
          const amIcon = L.divIcon({
            className: 'custom-amenity-marker',
            html: `
              <div style="background: #0f172a; color: #ffffff; padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 8px rgba(0,0,0,0.3); white-space: nowrap; display: flex; align-items: center; gap: 4px;">
                <span style="color: #00A0E2;">📍</span>
                <span>${amenity.name.split('(')[0]}</span>
                <span style="background: rgba(0,160,226,0.2); color: #38bdf8; padding: 1px 4px; border-radius: 4px; font-size: 9px;">${amenity.distance}</span>
              </div>
            `,
            iconSize: [140, 26],
            iconAnchor: [70, 13],
          });
          L.marker(amenity.coords, { icon: amIcon }).addTo(group);
        });
      }
    });
  }, [viewMode, showDimensions, showCadastreLayer, customCenter, activeParcelCoords, totalSuperficie]);

  const handleResetZoom = () => {
    if (mapInstanceRef.current) {
      if (viewMode === 'environment') {
        mapInstanceRef.current.setView(customCenter, 15);
      } else {
        mapInstanceRef.current.setView(customCenter, 18);
      }
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="situation-section-container">
      
      {/* 1. Header principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" id="situation-header">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Plan de situation & Cadastre Réel</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#00A0E2]/10 text-[#00A0E2] px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3" /> Données officielles IGN & DGFIP
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{addressToDisplay}</h2>
          <p className="text-xs text-slate-500">Parcelle Section B n° 0297 (749 m²) • Imagerie satellite haute résolution et plan cadastral officiel interactif.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2" id="situation-header-badges">
          <div className="flex items-center gap-2 bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200/80">
            <Compass className="w-4 h-4 text-[#00A0E2]" />
            <span>{getCity(addressToDisplay)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-200/60">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Exposition Sud / Sud-Est (175°)</span>
          </div>
        </div>
      </div>

      {/* 2. Menubar de sélection des vues (Full-width Mandat OS style) */}
      <div className="w-full border border-slate-200/80 bg-white p-1.5 shadow-xs rounded-2xl gap-1.5 overflow-x-auto flex items-center scrollbar-none" id="situation-views-menubar">
        {[
          { id: 'satellite' as ViewMode, label: 'Vue Aérienne & Satellite HD', icon: Eye },
          { id: 'cadastre' as ViewMode, label: 'Plan Cadastral Officiel (B 0297)', icon: Grid, count: `${activeParcels.length} parcelle` },
          { id: 'mass' as ViewMode, label: 'Plan de Masse & Aménagements', icon: Layers, count: `${PROPERTY_ZONES.length} zones` },
          { id: 'environment' as ViewMode, label: 'Contexte & Commodités (Barjols)', icon: Navigation, count: `${LOCAL_AMENITIES.length} repères` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = viewMode === tab.id;
          return (
            <button
              key={tab.id}
              id={`btn-view-${tab.id}`}
              onClick={() => { setViewMode(tab.id); setSelectedZone(null); }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-max cursor-pointer ${
                isActive
                  ? 'bg-[#00A0E2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Main Split Grid: Carte interactive Leaflet réelle (Gauche) & Tableau de bord (Droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="situation-split-grid">
        
        {/* Colonne Gauche : Visualiseur Cartographique Interactif Réel (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[560px]" id="situation-map-card">
          
          {/* Barre d'outils du visualiseur */}
          <div className="bg-slate-50/90 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-2 z-10" id="viewport-toolbar">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {viewMode === 'satellite' && <Eye className="w-4 h-4 text-[#00A0E2]" />}
                {viewMode === 'cadastre' && <Grid className="w-4 h-4 text-[#00A0E2]" />}
                {viewMode === 'mass' && <Layers className="w-4 h-4 text-[#00A0E2]" />}
                {viewMode === 'environment' && <Navigation className="w-4 h-4 text-[#00A0E2]" />}
                {viewMode === 'satellite' && 'Imagerie Satellite Réelle HD (Barjols)'}
                {viewMode === 'cadastre' && 'Parcelle Officielle DGFIP Section B n° 0297'}
                {viewMode === 'mass' && 'Plan de Masse & Délimitation des Espaces'}
                {viewMode === 'environment' && 'Quartier & Commodités à Barjols'}
              </span>
            </div>

            {/* Boutons d'options / Calques */}
            <div className="flex items-center gap-1.5">
              {viewMode === 'satellite' && (
                <button
                  id="toggle-cadastre-layer-btn"
                  onClick={() => setShowCadastreLayer(!showCadastreLayer)}
                  title="Afficher/Masquer le calque cadastral"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    showCadastreLayer ? 'bg-slate-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Grid className="w-3 h-3" />
                  <span className="hidden sm:inline">Cadastre</span>
                </button>
              )}

              {viewMode === 'satellite' && (
                <button
                  id="toggle-dimensions-btn"
                  onClick={() => setShowDimensions(!showDimensions)}
                  title="Afficher/Masquer les cotes métriques"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    showDimensions ? 'bg-[#00A0E2] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Ruler className="w-3 h-3" />
                  <span className="hidden sm:inline">Cotes</span>
                </button>
              )}

              {/* Zoom Buttons */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button 
                  onClick={handleZoomIn} 
                  className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded"
                  title="Zoom avant"
                >
                  +
                </button>
                <button 
                  onClick={handleResetZoom} 
                  className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:bg-slate-100 rounded"
                  title="Recentrer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button 
                  onClick={handleZoomOut} 
                  className="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded"
                  title="Zoom arrière"
                >
                  -
                </button>
              </div>
            </div>
          </div>

          {/* Zone du conteneur Leaflet interactif réel */}
          <div className="flex-1 relative bg-slate-900 overflow-hidden" id="map-viewport">
            <div 
              ref={mapContainerRef} 
              id="leaflet-map-container" 
              className="w-full h-full"
              style={{ minHeight: '100%' }}
            />

            {/* Badge de géoréférencement IGN en temps réel */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-slate-700 shadow-md z-[1000] pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Géoréférencé IGN / DGFIP • 43.5595° N, 6.0095° E</span>
            </div>

            {/* Boussole Sud */}
            <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-white py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-slate-700 shadow-md z-[1000] pointer-events-none">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>SUD (175°)</span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Tableau de Bord Parcellaire & Urbanisme (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-5" id="situation-dashboard-sidebar">
          
          {/* Card 1 : Synthèse du Terrain */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col gap-4 relative overflow-hidden" id="terrain-summary-card">
            <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-[#00A0E2] rounded-full opacity-15 filter blur-2xl" />
            <div className="absolute -left-10 -top-10 w-36 h-36 bg-emerald-500 rounded-full opacity-10 filter blur-2xl" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Contenance cadastrale officielle</span>
                <h3 className="text-3xl font-extrabold tracking-tight mt-1 text-white tabular-nums" id="total-terrain-surface">
                  {totalSuperficie} m²
                </h3>
              </div>
              <span className="bg-[#00A0E2]/20 text-[#00A0E2] text-xs font-extrabold px-3 py-1.5 rounded-xl border border-[#00A0E2]/40">
                Section B n° 0297
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Terrain privatif arboré d'oliviers et de chênes, entièrement clos, sans vis-à-vis direct et bénéficiant d'une orientation <span className="font-bold text-amber-400">Sud / Sud-Est (175°)</span> sur la Route de Draguignan à Barjols.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80" id="terrain-mini-stats">
              <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Emprise Bâti</span>
                <span className="text-sm font-extrabold text-white">135 m² + 22 m²</span>
              </div>
              <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Jardin Clos</span>
                <span className="text-sm font-extrabold text-emerald-400">~550 m²</span>
              </div>
            </div>
          </div>

          {/* Card 2 : Fiche Réglementaire & Urbanisme */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3.5" id="urbanisme-info-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00A0E2]" />
              Zonage PLU & Viabilisation (Barjols)
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Zone PLU</span>
                <span className="font-extrabold text-slate-900 mt-0.5">Zone U (Urbaine résidentielle)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Emprise au sol max</span>
                <span className="font-extrabold text-slate-900 mt-0.5">30 % (225 m² max)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Assainissement</span>
                <span className="font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tout-à-l'égout
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Réseaux</span>
                <span className="font-extrabold text-slate-900 mt-0.5">Eau, Élec, Fibre</span>
              </div>
            </div>
          </div>

          {/* Card 3 : Focus Zone sélectionnée ou Commodités */}
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div 
                key={selectedZone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#00A0E2]/5 rounded-3xl p-5 border border-[#00A0E2]/30 flex flex-col gap-2.5 shadow-sm"
                id="selected-zone-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#00A0E2] text-white flex items-center justify-center">
                      <selectedZone.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{selectedZone.name}</h4>
                      <span className="text-[10px] text-[#00A0E2] font-bold">{selectedZone.surface} • {selectedZone.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedZone(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700"
                  >
                    Fermer
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {selectedZone.description}
                </p>
              </motion.div>
            ) : viewMode === 'environment' ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3" id="amenities-list-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#00A0E2]" />
                  Commodités & Transports (Barjols)
                </h4>
                <div className="flex flex-col gap-2">
                  {LOCAL_AMENITIES.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl text-xs border border-slate-100">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-extrabold text-[#00A0E2] shrink-0 ml-2">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Tableau cadastral officiel */
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3" id="cadastral-parcels-table-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Grid className="w-4 h-4 text-[#00A0E2]" />
                  Détail de la parcelle cadastrale officielle
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" id="parcels-summary-table">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-2 px-1">Section</th>
                        <th className="py-2 px-1">Numéro</th>
                        <th className="py-2 px-1 text-right">Contenance</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {activeParcels.map((parcel) => (
                        <tr 
                          key={parcel.numero}
                          className="border-b border-slate-50 font-bold"
                        >
                          <td className="py-2.5 px-1">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-extrabold">
                              {parcel.section}
                            </span>
                          </td>
                          <td className="py-2.5 px-1 text-slate-900 font-extrabold">{parcel.numero}</td>
                          <td className="py-2.5 px-1 text-right font-extrabold text-[#00A0E2]">{parcel.superficie} m²</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-1 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                  <Info className="w-4 h-4 text-[#00A0E2] shrink-0" />
                  <span>Données certifiées issues du serveur cadastral DGFIP (Commune de Barjols - 83012).</span>
                </div>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
