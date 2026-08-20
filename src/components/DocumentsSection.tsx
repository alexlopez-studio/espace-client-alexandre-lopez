import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileCheck,
  ArrowRight,
  Sparkles,
  FileUp,
  X,
  ShieldCheck,
  CheckCircle2,
  LayoutGrid,
  List
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentsSectionProps {
  documents: DocumentItem[];
  onAddDocument: (doc: Omit<DocumentItem, 'id' | 'dateAdded'>) => void;
  onDeleteDocument?: (id: string) => void;
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
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Grouped dossier documents strictly from Mandat OS
  const requestedMissingDocs = documents.filter((d) => d.status === 'Manquant');
  const otherDossierDocs = documents.filter((d) => d.status !== 'Manquant');

  const defaultInitialDoc = requestedMissingDocs[0]?.name || documents[0]?.name || 'Autre document complémentaire';

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocLabel, setSelectedDocLabel] = useState<string>(defaultInitialDoc);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalDocs = documents.length;
  const validatedDocs = documents.filter(d => d.status === 'Valide').length;
  const pendingDocs = documents.filter(d => d.status === 'À valider').length;
  const missingDocsCount = requestedMissingDocs.length;
  const progressPercent = totalDocs > 0 ? Math.round((validatedDocs / totalDocs) * 100) : 0;

  const categories = ['All', 'Diagnostic', 'Urbanisme', 'Titre de Propriété', 'Taxes', 'Copropriété', 'Autre'];

  const filteredDocs = filter === 'All'
    ? documents
    : documents.filter(d => d.category === filter);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Ko';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Find category for a given document label from the dossier
  const getCategoryForLabel = (label: string): DocumentItem['category'] => {
    const existingDoc = documents.find((d) => d.name.trim().toLowerCase() === label.trim().toLowerCase());
    if (existingDoc) return existingDoc.category;
    return 'Autre';
  };

  // Intelligent selection when a file is dropped/picked
  const handleStageFile = (file: File, initialLabel?: string) => {
    setSelectedFile(file);
    if (initialLabel) {
      setSelectedDocLabel(initialLabel);
    } else {
      const lower = file.name.toLowerCase();
      // Try to match with an existing document from the dossier first
      const matched = documents.find((d) => {
        const dLower = d.name.toLowerCase();
        return lower.includes(dLower) || dLower.includes(lower.replace(/\.[^/.]+$/, ''));
      });

      if (matched) {
        setSelectedDocLabel(matched.name);
      } else if (requestedMissingDocs.length > 0) {
        setSelectedDocLabel(requestedMissingDocs[0].name);
      } else {
        setSelectedDocLabel(defaultInitialDoc);
      }
    }
    setShowUploadModal(true);
  };

  // Execute upload process
  const executeUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const docName = selectedDocLabel;
    const category = getCategoryForLabel(docName);

    let fileUrl = '#';
    let sizeStr = `${(Math.random() * 3 + 1).toFixed(1)} Mo`;

    if (selectedFile) {
      try {
        fileUrl = URL.createObjectURL(selectedFile);
        sizeStr = formatFileSize(selectedFile.size);
      } catch {
        fileUrl = '#';
      }
    }

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onAddDocument({
              name: docName,
              category: category,
              size: sizeStr,
              status: 'À valider',
              uploadedBy: isAdmin ? 'Conseiller' : 'Vendeur',
              fileUrl: fileUrl
            });
            setIsUploading(false);
            setShowUploadModal(false);
            setSelectedFile(null);
            setSuccessToast(`Le document « ${docName} » a été transmis à votre conseiller.`);
            setTimeout(() => setSuccessToast(null), 5000);
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 60);
  };

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (readOnly) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      handleStageFile(droppedFile);
    }
  };

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleStageFile(file);
      e.target.value = '';
    }
  };

  const handleModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeUpload();
  };

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'Valide':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Validé</span>
          </span>
        );
      case 'À valider':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
            <Clock className="w-3 h-3 text-amber-500 animate-spin" />
            <span>À valider par le conseiller</span>
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

      {/* Success Notification Toast */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold">{successToast}</p>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 font-bold text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dossier-stats-cards">

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4" id="stat-card-progress">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#00A0E2]/10 border border-[#00A0E2]/20 rounded-2xl text-[#00A0E2]">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-[#00A0E2]">{progressPercent}%</span>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Complétude du dossier</h4>
            <p className="text-xs text-slate-300 mt-1">{validatedDocs} document(s) validé(s) sur {totalDocs - missingDocsCount} fournis.</p>
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Constitution dossier</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-800">{totalDocs}</span>
              <span className="text-xs text-slate-500">pièces référencées</span>
            </div>
            <div className="flex gap-3 text-[10px] text-slate-400 mt-1 font-semibold">
              <span className="text-emerald-600 flex items-center gap-0.5">● {validatedDocs} valides</span>
              <span className="text-amber-600 flex items-center gap-0.5">● {pendingDocs} attente</span>
              <span className="text-rose-600 flex items-center gap-0.5">● {missingDocsCount} requis</span>
            </div>
          </div>
        </div>

        {/* Client upload action card */}
        <div className="bg-gradient-to-br from-[#00A0E2]/5 via-white to-slate-50 border border-[#00A0E2]/20 p-6 rounded-3xl flex flex-col justify-between gap-3 shadow-xs" id="stat-card-instructions">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#00A0E2]/10 text-[#0077B6] text-[10px] font-extrabold uppercase">
                <Sparkles className="w-3 h-3" />
                Espace Vendeur
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 tracking-tight mt-2">Transmettez vos pièces justificatives</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
              Sélectionnez le document demandé par votre conseiller et déposez votre fichier.
            </p>
          </div>
          {!readOnly && (
            <button
              id="btn-open-upload-modal"
              onClick={() => {
                setSelectedFile(null);
                setSelectedDocLabel(defaultInitialDoc);
                setShowUploadModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#00A0E2] hover:bg-[#008cc7] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-[#00A0E2]/20 transition-all cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span>Transmettre un document</span>
            </button>
          )}
        </div>

      </div>

      {/* Drag & Drop Quick Zone */}
      {!readOnly && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? 'border-[#00A0E2] bg-[#00A0E2]/10 scale-[0.99] shadow-inner'
              : 'border-slate-200 bg-white hover:border-[#00A0E2]/60 hover:bg-slate-50/60 shadow-xs'
          }`}
          id="global-drag-drop-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleNativeFileChange}
            className="hidden"
            id="hidden-global-file-input"
          />
          <div className="w-12 h-12 rounded-2xl bg-[#00A0E2]/10 text-[#00A0E2] flex items-center justify-center shadow-xs">
            <Upload className={`w-6 h-6 ${dragActive ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {dragActive ? "Relâchez le fichier pour le déposer" : "Glissez-déposez un document ici ou cliquez pour parcourir"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PDF, JPG, PNG, Word jusqu'à 20 Mo • Chiffrement sécurisé
            </p>
          </div>
        </div>
      )}

      {/* Main Filter & List Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5" id="documents-hub-card">

        {/* Actions header and Tab filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-50 pb-4" id="documents-list-header">

          {/* Category Tabs / Menubar - Extended Full Width */}
          <div className="w-full flex-1 flex flex-wrap md:flex-nowrap gap-1 bg-white border border-slate-200/80 p-1.5 rounded-2xl shadow-xs" id="doc-filters-tabs">
            {categories.map((cat) => {
              const count = cat === 'All' ? documents.length : documents.filter(d => d.category === cat).length;
              return (
                <button
                  key={cat}
                  id={`btn-filter-doc-${cat}`}
                  onClick={() => setFilter(cat)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    filter === cat
                      ? 'bg-[#00A0E2] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{cat === 'All' ? 'Tous' : cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Switcher (Cards / List) */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-2xl shadow-xs shrink-0 self-end sm:self-auto" id="view-mode-toggle">
            <button
              id="btn-view-cards"
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                viewMode === 'cards'
                  ? 'bg-[#00A0E2] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Vue Cartes (Grille)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Cartes</span>
            </button>
            <button
              id="btn-view-list"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                viewMode === 'list'
                  ? 'bg-[#00A0E2] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Vue Liste (Tableau)"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Liste</span>
            </button>
          </div>

        </div>

        {/* Documents Table / Grid view */}
        {filteredDocs.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3 text-slate-400" id="empty-docs-message">
            <FileText className="w-12 h-12 opacity-30 stroke-[1.5]" />
            <div>
              <p className="text-xs font-bold text-slate-600">Aucun document dans cette catégorie</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Vous pouvez ajouter des pièces justificatives via le bouton ci-dessus.
              </p>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          /* Vue Liste (Tableau compact et épuré) */
          <div className="flex flex-col divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white" id="documents-items-list">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-5">Document</div>
              <div className="col-span-2">Catégorie</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2">Date & Auteur</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                id={`doc-row-${doc.id}`}
                className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-colors items-start md:items-center"
              >
                {/* Document Name & Icon */}
                <div className="md:col-span-5 flex items-center gap-3 min-w-0 w-full">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/60">
                    <FileText className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 truncate" title={doc.name}>
                      {doc.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5 md:hidden">
                      {doc.size && doc.size !== '0 KB' && doc.size !== '0 Ko' && (
                        <span className="text-[10px] text-slate-400 font-medium">{doc.size} • </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium">{doc.category}</span>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="hidden md:block md:col-span-2 text-xs font-semibold text-slate-600 truncate">
                  {doc.category}
                </div>

                {/* Status Badge */}
                <div className="md:col-span-2 flex items-center">
                  {getStatusBadge(doc.status)}
                </div>

                {/* Date & Uploader */}
                <div className="hidden md:flex md:col-span-2 flex-col text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">{doc.dateAdded || '—'}</span>
                  <span className="text-[10px] text-slate-400">
                    {doc.uploadedBy === 'Vendeur' ? 'Par vous' : 'Par le conseiller'} {doc.size && doc.size !== '0 KB' && doc.size !== '0 Ko' ? `• ${doc.size}` : ''}
                  </span>
                </div>

                {/* Action Button */}
                <div className="md:col-span-1 flex items-center justify-end w-full md:w-auto gap-2">
                  {doc.status === 'Manquant' && !readOnly ? (
                    <button
                      id={`btn-transmit-missing-list-${doc.id}`}
                      onClick={() => {
                        setSelectedDocLabel(doc.name);
                        setSelectedFile(null);
                        setShowUploadModal(true);
                      }}
                      className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Déposer</span>
                    </button>
                  ) : (
                    doc.status !== 'Manquant' && (
                      <a
                        id={`btn-download-doc-list-${doc.id}`}
                        href={doc.fileUrl || "#"}
                        download={doc.name}
                        onClick={(e) => {
                          if (!doc.fileUrl || doc.fileUrl === '#') {
                            e.preventDefault();
                            alert(`Téléchargement de « ${doc.name} »`);
                          }
                        }}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg border border-slate-200/60 shadow-2xs transition-colors cursor-pointer"
                        title="Télécharger le document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Vue Cartes (Grille responsive) */
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
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">
                      {doc.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2" title={doc.name}>
                      {doc.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {getStatusBadge(doc.status)}
                      {doc.size && doc.size !== '0 KB' && doc.size !== '0 Ko' && (
                        <span className="text-[9px] font-semibold text-slate-400">{doc.size}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Call to action if missing document */}
                {doc.status === 'Manquant' && !readOnly && (
                  <button
                    id={`btn-transmit-missing-${doc.id}`}
                    onClick={() => {
                      setSelectedDocLabel(doc.name);
                      setSelectedFile(null);
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Déposer cette pièce</span>
                  </button>
                )}

                <div className="flex items-center justify-between border-t border-slate-100/60 pt-3 mt-1.5" id={`doc-item-actions-${doc.id}`}>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {doc.uploadedBy === 'Vendeur' ? 'Ajouté par vous' : 'Ajouté par le conseiller'}
                    {doc.dateAdded && ` • ${doc.dateAdded}`}
                  </span>

                  <div className="flex gap-1.5 shrink-0" id={`doc-item-buttons-${doc.id}`}>
                    {doc.status !== 'Manquant' && (
                      <a
                        id={`btn-download-doc-${doc.id}`}
                        href={doc.fileUrl || "#"}
                        download={doc.name}
                        onClick={(e) => {
                          if (!doc.fileUrl || doc.fileUrl === '#') {
                            e.preventDefault();
                            alert(`Téléchargement de « ${doc.name} »`);
                          }
                        }}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg border border-slate-100 shadow-sm transition-colors cursor-pointer"
                        title="Télécharger le document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Guided Upload Modal */}
      {!readOnly && showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="upload-modal-container">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg border border-slate-100 shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200" id="upload-modal-box">

            <div className="flex justify-between items-start" id="upload-modal-header">
              <div>
                <span className="text-[10px] font-bold text-[#00A0E2] uppercase tracking-wider">Espace Vendeur</span>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Transmettre un document</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choisissez le type de pièce et déposez votre fichier.</p>
              </div>
              <button
                id="btn-close-upload-modal"
                onClick={() => {
                  if (!isUploading) {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isUploading ? (
              <div className="flex flex-col items-center gap-4 py-8" id="upload-modal-loading">
                <div className="relative w-16 h-16" id="upload-circular-progress">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#00A0E2"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - uploadProgress / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800">
                    {uploadProgress}%
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">Transmission sécurisée du document...</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Envoi vers le dossier client et notification du conseiller.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4" id="upload-modal-form">

                {/* 1. Dropdown for selecting document */}
                <div className="flex flex-col gap-1.5" id="upload-form-select-doc">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Pièce demandée pour votre dossier *
                  </label>
                  <select
                    id="select-doc-preset"
                    value={selectedDocLabel}
                    onChange={(e) => setSelectedDocLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00A0E2] focus:bg-white transition-all cursor-pointer"
                  >
                    {requestedMissingDocs.length > 0 && (
                      <optgroup label="📋 Pièces demandées par votre conseiller">
                        {requestedMissingDocs.map((doc) => (
                          <option key={`missing-${doc.id}`} value={doc.name}>
                            ⚠️ {doc.name} (Requis)
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {otherDossierDocs.length > 0 && (
                      <optgroup label="📄 Autres pièces du dossier">
                        {otherDossierDocs.map((doc) => (
                          <option key={`existing-${doc.id}`} value={doc.name}>
                            {doc.name} ({doc.status === 'Valide' ? 'Validé' : 'À valider'})
                          </option>
                        ))}
                      </optgroup>
                    )}

                    <optgroup label="➕ Pièce complémentaire">
                      <option value="Autre document complémentaire">
                        Autre document complémentaire
                      </option>
                    </optgroup>
                  </select>
                </div>

                {/* 2. File picker selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Fichier joint (PDF, Image ou Document)
                  </label>
                  <div
                    id="modal-select-zone"
                    onClick={() => modalFileInputRef.current?.click()}
                    className={`bg-slate-50 border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
                      selectedFile ? 'border-[#00A0E2] bg-[#00A0E2]/5' : 'border-slate-200 hover:border-[#00A0E2]'
                    }`}
                  >
                    <input
                      id="input-file-modal-native"
                      type="file"
                      ref={modalFileInputRef}
                      onChange={handleModalFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    {selectedFile ? (
                      <div className="flex items-center gap-3 w-full p-2 bg-white rounded-xl border border-[#00A0E2]/30 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#00A0E2]/10 text-[#00A0E2] flex items-center justify-center shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#00A0E2] px-2 py-1 bg-[#00A0E2]/10 rounded-md">
                          Changer
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-700">Sélectionner votre fichier</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG, DOCX jusqu'à 20 Mo</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Votre document sera vérifié par votre conseiller avant validation définitive.</span>
                </div>

                <button
                  id="btn-confirm-upload"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#00A0E2] hover:bg-[#008cc7] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#00A0E2]/20 mt-1 transition-all cursor-pointer"
                >
                  <span>Confirmer la transmission</span>
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

