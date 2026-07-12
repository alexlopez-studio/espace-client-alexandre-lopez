import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileCheck,
  Plus,
  Filter,
  ArrowRight
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentsSectionProps {
  documents: DocumentItem[];
  onAddDocument: (doc: Omit<DocumentItem, 'id' | 'dateAdded'>) => void;
  onDeleteDocument: (id: string) => void;
  onUpdateDocumentStatus?: (id: string, status: DocumentItem['status']) => void;
  isAdmin?: boolean;
  readOnly?: boolean;
}

export default function DocumentsSection({
  documents,
  onAddDocument,
  onDeleteDocument,
  onUpdateDocumentStatus,
  isAdmin = false,
  readOnly = false,
}: DocumentsSectionProps) {
  const [filter, setFilter] = useState<string>('All');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Local form for custom document upload
  const [customDocName, setCustomDocName] = useState<string>('');
  const [customDocCategory, setCustomDocCategory] = useState<DocumentItem['category']>('Diagnostic');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalDocs = documents.length;
  const validatedDocs = documents.filter(d => d.status === 'Valide').length;
  const pendingDocs = documents.filter(d => d.status === 'À valider').length;
  const missingDocs = documents.filter(d => d.status === 'Manquant').length;
  const progressPercent = totalDocs > 0 ? Math.round((validatedDocs / totalDocs) * 100) : 0;

  const categories = ['All', 'Diagnostic', 'Urbanisme', 'Titre de Propriété', 'Taxes', 'Copropriété', 'Autre'];

  const filteredDocs = filter === 'All'
    ? documents
    : documents.filter(d => d.category === filter);

  // File drag-and-drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (readOnly) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUpload = (fileName: string, category: DocumentItem['category']) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onAddDocument({
              name: fileName || "Nouveau Document",
              category: category,
              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
              status: 'À valider',
              uploadedBy: isAdmin ? 'Conseiller' : 'Vendeur',
              fileUrl: '#'
            });
            setIsUploading(false);
            setShowUploadModal(false);
            setCustomDocName('');
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      simulateUpload(droppedFile.name, 'Autre');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      simulateUpload(selectedFile.name, customDocCategory);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDocName) {
      simulateUpload(customDocName, customDocCategory);
    }
  };

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'Valide':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Conforme</span>
          </span>
        );
      case 'À valider':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
            <Clock className="w-3 h-3 text-amber-500 animate-spin" />
            <span>À valider</span>
          </span>
        );
      case 'Manquant':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-100 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            <span>Requis / Manquant</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" id="documents-section-root">

      {/* Header Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dossier-stats-cards">

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4" id="stat-card-progress">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#00A0E2]/10 border border-[#00A0E2]/20 rounded-2xl text-[#00A0E2]">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black font-mono text-[#00A0E2]">{progressPercent}%</span>
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider">Complétude du dossier</h4>
            <p className="text-xs text-slate-300 mt-1">{validatedDocs} document(s) validé(s) sur {totalDocs - missingDocs} fournis.</p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00A0E2] to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Counter cards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4" id="stat-card-counters">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-700">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Constitution dossier</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-800 font-mono">{totalDocs}</span>
              <span className="text-xs text-slate-500">fiches référencées</span>
            </div>
            <div className="flex gap-3 text-[10px] text-slate-400 mt-1 font-semibold">
              <span className="text-emerald-600 flex items-center gap-0.5">● {validatedDocs} valides</span>
              <span className="text-amber-600 flex items-center gap-0.5">● {pendingDocs} attente</span>
              <span className="text-rose-600 flex items-center gap-0.5">● {missingDocs} requis</span>
            </div>
          </div>
        </div>

        {/* Quick info / Guide box */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl flex flex-col justify-between" id="stat-card-instructions">
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 tracking-tight">Dossier technique immobilier</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
              Pour conclure la vente, la constitution de ce dossier est légalement obligatoire (Loi ALUR). Les pièces disponibles sont centralisées ici et mises à jour par votre conseiller.
            </p>
          </div>
          {!readOnly && (
            <button
              id="btn-open-upload-modal"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#00A0E2] hover:underline mt-2 self-start"
            >
              <span>Ajouter un document</span>
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Main Filter & List Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5" id="documents-hub-card">

        {/* Actions header and Tab filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-4" id="documents-list-header">

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl" id="doc-filters-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`btn-filter-doc-${cat}`}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  filter === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'Tous' : cat}
              </button>
            ))}
          </div>

          {/* Upload buttons */}
          {!readOnly && (
          <div className="flex gap-2" id="docs-upload-group">
            <button
              id="btn-trigger-upload-modal"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-[#00A0E2]/10 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Transmettre un fichier</span>
            </button>
          </div>
          )}

        </div>

        {/* Drag and drop active area overlay */}
        <div
          onDragEnter={readOnly ? undefined : handleDrag}
          onDragOver={readOnly ? undefined : handleDrag}
          onDragLeave={readOnly ? undefined : handleDrag}
          onDrop={readOnly ? undefined : handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-300 ${
            dragActive
              ? 'border-[#00A0E2] bg-[#00A0E2]/5 scale-[0.99]'
              : 'border-transparent bg-transparent'
          }`}
          id="drag-drop-container"
        >
          {dragActive && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10 pointer-events-none rounded-2xl">
              <Upload className="w-10 h-10 text-[#00A0E2] animate-bounce" />
              <span className="text-xs font-bold text-slate-800">Déposez votre fichier pour l'ajouter au dossier</span>
            </div>
          )}

          {/* Documents Table / Grid view */}
          {filteredDocs.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-3 text-slate-400" id="empty-docs-message">
              <FileText className="w-12 h-12 opacity-30 stroke-[1.5]" />
              <div>
                <p className="text-xs font-bold text-slate-600">Aucun document dans cette catégorie</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Les documents partagés par votre conseiller apparaîtront ici.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="documents-items-grid">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  id={`doc-item-card-${doc.id}`}
                  className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 p-4.5 rounded-2xl flex flex-col gap-4 justify-between transition-all group"
                >
                  <div className="flex gap-3 items-start" id={`doc-item-top-${doc.id}`}>
                    <div className="p-2.5 bg-white text-slate-600 rounded-xl border border-slate-100 shadow-sm shrink-0">
                      <FileText className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">
                        {doc.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2" title={doc.name}>
                        {doc.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {getStatusBadge(doc.status)}
                        {doc.size && doc.size !== '0 KB' && (
                          <span className="text-[9px] font-mono font-semibold text-slate-400">{doc.size}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100/60 pt-3 mt-1.5" id={`doc-item-actions-${doc.id}`}>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {doc.uploadedBy === 'Vendeur' ? 'Ajouté par le vendeur' : 'Ajouté par le conseiller'}
                      {doc.dateAdded && ` • ${doc.dateAdded}`}
                    </span>

                    <div className="flex gap-1.5 shrink-0" id={`doc-item-buttons-${doc.id}`}>
                      {doc.status !== 'Manquant' && (
                        <a
                          id={`btn-download-doc-${doc.id}`}
                          href={doc.fileUrl || "#"}
                          download
                          onClick={(e) => doc.fileUrl === '#' && e.preventDefault()}
                          className="p-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg border border-slate-100 shadow-sm transition-colors"
                          title="Télécharger le document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {!readOnly && (
                        <button
                          id={`btn-delete-doc-${doc.id}`}
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-100 shadow-sm transition-colors"
                          title="Supprimer du dossier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Custom Upload Modal */}
      {!readOnly && showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="upload-modal-container">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200" id="upload-modal-box">

            <div className="flex justify-between items-start" id="upload-modal-header">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Transmettre un document</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Complétez le dossier technique de vente en toute sécurité.</p>
              </div>
              <button
                id="btn-close-upload-modal"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {isUploading ? (
              <div className="flex flex-col items-center gap-4 py-8" id="upload-modal-loading">
                <div className="relative w-16 h-16" id="upload-circular-progress">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                    <circle cx="32" cy="32" r="28" stroke="#00A0E2" strokeWidth="4" fill="transparent"
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={2 * Math.PI * 28 * (1 - uploadProgress / 100)} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800 font-mono">
                    {uploadProgress}%
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">Traitement sécurisé du fichier...</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Vérification de conformité et chiffrement iad.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4" id="upload-modal-form">

                <div className="flex flex-col gap-1.5" id="upload-form-name">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Nom du document *</label>
                  <input
                    id="input-doc-name"
                    type="text"
                    required
                    placeholder="ex: Carnet d'entretien de chaudière, PV d'AG"
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5" id="upload-form-cat">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Catégorie réglementaire *</label>
                  <select
                    id="select-doc-cat"
                    value={customDocCategory}
                    onChange={(e) => setCustomDocCategory(e.target.value as DocumentItem['category'])}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all"
                  >
                    <option value="Diagnostic">Diagnostic obligatoire (DPE, Amiante, etc.)</option>
                    <option value="Urbanisme">Urbanisme (PLU, Cadastre, etc.)</option>
                    <option value="Titre de Propriété">Titre de Propriété</option>
                    <option value="Taxes">Taxes et charges (Foncière, etc.)</option>
                    <option value="Copropriété">Copropriété (Règlement, PV)</option>
                    <option value="Autre">Autre justificatif</option>
                  </select>
                </div>

                {/* Simulated file selector zone */}
                <div
                  id="modal-select-zone"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-50 border border-dashed border-slate-200 hover:border-[#00A0E2] rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5"
                >
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#00A0E2]" />
                  <span className="text-xs font-bold text-slate-600">Parcourir les fichiers</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG jusqu'à 20MB</span>
                  <input
                    id="input-file-native"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                <button
                  id="btn-confirm-upload"
                  type="submit"
                  disabled={!customDocName}
                  className="w-full flex items-center justify-center gap-2 bg-[#00A0E2] hover:bg-[#008cc7] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#00A0E2]/10 mt-2 transition-all"
                >
                  <span>Valider et Enregistrer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
