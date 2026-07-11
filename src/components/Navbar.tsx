import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Handshake, 
  Settings,
  Phone,
  Mail
} from 'lucide-react';
import IadLogo from './IadLogo';
import { AdvisorInfo } from '../types';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  advisor: AdvisorInfo;
  lastEvalSection?: string;
  lastTransSection?: string;
  lastAdminSection?: string;
}

export default function Navbar({ 
  activeSection, 
  setActiveSection, 
  advisor,
  lastEvalSection = 'situation',
  lastTransSection = 'documents',
  lastAdminSection = 'admin-clients'
}: NavbarProps) {
  
  const isEvaluationActive = ['situation', 'property', 'market', 'comparables', 'positioning', 'conclusion', 'services'].includes(activeSection);
  const isTransactionActive = ['documents', 'viewings', 'salesPlan', 'offers', 'stats'].includes(activeSection);
  const isAdminActive = ['admin', 'admin-clients', 'admin-profile', 'admin-property', 'admin-points', 'admin-stats'].includes(activeSection);

  const mainCategories = [
    { 
      id: 'cover', 
      label: 'Accueil', 
      icon: Home,
      isActive: activeSection === 'cover',
      onClick: () => setActiveSection('cover')
    },
    { 
      id: 'evaluation', 
      label: 'Estimation', 
      icon: TrendingUp,
      isActive: isEvaluationActive,
      onClick: () => setActiveSection(lastEvalSection)
    },
    { 
      id: 'transaction', 
      label: 'Suivi de Vente', 
      icon: Handshake,
      isActive: isTransactionActive,
      onClick: () => setActiveSection(lastTransSection)
    },
    { 
      id: 'admin', 
      label: 'Espace Conseiller (Admin)', 
      icon: Settings,
      isActive: isAdminActive,
      onClick: () => setActiveSection(lastAdminSection)
    }
  ];

  return (
    <aside 
      className="hidden lg:flex flex-col w-72 bg-slate-900 text-white h-screen fixed left-0 top-0 border-r border-slate-800 z-30" 
      id="desktop-sidebar"
    >
      {/* Sidebar Header with iad Logo */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center justify-center bg-slate-950/40" id="sidebar-logo-container">
        <IadLogo className="h-12" color="#00A0E2" showText={true} />
        <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-2">PORTAIL DE SUIVI CLIENT</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6" id="sidebar-navigation">
        <div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest px-4 block mb-3">NAVIGATION PRINCIPALE</span>
          <div className="space-y-1.5">
            {mainCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  id={`nav-item-${cat.id}`}
                  onClick={cat.onClick}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 group ${
                    cat.isActive 
                      ? 'bg-[#00A0E2] text-white shadow-lg shadow-[#00A0E2]/20 translate-x-1' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon 
                    className={`w-4 h-4 transition-transform duration-300 ${
                      cat.isActive ? 'scale-110' : 'group-hover:scale-110 text-slate-500 group-hover:text-white'
                    }`} 
                  />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Advisor Quick Card */}
      <div className="p-5 border-t border-slate-800 bg-slate-950/40 m-4 rounded-2xl flex flex-col gap-3" id="sidebar-advisor-card">
        <div className="flex items-center gap-3">
          <img 
            src={advisor.avatar} 
            alt={advisor.name} 
            className="w-10 h-10 rounded-full object-cover border border-[#00A0E2]/30 shadow-md referrerPolicy='no-referrer'"
            id="sidebar-advisor-avatar"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{advisor.name}</h4>
            <p className="text-[10px] text-slate-400 truncate">{advisor.title}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs text-slate-300 mt-1">
          <a 
            href={`tel:${advisor.phone.replace(/\s/g, '')}`} 
            className="flex items-center gap-2 hover:text-[#00A0E2] transition-colors"
            id="sidebar-advisor-phone"
          >
            <Phone className="w-3.5 h-3.5 text-[#00A0E2]" />
            <span>{advisor.phone}</span>
          </a>
          <a 
            href={`mailto:${advisor.email}`} 
            className="flex items-center gap-2 hover:text-[#00A0E2] transition-colors truncate"
            id="sidebar-advisor-email"
          >
            <Mail className="w-3.5 h-3.5 text-[#00A0E2] shrink-0" />
            <span className="truncate">{advisor.email}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
