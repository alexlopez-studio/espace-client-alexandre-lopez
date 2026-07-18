import React from 'react';
import {
  Star,
  Phone,
  Mail,
  Building2,
  MapPin,
  GraduationCap,
  TrendingUp,
  Heart,
  Truck,
  ShieldCheck,
  Award,
} from 'lucide-react';
import type { SoldPropertyByIad } from '../types';

interface IadSectionProps {
  iadTrackRecord?: SoldPropertyByIad[];
}

export default function IadSection({ iadTrackRecord }: IadSectionProps) {
  const formatEuro = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const hasTrackRecord = iadTrackRecord && iadTrackRecord.length > 0;

  return (
    <div className="w-full flex flex-col gap-6 lg:p-4" id="iad-section-container">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Votre réseau iad</span>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Track record & services</h2>
          <p className="text-xs text-slate-500">Les biens vendus par iad dans votre secteur et les avantages du réseau.</p>
        </div>
      </div>

      {/* Track Record : Biens vendus par iad */}
      {hasTrackRecord && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00A0E2]" />
            Nos biens vendus dans le secteur
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {iadTrackRecord.map((property) => (
              <div
                key={property.id}
                className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Vendu
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{property.soldDate}</span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">{property.title}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">
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

      {/* Les + iad */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00A0E2]" />
          Les + iad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Building2,
              title: 'Digitalisation de l\'agence',
              description: 'Réduction des frais de fonctionnement grâce à notre modèle 100% digital.',
            },
            {
              icon: Heart,
              title: 'Honoraires adaptés',
              description: 'Des honoraires justes et transparents, adaptés à votre projet de vente.',
            },
            {
              icon: GraduationCap,
              title: 'Valorisation optimale',
              description: 'Avis de valeur complet par un professionnel du marché local.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-slate-50 rounded-2xl border border-slate-100 p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A0E2]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#00A0E2]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services iad */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00A0E2]" />
          Les services iad
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Phone,
              title: 'Un seul interlocuteur',
              description: 'Un conseiller de confiance formé pour vous accompagner dans votre projet.',
            },
            {
              icon: ShieldCheck,
              title: 'Transaction sécurisée',
              description: 'Encadrement par un réseau d\'experts : juristes, notaires, diagnostiqueurs.',
            },
            {
              icon: Truck,
              title: 'Conciergerie iad',
              description: 'Aide au déménagement et à l\'installation dans votre nouveau logement.',
            },
            {
              icon: TrendingUp,
              title: 'Force commerciale unique',
              description: 'Synergie inter-conseillers : votre bien est confié à tout le réseau iad.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#00A0E2]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Satisfaction badge */}
      <div className="bg-gradient-to-r from-[#00A0E2] to-[#0077B6] rounded-3xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl font-black tracking-tight">99%</h2>
          <p className="text-sm font-bold text-white/80">de clients satisfaits</p>
          <p className="text-xs text-white/60 max-w-md mt-1">
            Et si vous en faisiez partie ? Rejoignez les milliers de vendeurs qui nous font confiance chaque année.
          </p>
        </div>
      </div>
    </div>
  );
}