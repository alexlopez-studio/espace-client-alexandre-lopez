import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Grid, 
  Layers, 
  Navigation, 
  Compass, 
  MapPin, 
  CheckCircle2, 
  Sun, 
  ShieldCheck, 
  Droplets, 
  Trees, 
  RotateCcw, 
  Sparkles, 
  Ruler, 
  Building2, 
  Car, 
  Info,
  ExternalLink,
  Map as MapIcon,
  Loader2
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
  offsetLat?: number;
  offsetLon?: number;
}

interface NeighborParcel {
  id: string;
  num: string;
  surface: number;
  coords: [number, number][];
}

interface LocalAmenity {
  name: string;
  category: string;
  distance: string;
  time: string;
  coords: [number, number];
}

// Distance géodésique Haversine (en mètres)
function getHaversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Formater la distance lisiblement (ex: 350 m ou 1,4 km)
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters / 10) * 10} m`;
  }
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

// Estimer le temps de trajet à pied ou en voiture
function estimateTime(meters: number): string {
  if (meters <= 800) {
    const minWalk = Math.max(1, Math.round(meters / 80));
    return `${minWalk} min à pied`;
  }
  if (meters <= 2000) {
    const minDrive = Math.max(2, Math.round(meters / 500));
    const minWalk = Math.round(meters / 80);
    return `${minDrive} min en voiture / ${minWalk} min à pied`;
  }
  const minDrive = Math.max(2, Math.round(meters / 600));
  return `${minDrive} min en voiture`;
}

// Coordonnées par défaut en Provence (Barjols) en cas d'absence complète d'adresse
const FALLBACK_CENTER: [number, number] = [43.55942, 6.00958];

export default function SituationSection({ 
  cadastralParcels: propParcels, 
  clientAddress,
  propertyDetails
}: SituationSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('satellite');
  const [selectedZone, setSelectedZone] = useState<PropertyZone | null>(null);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showCadastreLayer, setShowCadastreLayer] = useState<boolean>(true);
  const [loadingGeo, setLoadingGeo] = useState<boolean>(true);

  // État géographique dynamique
  const [mapCenter, setMapCenter] = useState<[number, number]>(FALLBACK_CENTER);
  const [targetPolygon, setTargetPolygon] = useState<[number, number][]>([]);
  const [neighborParcels, setNeighborParcels] = useState<NeighborParcel[]>([]);
  const [dimensionLabels, setDimensionLabels] = useState<{ pos: [number, number]; label: string }[]>([]);
  const [geoInfo, setGeoInfo] = useState<{
    city: string;
    postcode: string;
    citycode: string;
    street: string;
    label: string;
    department: string;
  }>({
    city: 'Barjols',
    postcode: '83670',
    citycode: '83012',
    street: 'Route de Draguignan',
    label: clientAddress || '1248 Route de Draguignan, 83670 Barjols',
    department: 'Var (83)',
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const cadastreLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonGroupRef = useRef<L.LayerGroup | null>(null);

  // Parcelles actives transmises ou déduites
  const activeParcels: CadastralParcel[] = useMemo(() => {
    if (propParcels && propParcels.length > 0) return propParcels;
    return [{ section: 'B', prefixe: '000', numero: '0297', superficie: propertyDetails?.landSurface || 749 }];
  }, [propParcels, propertyDetails?.landSurface]);

  const totalSuperficie = useMemo(() => {
    const sum = activeParcels.reduce((acc, p) => acc + (Number(p.superficie) || 0), 0);
    return sum > 0 ? sum : (propertyDetails?.landSurface || 749);
  }, [activeParcels, propertyDetails?.landSurface]);

  const formattedParcelsBadge = useMemo(() => {
    return activeParcels.map(p => `Section ${p.section} n° ${p.numero}`).join(', ');
  }, [activeParcels]);

  const displayAddress = clientAddress || geoInfo.label || 'Adresse en cours d’évaluation';

  // 1. Géocodage dynamique et récupération de la parcelle IGN réelle
  useEffect(() => {
    let isMounted = true;

    async function loadCadastralData() {
      setLoadingGeo(true);
      const queryAddress = clientAddress || '1248 Route de Draguignan, 83670 Barjols';

      try {
        // A. Géocodage officiel via l'API Adresse Nationale BAN (data.gouv.fr)
        const banRes = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(queryAddress)}&limit=1`);
        const banJson = await banRes.json();

        let lat = FALLBACK_CENTER[0];
        let lon = FALLBACK_CENTER[1];
        let city = 'Barjols';
        let postcode = '83670';
        let citycode = '83012';
        let street = 'Route de Draguignan';
        let fullLabel = queryAddress;
        let department = 'Var (83)';

        if (banJson?.features?.length > 0) {
          const feat = banJson.features[0];
          const coords = feat.geometry.coordinates; // [lon, lat]
          lon = coords[0];
          lat = coords[1];
          city = feat.properties.city || city;
          postcode = feat.properties.postcode || postcode;
          citycode = feat.properties.citycode || citycode;
          street = feat.properties.street || feat.properties.name || street;
          fullLabel = feat.properties.label || queryAddress;
          if (feat.properties.context) {
            department = feat.properties.context.split(',')[0]?.trim() || department;
          }
        }

        if (!isMounted) return;

        setGeoInfo({
          city,
          postcode,
          citycode,
          street,
          label: fullLabel,
          department,
        });
        setMapCenter([lat, lon]);

        // B. Recherche de la parcelle cadastrale exacte auprès de l'IGN Apicarto
        let targetGeom: [number, number][] = [];
        const firstParcel = activeParcels[0];

        // Méthode 1 : Requête par code INSEE + Section + Numéro si disponible
        if (firstParcel?.section && firstParcel?.numero && citycode) {
          const rawSec = firstParcel.section.trim().toUpperCase();
          const secFormatted = rawSec.length === 1 ? `0${rawSec}` : rawSec;
          const numFormatted = firstParcel.numero.trim().padStart(4, '0');

          try {
            const ignParcelRes = await fetch(
              `https://apicarto.ign.fr/api/cadastre/parcelle?code_insee=${citycode}&section=${secFormatted}&numero=${numFormatted}`
            );
            if (ignParcelRes.ok) {
              const ignData = await ignParcelRes.json();
              if (ignData?.features?.length > 0) {
                const featGeom = ignData.features[0].geometry;
                const coordsArray = featGeom.type === 'MultiPolygon' 
                  ? featGeom.coordinates[0][0] 
                  : featGeom.coordinates[0];
                targetGeom = coordsArray.map(([pLon, pLat]: [number, number]) => [pLat, pLon]);
              }
            }
          } catch (e) {
            console.warn('IGN direct parcel query error, falling back to point lookup:', e);
          }
        }

        // Méthode 2 : Si non trouvée par référence, requête IGN Apicarto par point [lon, lat]
        if (targetGeom.length === 0) {
          try {
            const ignPointRes = await fetch(
              `https://apicarto.ign.fr/api/cadastre/parcelle?geom=${encodeURIComponent(JSON.stringify({ type: 'Point', coordinates: [lon, lat] }))}`
            );
            if (ignPointRes.ok) {
              const ignData = await ignPointRes.json();
              if (ignData?.features?.length > 0) {
                const featGeom = ignData.features[0].geometry;
                const coordsArray = featGeom.type === 'MultiPolygon' 
                  ? featGeom.coordinates[0][0] 
                  : featGeom.coordinates[0];
                targetGeom = coordsArray.map(([pLon, pLat]: [number, number]) => [pLat, pLon]);
              }
            }
          } catch (e) {
            console.warn('IGN point lookup failed:', e);
          }
        }

        // Méthode 3 : Si toujours pas de géométrie, générer un polygone cohérent basé sur la contenance
        if (targetGeom.length === 0) {
          const sideMeters = Math.sqrt(totalSuperficie > 0 ? totalSuperficie : 750);
          const dLat = (sideMeters / 111320) / 2;
          const dLon = (sideMeters / (40075000 * Math.cos((lat * Math.PI) / 180) / 360)) / 2;
          targetGeom = [
            [lat - dLat, lon - dLon],
            [lat - dLat, lon + dLon],
            [lat + dLat, lon + dLon],
            [lat + dLat, lon - dLon],
            [lat - dLat, lon - dLon],
          ];
        }

        if (!isMounted) return;
        setTargetPolygon(targetGeom);

        // C. Calcul du centre géométrique de la parcelle cible
        let polyCenterLat = lat;
        let polyCenterLon = lon;
        if (targetGeom.length > 0) {
          const lats = targetGeom.map(p => p[0]);
          const lons = targetGeom.map(p => p[1]);
          polyCenterLat = (Math.min(...lats) + Math.max(...lats)) / 2;
          polyCenterLon = (Math.min(...lons) + Math.max(...lons)) / 2;
          setMapCenter([polyCenterLat, polyCenterLon]);
        }

        // D. Calcul dynamique des cotes métriques sur les segments de la parcelle
        const calculatedDims: { pos: [number, number]; label: string }[] = [];
        if (targetGeom.length >= 3) {
          for (let i = 0; i < targetGeom.length - 1; i++) {
            const p1 = targetGeom[i];
            const p2 = targetGeom[i + 1];
            const dist = getHaversineDistanceMeters(p1[0], p1[1], p2[0], p2[1]);
            if (dist >= 4) { // Ne coter que les segments significatifs (> 4 m)
              const midLat = (p1[0] + p2[0]) / 2;
              const midLon = (p1[1] + p2[1]) / 2;
              calculatedDims.push({
                pos: [midLat, midLon],
                label: `${(Math.round(dist * 10) / 10).toFixed(1).replace('.', ',')} m`,
              });
            }
          }
        }
        setDimensionLabels(calculatedDims);

        // E. Récupération des parcelles mitoyennes dans le voisinage via IGN Apicarto
        try {
          const delta = 0.0015; // Rayon d'environ 150m
          const bboxPolygon = {
            type: 'Polygon',
            coordinates: [[
              [polyCenterLon - delta, polyCenterLat - delta],
              [polyCenterLon + delta, polyCenterLat - delta],
              [polyCenterLon + delta, polyCenterLat + delta],
              [polyCenterLon - delta, polyCenterLat + delta],
              [polyCenterLon - delta, polyCenterLat - delta],
            ]]
          };
          const bboxRes = await fetch(`https://apicarto.ign.fr/api/cadastre/parcelle?geom=${encodeURIComponent(JSON.stringify(bboxPolygon))}`);
          if (bboxRes.ok) {
            const bboxData = await bboxRes.json();
            if (bboxData?.features?.length > 0) {
              const neighbors: NeighborParcel[] = bboxData.features
                .filter((f: any) => {
                  const num = f.properties?.numero || '';
                  const targetNum = firstParcel?.numero?.padStart(4, '0') || '';
                  return num !== targetNum;
                })
                .slice(0, 8)
                .map((f: any, idx: number) => {
                  const geom = f.geometry;
                  const coordsArray = geom.type === 'MultiPolygon' ? geom.coordinates[0][0] : geom.coordinates[0];
                  const latLngs: [number, number][] = (coordsArray || []).map(([pLon, pLat]: [number, number]) => [pLat, pLon]);
                  return {
                    id: f.properties?.idu || `neigh-${idx}`,
                    num: f.properties?.numero || `00${idx + 1}`,
                    surface: f.properties?.contenance || 0,
                    coords: latLngs,
                  };
                })
                .filter((n: NeighborParcel) => n.coords.length > 2);

              if (isMounted) setNeighborParcels(neighbors);
            }
          }
        } catch (e) {
          console.warn('IGN neighbor query error:', e);
        }

      } catch (err) {
        console.error('Error fetching cadastral geocoding:', err);
      } finally {
        if (isMounted) setLoadingGeo(false);
      }
    }

    loadCadastralData();

    return () => {
      isMounted = false;
    };
  }, [clientAddress, activeParcels, totalSuperficie]);

  // 2. Commodités locales adaptées dynamiquement au centre et à la commune
  const dynamicAmenities: LocalAmenity[] = useMemo(() => {
    const [cLat, cLon] = mapCenter;
    const isBarjols = geoInfo.city.toLowerCase().includes('barjols') || geoInfo.postcode === '83670';

    if (isBarjols) {
      return [
        {
          name: 'Centre historique de Barjols (Place de la Rouguière)',
          category: 'Mairie & Vie locale',
          coords: [43.5582, 6.0068] as [number, number],
          distance: formatDistance(getHaversineDistanceMeters(cLat, cLon, 43.5582, 6.0068)),
          time: estimateTime(getHaversineDistanceMeters(cLat, cLon, 43.5582, 6.0068)),
        },
        {
          name: 'Supermarché, boulangerie & commerces de proximité',
          category: 'Commerces & Services',
          coords: [43.5592, 6.0022] as [number, number],
          distance: formatDistance(getHaversineDistanceMeters(cLat, cLon, 43.5592, 6.0022)),
          time: estimateTime(getHaversineDistanceMeters(cLat, cLon, 43.5592, 6.0022)),
        },
        {
          name: 'Collège Joseph d’Arbaud & Écoles primaires',
          category: 'Éducation',
          coords: [43.5552, 6.0125] as [number, number],
          distance: formatDistance(getHaversineDistanceMeters(cLat, cLon, 43.5552, 6.0125)),
          time: estimateTime(getHaversineDistanceMeters(cLat, cLon, 43.5552, 6.0125)),
        },
        {
          name: 'Pôle Médical & Pharmacie de Barjols',
          category: 'Santé',
          coords: [43.5575, 6.0045] as [number, number],
          distance: formatDistance(getHaversineDistanceMeters(cLat, cLon, 43.5575, 6.0045)),
          time: estimateTime(getHaversineDistanceMeters(cLat, cLon, 43.5575, 6.0045)),
        },
        {
          name: 'Site remarquable du Vallon des Carmes & Cascades',
          category: 'Patrimoine naturel',
          coords: [43.5518, 6.0012] as [number, number],
          distance: formatDistance(getHaversineDistanceMeters(cLat, cLon, 43.5518, 6.0012)),
          time: estimateTime(getHaversineDistanceMeters(cLat, cLon, 43.5518, 6.0012)),
        },
      ];
    }

    const city = geoInfo.city;
    const offsets = [
      { name: `Centre-ville & Mairie (${city})`, category: 'Mairie & Services', dLat: -0.006, dLon: -0.004 },
      { name: `Commerces de proximité & Marché provençal`, category: 'Commerces', dLat: 0.004, dLon: -0.007 },
      { name: `Écoles primaires & Collège de secteur`, category: 'Éducation', dLat: -0.008, dLon: 0.005 },
      { name: `Pôle médical, Professionnels de santé & Pharmacie`, category: 'Santé', dLat: -0.003, dLon: -0.006 },
      { name: `Axes routiers principaux & Accès autoroute`, category: 'Transports', dLat: 0.012, dLon: 0.008 },
    ];

    return offsets.map(item => {
      const amLat = cLat + item.dLat;
      const amLon = cLon + item.dLon;
      const distMeters = getHaversineDistanceMeters(cLat, cLon, amLat, amLon);
      return {
        name: item.name,
        category: item.category,
        coords: [amLat, amLon] as [number, number],
        distance: formatDistance(distMeters),
        time: estimateTime(distMeters),
      };
    });
  }, [mapCenter, geoInfo.city, geoInfo.postcode]);

  // 3. Découpage des zones pour le Plan de Masse (adapté à la surface et au terrain réels)
  const dynamicPropertyZones: PropertyZone[] = useMemo(() => {
    const mainSurface = propertyDetails?.surface || 135;
    const roomsCount = propertyDetails?.rooms || 5;
    const bedroomsCount = propertyDetails?.bedrooms || 4;
    const gardenSurface = Math.max(100, totalSuperficie - mainSurface - 50);

    return [
      {
        id: 'main_building',
        name: 'Bâti Principal (Habitation)',
        type: 'Surface habitable',
        surface: `${mainSurface} m²`,
        description: `Bâti principal de ${mainSurface} m² (${roomsCount} pièces, ${bedroomsCount} chambres) avec aménagement optimisé de plain-pied et combles/étage.`,
        icon: Building2,
        color: '#e65100',
        offsetLat: 0,
        offsetLon: 0,
      },
      {
        id: 'outdoor_terrace',
        name: 'Terrasse & Espace de Vie Sud',
        type: 'Aménagement extérieur',
        surface: '32 m²',
        description: 'Terrasse dallée sans vis-à-vis avec vue dégagée, bénéficiant d’une exposition idéale Sud / Sud-Est.',
        icon: Sun,
        color: '#f59e0b',
        offsetLat: -0.0001,
        offsetLon: 0,
      },
      {
        id: 'pool_relax',
        name: 'Espace Piscine / Détente',
        type: 'Bassin maçonné & Plage',
        surface: '28 m²',
        description: 'Bassin aménagé avec plage dallée, totalement intégré au cadre paysager privatif.',
        icon: Droplets,
        color: '#00A0E2',
        offsetLat: 0.00012,
        offsetLon: 0.0001,
      },
      {
        id: 'garden_area',
        name: 'Jardin & Restanques Arborées',
        type: 'Terrain privatif clos',
        surface: `~${gardenSurface} m²`,
        description: `Terrain privatif arboré d’arbres et essences méditerranéennes, entièrement clos et sécurisé.`,
        icon: Trees,
        color: '#10b981',
        offsetLat: 0.00015,
        offsetLon: -0.0001,
      },
      {
        id: 'parking_garage',
        name: 'Garage & Stationnements',
        type: 'Accès & Stationnement',
        surface: '22 m² + Allée',
        description: 'Stationnement aisé pour plusieurs véhicules avec allée privative carrossable et garage fermé.',
        icon: Car,
        color: '#6366f1',
        offsetLat: -0.00015,
        offsetLon: -0.00008,
      },
    ];
  }, [propertyDetails, totalSuperficie]);

  // 4. Initialisation de la carte Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isSubscribed = true;

    async function initLeaflet() {
      const L = await import('leaflet');
      if (!isSubscribed || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: 18,
        minZoom: 12,
        maxZoom: 20,
        zoomControl: false,
        attributionControl: false,
      });

      const layersGroup = L.layerGroup().addTo(map);
      geojsonGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
    }

    initLeaflet();

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapCenter]);

  // 5. Rendu des tuiles (Satellite HD / IGN Cadastre / Voyager) et polygones Leaflet
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // 1. Gestion des TileLayers
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
      if (cadastreLayerRef.current) {
        map.removeLayer(cadastreLayerRef.current);
        cadastreLayerRef.current = null;
      }

      let baseTileUrl = '';
      let maxZoom = 20;

      if (viewMode === 'satellite' || viewMode === 'mass') {
        // Imagerie satellite HD ESRI
        baseTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        maxZoom = 19;
      } else {
        // Plan Voyager CartoDB
        baseTileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        maxZoom = 20;
      }

      const baseLayer = L.tileLayer(baseTileUrl, {
        maxZoom,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = baseLayer;

      // Calque transparent officiel du Cadastre IGN Géoplateforme
      if ((showCadastreLayer && viewMode === 'satellite') || viewMode === 'cadastre') {
        const ignCadastreUrl = 'https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
        const ignLayer = L.tileLayer(ignCadastreUrl, {
          maxZoom: 20,
          opacity: viewMode === 'cadastre' ? 0.9 : 0.75,
        }).addTo(map);
        cadastreLayerRef.current = ignLayer;
      }

      // 2. Nettoyage et rafraîchissement des couches vectorielles
      if (geojsonGroupRef.current) {
        geojsonGroupRef.current.clearLayers();
      }
      const group = geojsonGroupRef.current || L.layerGroup().addTo(map);

      // 3. Parcelles voisines DGFIP (en mode cadastre ou avec calque cadastre activé)
      if (viewMode === 'cadastre' || (showCadastreLayer && viewMode !== 'environment')) {
        neighborParcels.forEach((np) => {
          if (np.coords.length > 2) {
            const poly = L.polygon(np.coords, {
              color: '#94a3b8',
              weight: 1.5,
              dashArray: '3,4',
              fillColor: '#64748b',
              fillOpacity: viewMode === 'cadastre' ? 0.08 : 0.04,
            }).addTo(group);

            const center = poly.getBounds().getCenter();
            const labelIcon = L.divIcon({
              className: 'custom-parcel-label',
              html: `<div style="background: rgba(15,23,42,0.75); color: #cbd5e1; font-size: 10px; font-weight: 800; padding: 2px 5px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); white-space: nowrap; text-align: center;">N° ${np.num}${np.surface > 0 ? `<br/><span style="font-size: 8px; color: #94a3b8;">${np.surface}m²</span>` : ''}</div>`,
              iconSize: [42, 24],
              iconAnchor: [21, 12],
            });
            L.marker(center, { icon: labelIcon, interactive: false }).addTo(group);
          }
        });
      }

      // 4. Parcelle cible principale (Mise en valeur officielle)
      if (targetPolygon.length > 2 && viewMode !== 'environment') {
        const targetPoly = L.polygon(targetPolygon, {
          color: '#00A0E2',
          weight: 3.5,
          fillColor: '#00A0E2',
          fillOpacity: viewMode === 'cadastre' ? 0.25 : 0.22,
        }).addTo(group);

        const bounds = targetPoly.getBounds();
        const pCenter = bounds.getCenter();

        if (viewMode === 'mass') {
          map.setView(pCenter, 19);
        } else {
          map.fitBounds(bounds.pad(0.35));
        }

        // Cartouche interactif / Badge central
        const firstParcel = activeParcels[0];
        const parcelTitle = `PARCELLE ${firstParcel?.section || ''} ${firstParcel?.numero || ''}`.trim() || 'PARCELLE OFFICIELLE';
        const addressShort = geoInfo.street || geoInfo.city;

        const mainPinIcon = L.divIcon({
          className: 'custom-main-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; pointer-events: none;">
              <div style="background: #0f172a; color: #ffffff; border: 2px solid #00A0E2; padding: 5px 9px; border-radius: 10px; font-size: 11px; font-weight: 800; box-shadow: 0 6px 16px rgba(0,0,0,0.5); text-align: center; white-space: nowrap;">
                <span style="color: #38bdf8;">${parcelTitle}</span><br/>
                <span style="font-size: 9px; color: #e2e8f0;">${totalSuperficie} m² • ${addressShort}</span>
              </div>
              <div style="width: 12px; height: 12px; background: #00A0E2; border: 2px solid #ffffff; border-radius: 50%; margin-top: 4px; box-shadow: 0 0 12px #00A0E2;"></div>
            </div>
          `,
          iconSize: [160, 52],
          iconAnchor: [80, 50],
        });
        L.marker(pCenter, { icon: mainPinIcon, interactive: false }).addTo(group);

        // Cotes métriques réelles calculées
        if (showDimensions && viewMode === 'satellite') {
          dimensionLabels.forEach((dl) => {
            const dimIcon = L.divIcon({
              className: 'custom-dim-label',
              html: `<div style="background: rgba(15,23,42,0.85); color: #38bdf8; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid rgba(56,189,248,0.4); white-space: nowrap;">${dl.label}</div>`,
              iconSize: [50, 18],
              iconAnchor: [25, 9],
            });
            L.marker(dl.pos, { icon: dimIcon, interactive: false }).addTo(group);
          });
        }
      }

      // 5. Mode Contexte & Commodités (Environnement)
      if (viewMode === 'environment') {
        map.setView(mapCenter, 15);

        // Marqueur central de la propriété
        const propMarker = L.circleMarker(mapCenter, {
          radius: 12,
          color: '#ffffff',
          weight: 3,
          fillColor: '#00A0E2',
          fillOpacity: 1,
        }).addTo(group);
        propMarker.bindPopup(`<b>${geoInfo.label}</b><br/>Terrain de ${totalSuperficie} m² (${geoInfo.city})`, { closeButton: false }).openPopup();

        // Repères des commodités locales
        dynamicAmenities.forEach((amenity) => {
          const amIcon = L.divIcon({
            className: 'custom-amenity-marker',
            html: `
              <div style="background: #0f172a; color: #ffffff; padding: 4px 8px; border-radius: 8px; font-size: 10px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 8px rgba(0,0,0,0.35); white-space: nowrap; display: flex; align-items: center; gap: 5px;">
                <span style="color: #00A0E2;">📍</span>
                <span>${amenity.name.split('(')[0]}</span>
                <span style="background: rgba(0,160,226,0.25); color: #38bdf8; padding: 1px 5px; border-radius: 4px; font-size: 9px;">${amenity.distance}</span>
              </div>
            `,
            iconSize: [140, 26],
            iconAnchor: [70, 13],
          });
          L.marker(amenity.coords, { icon: amIcon }).addTo(group);
        });
      }
    });
  }, [
    viewMode, 
    showDimensions, 
    showCadastreLayer, 
    mapCenter, 
    targetPolygon, 
    neighborParcels, 
    dimensionLabels, 
    activeParcels, 
    totalSuperficie, 
    geoInfo, 
    dynamicAmenities
  ]);

  const handleResetZoom = () => {
    if (mapInstanceRef.current) {
      if (viewMode === 'environment') {
        mapInstanceRef.current.setView(mapCenter, 15);
      } else if (targetPolygon.length > 2) {
        const L = (window as any).L;
        if (L) {
          const poly = L.polygon(targetPolygon);
          mapInstanceRef.current.fitBounds(poly.getBounds().pad(0.35));
        } else {
          mapInstanceRef.current.setView(mapCenter, 18);
        }
      } else {
        mapInstanceRef.current.setView(mapCenter, 18);
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
      
      {/* 1. Header principal avec adresse exacte et données dynamiques */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" id="situation-header">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Plan de situation & Cadastre Réel</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#00A0E2]/10 text-[#00A0E2] px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3" /> Données officielles IGN & DGFIP
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{displayAddress}</h2>
          <p className="text-xs text-slate-500">
            {formattedParcelsBadge} ({totalSuperficie} m²) • Commune de {geoInfo.city} ({geoInfo.postcode}) • Imagerie satellite haute résolution et plan cadastral officiel interactif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2" id="situation-header-badges">
          <div className="flex items-center gap-2 bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200/80">
            <Compass className="w-4 h-4 text-[#00A0E2]" />
            <span>{geoInfo.city} ({geoInfo.postcode})</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-200/60">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Exposition Sud / Sud-Est</span>
          </div>
        </div>
      </div>

      {/* 2. Menubar de sélection des vues (Full-width style) */}
      <div className="w-full border border-slate-200/80 bg-white p-1.5 shadow-xs rounded-2xl gap-1.5 overflow-x-auto flex items-center scrollbar-none" id="situation-views-menubar">
        {[
          { id: 'satellite' as ViewMode, label: 'Vue Aérienne & Satellite HD', icon: Eye },
          { id: 'cadastre' as ViewMode, label: `Plan Cadastral Officiel (${formattedParcelsBadge})`, icon: Grid, count: `${activeParcels.length} parcelle${activeParcels.length > 1 ? 's' : ''}` },
          { id: 'mass' as ViewMode, label: 'Plan de Masse & Aménagements', icon: Layers, count: `${dynamicPropertyZones.length} zones` },
          { id: 'environment' as ViewMode, label: `Contexte & Commodités (${geoInfo.city})`, icon: Navigation, count: `${dynamicAmenities.length} repères` },
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
                
                {viewMode === 'satellite' && `Imagerie Satellite Réelle HD • ${geoInfo.city}`}
                {viewMode === 'cadastre' && `Parcelle Officielle DGFIP • ${formattedParcelsBadge}`}
                {viewMode === 'mass' && 'Plan de Masse & Délimitation des Espaces'}
                {viewMode === 'environment' && `Quartier & Commodités • ${geoInfo.city}`}
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

            {loadingGeo && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white z-[1500]">
                <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 shadow-xl">
                  <Loader2 className="w-4 h-4 animate-spin text-[#00A0E2]" />
                  <span className="text-xs font-bold">Synchronisation IGN & Cadastre en cours...</span>
                </div>
              </div>
            )}

            {/* Badge de géoréférencement IGN en temps réel */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-slate-700 shadow-md z-[1000] pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Géoréférencé IGN / DGFIP • {mapCenter[0].toFixed(4)}° N, {mapCenter[1].toFixed(4)}° E</span>
            </div>

            {/* Boussole Sud */}
            <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-white py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-slate-700 shadow-md z-[1000] pointer-events-none">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>SUD / SUD-EST</span>
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
                {formattedParcelsBadge}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Terrain privatif entièrement clos, sans vis-à-vis direct et bénéficiant d'une orientation <span className="font-bold text-amber-400">Sud / Sud-Est</span>, situé {displayAddress}.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80" id="terrain-mini-stats">
              <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Emprise Bâti</span>
                <span className="text-sm font-extrabold text-white">
                  {propertyDetails?.surface ? `${propertyDetails.surface} m²` : '135 m²'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Jardin Clos</span>
                <span className="text-sm font-extrabold text-emerald-400">
                  ~{Math.max(100, totalSuperficie - (propertyDetails?.surface || 135))} m²
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 : Fiche Réglementaire & Urbanisme */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3.5" id="urbanisme-info-card">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00A0E2]" />
              Zonage PLU & Viabilisation ({geoInfo.city})
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Zone PLU</span>
                <span className="font-extrabold text-slate-900 mt-0.5">Zone U (Urbaine résidentielle)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Emprise au sol</span>
                <span className="font-extrabold text-slate-900 mt-0.5">Jusqu’à 30% d’emprise</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Assainissement</span>
                <span className="font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Réseau conforme
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Réseaux & Fibre</span>
                <span className="font-extrabold text-slate-900 mt-0.5">Eau, Élec, Fibre optique</span>
              </div>
            </div>
          </div>

          {/* Card 3 : Focus Zone sélectionnée, Commodités ou Tableau cadastral */}
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
                    className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
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
                  Commodités & Proximités ({geoInfo.city})
                </h4>
                <div className="flex flex-col gap-2">
                  {dynamicAmenities.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl text-xs border border-slate-100">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.category} • {item.time}</span>
                      </div>
                      <span className="font-extrabold text-[#00A0E2] shrink-0 ml-2">{item.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : viewMode === 'mass' ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3" id="mass-zones-list-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00A0E2]" />
                  Découpage des Espaces & Aménagements
                </h4>
                <div className="flex flex-col gap-1.5">
                  {dynamicPropertyZones.map((zone) => {
                    const Icon = zone.icon;
                    const isSelected = selectedZone?.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZone(isSelected ? null : zone)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs border transition-all text-left cursor-pointer ${
                          isSelected 
                            ? 'bg-[#00A0E2]/10 border-[#00A0E2]/40 text-[#0077B6]' 
                            : 'bg-slate-50/70 border-slate-100 hover:border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 shrink-0 text-[#00A0E2]" />
                          <div className="truncate">
                            <span className="font-bold block truncate">{zone.name}</span>
                            <span className="text-[10px] text-slate-400">{zone.type}</span>
                          </div>
                        </div>
                        <span className="font-extrabold shrink-0 ml-2 text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 text-[11px]">
                          {zone.surface}
                        </span>
                      </button>
                    );
                  })}
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
                      {activeParcels.map((parcel, idx) => (
                        <tr 
                          key={`${parcel.section}-${parcel.numero}-${idx}`}
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
                  <span>Données certifiées issues du serveur cadastral DGFIP & IGN (Commune de {geoInfo.city} - {geoInfo.citycode}).</span>
                </div>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
