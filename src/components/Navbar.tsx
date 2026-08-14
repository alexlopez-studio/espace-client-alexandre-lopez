import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Handshake, 
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';
import IadLogo from './IadLogo';
import { AdvisorInfo } from '../types';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  advisor: AdvisorInfo;
  lastEvalSection?: string;
  lastTransSection?: string;
}

export default function Navbar({ 
  activeSection, 
  setActiveSection, 
  advisor,
  lastEvalSection = 'situation',
  lastTransSection = 'documents',
}: NavbarProps) {
  
  const isEvaluationActive = ['estimationEmpty', 'situation', 'property', 'market', 'competition', 'comparables', 'conclusion', 'iad'].includes(activeSection);
  const isTransactionActive = ['transactionTeaser', 'documents', 'viewings', 'salesPlan', 'offers', 'stats'].includes(activeSection);

  const mainCategories = [
    { 
      id: 'cover', 
      label: 'Accueil', 
      badge: 'Vue générale',
      icon: Home,
      isActive: activeSection === 'cover',
      onClick: () => setActiveSection('cover')
    },
    { 
      id: 'evaluation', 
      label: 'Estimation', 
      badge: 'Avis de valeur',
      icon: TrendingUp,
      isActive: isEvaluationActive,
      onClick: () => setActiveSection(lastEvalSection)
    },
    { 
      id: 'transaction', 
      label: 'Suivi de Vente', 
      badge: 'Fil du mandat',
      icon: Handshake,
      isActive: isTransactionActive,
      onClick: () => setActiveSection(lastTransSection)
    }
  ];

  return (
    <aside 
      className="hidden lg:flex flex-col w-72 bg-slate-950 text-slate-100 h-screen fixed left-0 top-0 border-r border-slate-800/80 z-30 select-none" 
      id="desktop-sidebar"
    >
      {/* Sidebar Header with iad Logo & Subtitle */}
      <div className="px-6 py-5 border-b border-slate-800/80 flex flex-col items-center justify-center bg-slate-900/40" id="sidebar-logo-container">
        <IadLogo className="h-10" color="#FFFFFF" showText={true} />
        <div className="mt-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00A0E2] animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300">Portail Client</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2" id="sidebar-navigation">
        <div className="px-2 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Navigation</p>
        </div>
        <div className="space-y-1.5">
          {mainCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                id={`nav-item-${cat.id}`}
                onClick={cat.onClick}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  cat.isActive 
                    ? 'bg-[#00A0E2]/15 text-white border border-[#00A0E2]/40 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg transition-colors ${cat.isActive ? 'bg-[#00A0E2] text-white shadow-sm' : 'bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800'}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="truncate font-bold text-slate-100">{cat.label}</span>
                    <span className="truncate text-[10px] text-slate-400 font-normal">{cat.badge}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${cat.isActive ? 'text-[#00A0E2] translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Advisor Quick Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 m-3 rounded-2xl border flex flex-col gap-3" id="sidebar-advisor-card">
        <div className="flex items-center gap-3">
          {advisor.avatar ? (
            <img 
              src={advisor.avatar} 
              alt={advisor.name} 
              className="advisor-portrait w-9 h-9 rounded-full object-cover border border-[#00A0E2]/40 shadow-sm"
              referrerPolicy="no-referrer"
              id="sidebar-advisor-avatar"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#00A0E2]/40 bg-slate-800 text-xs font-bold text-white">
              {advisor.name.slice(0, 1)}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{advisor.name}</h4>
            <p className="text-[10px] text-slate-400 truncate">{advisor.title}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
          {advisor.phone && (
            <a 
              href={`tel:${advisor.phone.replace(/\s/g, '')}`} 
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-[#00A0E2] text-slate-200 hover:text-white transition-all font-semibold"
              id="sidebar-advisor-phone"
            >
              <Phone className="w-3 h-3 text-[#00A0E2] group-hover:text-white" />
              <span>Appeler</span>
            </a>
          )}
          {advisor.email && (
            <a 
              href={`mailto:${advisor.email}`} 
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-[#00A0E2] text-slate-200 hover:text-white transition-all font-semibold truncate"
              id="sidebar-advisor-email"
            >
              <Mail className="w-3 h-3 text-[#00A0E2] group-hover:text-white" />
              <span className="truncate">Écrire</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}

