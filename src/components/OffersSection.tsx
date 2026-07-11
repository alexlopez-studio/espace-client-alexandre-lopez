import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  DollarSign, 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Clock, 
  FileCheck,
  Building
} from 'lucide-react';
import { BuyerOffer } from '../types';

interface OffersSectionProps {
  offers: BuyerOffer[];
  onAddOffer: (offer: Omit<BuyerOffer, 'id'>) => void;
  onDeleteOffer: (id: string) => void;
  onUpdateOfferStatus: (id: string, status: BuyerOffer['status']) => void;
  isAdmin?: boolean;
}

export default function OffersSection({ 
  offers, 
  onAddOffer, 
  onDeleteOffer,
  onUpdateOfferStatus,
  isAdmin = false 
}: OffersSectionProps) {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>('');
  const [price, setPrice] = useState<number>(410000);
  const [date, setDate] = useState<string>('');
  const [financingType, setFinancingType] = useState<BuyerOffer['financingType']>('Emprunt Bancaire');
  const [financingDetails, setFinancingDetails] = useState<string>('');
  const [solvencyCertificate, setSolvencyCertificate] = useState<boolean>(true);
  const [comments, setComments] = useState<string>('');

  // Calculations
  const totalOffers = offers.length;
  const activeOffers = offers.filter(o => o.status === 'Reçue').length;
  const acceptedOffers = offers.filter(o => o.status === 'Acceptée').length;
  const highestOffer = totalOffers > 0 ? Math.max(...offers.map(o => o.price)) : 0;
  const averageOffer = totalOffers > 0 ? Math.round(offers.reduce((acc, o) => acc + o.price, 0) / totalOffers) : 0;
  
  const recommendedMidPrice = 410000; // Reference mid range

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerName && price && date) {
      onAddOffer({
        buyerName,
        price,
        date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        financingType,
        financingDetails: financingDetails || "Informations financières non renseignées",
        solvencyCertificate,
        status: 'Reçue',
        comments: comments || undefined
      });
      // reset
      setBuyerName('');
      setPrice(410000);
      setDate('');
      setFinancingType('Emprunt Bancaire');
      setFinancingDetails('');
      setSolvencyCertificate(true);
      setComments('');
      setShowAddForm(false);
    }
  };

  const getStatusStyle = (status: BuyerOffer['status']) => {
    switch (status) {
      case 'Acceptée':
        return 'border-emerald-200 bg-emerald-50/20 text-emerald-800';
      case 'Refusée':
        return 'border-rose-200 bg-rose-50/20 text-rose-800 line-through decoration-rose-300';
      case 'Contre-proposition':
        return 'border-amber-200 bg-amber-50/20 text-amber-800';
      case 'Reçue':
        return 'border-[#00A0E2]/20 bg-[#00A0E2]/5 text-[#00A0E2]';
    }
  };

  const getStatusBadge = (status: BuyerOffer['status']) => {
    switch (status) {
      case 'Acceptée':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 uppercase tracking-wider animate-pulse">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Offre Acceptée</span>
          </span>
        );
      case 'Refusée':
        return (
          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border border-rose-100 flex items-center gap-1 uppercase">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Offre Refusée</span>
          </span>
        );
      case 'Contre-proposition':
        return (
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border border-amber-100 flex items-center gap-1 uppercase">
            <RefreshCw className="w-3 h-3 text-amber-500" />
            <span>Contre-Proposition</span>
          </span>
        );
      case 'Reçue':
        return (
          <span className="bg-cyan-50 text-cyan-700 text-[10px] font-extrabold font-mono px-2.5 py-0.5 rounded-full border border-cyan-100 flex items-center gap-1 uppercase">
            <Clock className="w-3 h-3 text-cyan-500" />
            <span>Offre Reçue (À l'étude)</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" id="offers-section-root">
      
      {/* Metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="offers-metrics-dashboard">
        
        {/* Highest Offer Card */}
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4" id="metric-highest-offer">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Meilleure offre</span>
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-emerald-400 leading-none">{formatEuro(highestOffer || recommendedMidPrice)}</span>
            <p className="text-xs text-slate-300 mt-1">Comparé au prix recommandé de {formatEuro(recommendedMidPrice)}</p>
          </div>
        </div>

        {/* Total offers count */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4" id="metric-offers-count">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-700">
            <Award className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Offres écrites</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-800 font-mono">{totalOffers}</span>
              <span className="text-xs text-slate-500">formulées</span>
            </div>
            <div className="flex gap-3 text-[10px] text-slate-400 mt-1 font-semibold">
              <span className="text-emerald-600">● {acceptedOffers} acceptée(s)</span>
              <span className="text-cyan-600">● {activeOffers} à l'étude</span>
            </div>
          </div>
        </div>

        {/* Average offer */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4" id="metric-offers-avg">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-700">
            <Building className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Moyenne des propositions</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-slate-800 font-mono">{formatEuro(averageOffer || recommendedMidPrice)}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">
              Ratio de {totalOffers > 0 ? Math.round(((averageOffer || recommendedMidPrice) / recommendedMidPrice) * 100) : 100}% par rapport à l'estimation médiane.
            </p>
          </div>
        </div>

      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5" id="offers-list-panel">
        
        <div className="flex justify-between items-center border-b border-slate-50 pb-4" id="offers-header-row">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Registre des propositions et offres d'achat
            </h3>
            <p className="text-xs text-slate-500">Toutes les offres d'achat écrites et motivées reçues pour la vente de votre maison.</p>
          </div>

          <button
            id="btn-toggle-add-offer"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-2 px-3.5 rounded-xl text-xs shadow-md shadow-[#00A0E2]/10 transition-colors shrink-0"
          >
            {showAddForm ? 'Fermer le formulaire' : 'Enregistrer une offre'}
            {!showAddForm && <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Add Offer inline Form */}
        {showAddForm && (
          <form 
            onSubmit={handleAddSubmit}
            className="bg-slate-50 border border-slate-100 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 animate-in slide-in-from-top-4 duration-300"
            id="form-add-offer"
          >
            <div className="md:col-span-6 flex flex-col gap-1.5" id="form-offer-buyer">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Nom de l'offrant *</label>
              <input 
                id="input-offer-buyer"
                type="text" 
                required
                placeholder="ex: M. & Mme Delmas, Sophie H."
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5" id="form-offer-price">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Montant de l'offre (€) *</label>
              <input 
                id="input-offer-price"
                type="number" 
                required
                min={10000}
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all font-mono"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5" id="form-offer-date">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Date de l'offre *</label>
              <input 
                id="input-offer-date"
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              />
            </div>

            <div className="md:col-span-4 flex flex-col gap-1.5" id="form-offer-fintype">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Type de Financement *</label>
              <select 
                id="select-offer-fintype"
                value={financingType}
                onChange={(e) => setFinancingType(e.target.value as BuyerOffer['financingType'])}
                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              >
                <option value="Emprunt Bancaire">Emprunt Bancaire</option>
                <option value="Apport Personnel">Apport Personnel (Sans condition de prêt)</option>
                <option value="Mixte">Mixte (Prêt + Apport personnel)</option>
              </select>
            </div>

            <div className="md:col-span-5 flex flex-col gap-1.5" id="form-offer-findetails">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Détails du Financement / Courtier *</label>
              <input 
                id="input-offer-findetails"
                type="text" 
                required
                placeholder="ex: Apport de 100k€ + Prêt 305k€ validé par courtier CAFPI"
                value={financingDetails}
                onChange={(e) => setFinancingDetails(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5" id="form-offer-cert">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Certificat d'accord validé ? *</label>
              <div className="flex items-center gap-2 h-10" id="cert-toggle-group">
                <input 
                  id="checkbox-solvency-cert"
                  type="checkbox" 
                  checked={solvencyCertificate}
                  onChange={(e) => setSolvencyCertificate(e.target.checked)}
                  className="w-4 h-4 text-[#00A0E2] focus:ring-[#00A0E2] rounded border-slate-300"
                />
                <span className="text-xs font-bold text-slate-600">Oui, accord de principe fourni</span>
              </div>
            </div>

            <div className="md:col-span-12 flex flex-col gap-1.5" id="form-offer-comments">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Commentaires additionnels (Facultatif)</label>
              <textarea 
                id="input-offer-comments"
                rows={2}
                placeholder="Précisez d'éventuelles conditions suspensives (durée de validité de l'offre, date d'entrée souhaitée, etc.)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              />
            </div>

            <div className="md:col-span-12 flex justify-end gap-2 mt-2" id="form-offer-buttons">
              <button
                id="btn-cancel-offer-form"
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                id="btn-confirm-add-offer"
                type="submit"
                className="bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-[#00A0E2]/10"
              >
                Valider l'Offre
              </button>
            </div>
          </form>
        )}

        {/* Offers Grid List */}
        {offers.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3 text-slate-400" id="empty-offers-message">
            <DollarSign className="w-12 h-12 opacity-30 stroke-[1.5]" />
            <div>
              <p className="text-xs font-bold text-slate-600 font-mono">Aucune offre d'achat répertoriée</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Les propositions reçues s'afficheront ici au fur et à mesure.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2" id="offers-list-grid">
            {offers.map((offer) => {
              const isPending = offer.status === 'Reçue';
              
              return (
                <div 
                  key={offer.id}
                  id={`offer-card-${offer.id}`}
                  className={`bg-slate-50/50 hover:bg-slate-50 border p-5 rounded-2xl flex flex-col gap-4 justify-between transition-all ${getStatusStyle(offer.status)}`}
                >
                  <div className="flex flex-col gap-3" id={`offer-card-body-${offer.id}`}>
                    
                    {/* Header: Name & Status */}
                    <div className="flex justify-between items-start gap-2" id={`offer-card-header-${offer.id}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 border border-slate-100 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 leading-snug">{offer.buyerName}</h4>
                      </div>
                      {getStatusBadge(offer.status)}
                    </div>

                    {/* Huge Offer price */}
                    <div className="flex items-baseline gap-1" id={`offer-card-price-${offer.id}`}>
                      <span className="text-2xl font-black font-mono tracking-tight text-slate-800">
                        {formatEuro(offer.price)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">FAI (Frais d'Agence Inclus)</span>
                    </div>

                    {/* Financing block */}
                    <div className="bg-white/80 p-3 rounded-xl border border-slate-100/60 flex flex-col gap-2" id={`offer-card-financing-${offer.id}`}>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400" id={`offer-fin-header-${offer.id}`}>
                        <span className="font-mono">STRUCTURE FINANCIÈRE</span>
                        <span>{offer.financingType}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal font-semibold">
                        {offer.financingDetails}
                      </p>
                      
                      <div className="h-px bg-slate-100/60" />

                      <div className="flex items-center gap-1.5" id={`offer-fin-cert-${offer.id}`}>
                        {offer.solvencyCertificate ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-[10px] font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Accord de courtier joint</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 text-[10px] font-bold">
                            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Simulation de prêt simple</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Comment */}
                    {offer.comments && (
                      <div className="text-[11px] text-slate-600 leading-relaxed italic bg-white/40 p-2.5 rounded-xl border border-slate-100/40" id={`offer-comment-${offer.id}`}>
                        <strong>Note :</strong> "{offer.comments}"
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono font-bold leading-none block">
                      Offre reçue le {offer.date}
                    </span>

                  </div>

                  {/* Actions footer (Allow modifying and deleting) */}
                  <div className="flex items-center justify-between border-t border-slate-100/80 pt-3.5 mt-2" id={`offer-actions-${offer.id}`}>
                    
                    {/* Accept / Decline triggers (Advisor/Seller panel) */}
                    {isPending ? (
                      <div className="flex gap-1.5" id={`offer-btn-group-decisions-${offer.id}`}>
                        <button
                          id={`btn-accept-offer-${offer.id}`}
                          onClick={() => onUpdateOfferStatus(offer.id, 'Acceptée')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors"
                        >
                          Accepter
                        </button>
                        <button
                          id={`btn-decline-offer-${offer.id}`}
                          onClick={() => onUpdateOfferStatus(offer.id, 'Refusée')}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors"
                        >
                          Refuser
                        </button>
                        <button
                          id={`btn-counter-offer-${offer.id}`}
                          onClick={() => onUpdateOfferStatus(offer.id, 'Contre-proposition')}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors"
                        >
                          Contre-proposer
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-reopen-offer-${offer.id}`}
                        onClick={() => onUpdateOfferStatus(offer.id, 'Reçue')}
                        className="text-[10px] text-[#00A0E2] font-bold hover:underline"
                      >
                        Remettre à l'étude (Réinitialiser)
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      id={`btn-delete-offer-${offer.id}`}
                      onClick={() => onDeleteOffer(offer.id)}
                      className="p-2 border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-white rounded-xl shadow-sm transition-all"
                      title="Supprimer l'offre"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
