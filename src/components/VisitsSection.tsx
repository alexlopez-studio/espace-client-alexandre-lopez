import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck, 
  Plus, 
  ChevronRight, 
  Trash2,
  ThumbsUp,
  Award
} from 'lucide-react';
import { ViewingReport } from '../types';

interface VisitsSectionProps {
  viewings: ViewingReport[];
  onAddViewing: (viewing: Omit<ViewingReport, 'id'>) => void;
  onDeleteViewing: (id: string) => void;
  isAdmin?: boolean;
  readOnly?: boolean;
}

export default function VisitsSection({ 
  viewings, 
  onAddViewing, 
  onDeleteViewing,
  isAdmin = false,
  readOnly = false,
}: VisitsSectionProps) {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [solvencyStatus, setSolvencyStatus] = useState<ViewingReport['solvencyStatus']>('Validée');
  const [interestLevel, setInterestLevel] = useState<ViewingReport['interestLevel']>('Élevé');
  const [comment, setComment] = useState<string>('');

  // Calculations
  const totalVisits = viewings.length;
  const averageRating = totalVisits > 0 
    ? (viewings.reduce((acc, curr) => acc + curr.rating, 0) / totalVisits).toFixed(1)
    : '0';
  const offersFormed = viewings.filter(v => v.interestLevel === 'Offre formulée').length;
  const validatedSolvency = viewings.filter(v => v.solvencyStatus === 'Validée').length;
  const solvencyRate = totalVisits > 0 ? Math.round((validatedSolvency / totalVisits) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerName && date && comment) {
      onAddViewing({
        buyerName,
        date: new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        rating,
        solvencyStatus,
        interestLevel,
        comment
      });
      // Reset form
      setBuyerName('');
      setDate('');
      setRating(5);
      setSolvencyStatus('Validée');
      setInterestLevel('Élevé');
      setComment('');
      setShowAddForm(false);
    }
  };

  const getInterestBadge = (level: ViewingReport['interestLevel']) => {
    switch (level) {
      case 'Offre formulée':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black font-mono px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider animate-bounce">
            Offre formulée
          </span>
        );
      case 'Élevé':
        return (
          <span className="bg-[#00A0E2]/10 text-[#00A0E2] text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-[#00A0E2]/20 uppercase">
            Intérêt élevé
          </span>
        );
      case 'Moyen':
        return (
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-amber-100 uppercase">
            Intérêt moyen
          </span>
        );
      case 'Faible':
        return (
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-slate-200 uppercase">
            Désisté
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" id="visits-section-root">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="viewings-metrics-grid">
        
        {/* Total Visits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4" id="metric-total-visits">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Visites totales</span>
            <span className="text-xl font-black font-mono text-slate-800 leading-none mt-1 inline-block">{totalVisits}</span>
          </div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4" id="metric-avg-rating">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-500">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Note moyenne</span>
            <span className="text-xl font-black font-mono text-slate-800 leading-none mt-1 inline-block">{averageRating} / 5</span>
          </div>
        </div>

        {/* Solvency Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4" id="metric-solvency-rate">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Solvabilité vérifiée</span>
            <span className="text-xl font-black font-mono text-slate-800 leading-none mt-1 inline-block">{solvencyRate}%</span>
          </div>
        </div>

        {/* Offers received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4" id="metric-offers-received">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 text-violet-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Offre(s) formulée(s)</span>
            <span className="text-xl font-black font-mono text-slate-800 leading-none mt-1 inline-block">{offersFormed}</span>
          </div>
        </div>

      </div>

      {/* Main Journal & Add log Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5" id="viewings-journal-card">
        
        <div className="flex justify-between items-center border-b border-slate-50 pb-4" id="journal-header">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00A0E2]" />
              Journal de suivi d'activité et visites
            </h3>
            <p className="text-xs text-slate-500">Consultez en temps réel les comptes rendus détaillés et retours d'acheteurs.</p>
          </div>

          {!readOnly && (
            <button
              id="btn-toggle-add-viewing"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-2 px-3.5 rounded-xl text-xs shadow-md shadow-[#00A0E2]/10 transition-colors shrink-0"
            >
              {showAddForm ? 'Fermer le formulaire' : 'Enregistrer une visite'}
              {!showAddForm && <Plus className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Add viewing inline Form */}
        {!readOnly && showAddForm && (
          <form 
            onSubmit={handleSubmit}
            className="bg-slate-50 border border-slate-100 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 animate-in slide-in-from-top-4 duration-300"
            id="form-add-viewing"
          >
            <div className="md:col-span-6 flex flex-col gap-1.5" id="form-viewing-buyer">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Nom de l'acquéreur *</label>
              <input 
                id="input-viewing-buyer"
                type="text" 
                required
                placeholder="ex: M. & Mme Dupont, Alexandre L."
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5" id="form-viewing-date">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Date de visite *</label>
              <input 
                id="input-viewing-date"
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5" id="form-viewing-stars">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Note d'intérêt (1-5) *</label>
              <div className="flex items-center gap-1.5 h-10" id="stars-selector">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    id={`btn-star-select-${s}`}
                    type="button"
                    onClick={() => setRating(s)}
                    className="text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${s <= rating ? 'fill-current' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col gap-1.5" id="form-viewing-solv">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Validation financière *</label>
              <select 
                id="select-viewing-solv"
                value={solvencyStatus}
                onChange={(e) => setSolvencyStatus(e.target.value as ViewingReport['solvencyStatus'])}
                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              >
                <option value="Validée">Validée (Simulation de banque ok ou attestation courtier)</option>
                <option value="En cours">En cours de vérification / validation</option>
                <option value="Non validée">Non validée (Dossier d'emprunt fragile)</option>
              </select>
            </div>

            <div className="md:col-span-6 flex flex-col gap-1.5" id="form-viewing-interest">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Retour d'intérêt *</label>
              <select 
                id="select-viewing-interest"
                value={interestLevel}
                onChange={(e) => setInterestLevel(e.target.value as ViewingReport['interestLevel'])}
                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              >
                <option value="Élevé">Intérêt élevé (Enclin à faire une offre)</option>
                <option value="Offre formulée">Offre formulée d'achat écrite</option>
                <option value="Moyen">Intérêt moyen (Doit y réfléchir, contre-visite)</option>
                <option value="Faible">Désisté (Pas intéressé / pas adapté)</option>
              </select>
            </div>

            <div className="md:col-span-12 flex flex-col gap-1.5" id="form-viewing-comment">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Compte rendu détaillé (Retour acheteur) *</label>
              <textarea 
                id="input-viewing-comment"
                required
                rows={3}
                placeholder="Rédigez les commentaires de l'acheteur, points forts appréciés, points de réserve..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] transition-all"
              />
            </div>

            <div className="md:col-span-12 flex justify-end gap-2 mt-2" id="form-viewing-buttons">
              <button
                id="btn-cancel-viewing-form"
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                id="btn-confirm-add-viewing"
                type="submit"
                className="bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-[#00A0E2]/10"
              >
                Enregistrer le compte rendu
              </button>
            </div>
          </form>
        )}

        {/* Viewings List (Chronological) */}
        {viewings.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3 text-slate-400" id="empty-viewings-message">
            <Users className="w-12 h-12 opacity-30 stroke-[1.5]" />
            <div>
              <p className="text-xs font-bold text-slate-600 font-mono">Aucun compte rendu de visite enregistré</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Les comptes rendus partagés par votre conseiller apparaîtront ici.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2" id="viewings-list-container">
            {viewings.map((view) => (
              <div 
                key={view.id}
                id={`viewing-card-${view.id}`}
                className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-start justify-between gap-4 transition-all"
              >
                <div className="flex-1 flex flex-col gap-3" id={`viewing-card-body-${view.id}`}>
                  
                  {/* Top line with name & badges */}
                  <div className="flex flex-wrap items-center gap-3" id={`viewing-card-top-${view.id}`}>
                    <h4 className="text-sm font-extrabold text-slate-800">{view.buyerName}</h4>
                    <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:inline" />
                    
                    {/* Stars render */}
                    <div className="flex gap-0.5 text-amber-500" id={`viewing-card-stars-${view.id}`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < view.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>

                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-1.5" id={`viewing-card-badges-${view.id}`}>
                      {getInterestBadge(view.interestLevel)}
                      
                      {/* Solvency badge */}
                      {view.solvencyStatus === 'Validée' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>Solvabilité validée</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5 text-amber-500" />
                          <span>Validation en cours</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback text */}
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold pr-2">
                    "{view.comment}"
                  </p>

                  {/* Date footer */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold" id={`viewing-card-footer-${view.id}`}>
                    <Calendar className="w-3 h-3 text-slate-300" />
                    <span>Visite effectuée le {view.date}</span>
                  </div>

                </div>

                {!readOnly && (
                  <button
                    id={`btn-delete-viewing-${view.id}`}
                    onClick={() => onDeleteViewing(view.id)}
                    className="p-2 border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 bg-white rounded-xl shadow-sm self-end lg:self-start transition-all"
                    title="Supprimer la visite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
