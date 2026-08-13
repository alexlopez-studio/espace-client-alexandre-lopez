import { CheckCircle2, Circle, Clock, ListChecks, User, UserCog } from 'lucide-react';
import { MandateAction } from '../types';

interface MandateActionsSectionProps {
  actions: MandateAction[];
}

/**
 * Actions de préparation du mandat.
 *
 * Délibérément sans numérotation ni fil conducteur, contrairement à la
 * chronologie : ces actions sont parallèles. Un DPE et un shooting photo ne se
 * font pas dans un ordre imposé et n'avancent pas la vente d'un cran — les
 * présenter en séquence laisserait croire l'inverse.
 */
export default function MandateActionsSection({ actions }: MandateActionsSectionProps) {
  if (actions.length === 0) return null;

  const done = actions.filter((action) => action.status === 'Fait').length;
  const mine = actions.filter((action) => action.responsible === 'Vendeur' && action.status !== 'Fait');

  return (
    <div className="w-full flex flex-col gap-4" id="mandate-actions-root">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-5">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#00A0E2]" />
              Préparation du mandat
            </h4>
            <p className="text-xs text-slate-500">
              {mine.length > 0
                ? `${mine.length} élément${mine.length > 1 ? 's' : ''} à votre main. Ces actions avancent en parallèle de la vente.`
                : 'Ces actions avancent en parallèle de la vente, chacune à son rythme.'}
            </p>
          </div>
          <div className="shrink-0 rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5">
            <span className="text-xs font-bold text-slate-700 tabular-nums">{done} / {actions.length}</span>
            <span className="text-[11px] text-slate-500 font-medium"> traitées</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2.5">
          {actions.map((action) => {
            const isDone = action.status === 'Fait';
            const isWaiting = action.status === 'En attente';
            const isSeller = action.responsible === 'Vendeur';

            const StatusIcon = isDone ? CheckCircle2 : isWaiting ? Clock : Circle;
            const statusColor = isDone
              ? 'text-emerald-500'
              : isWaiting
                ? 'text-amber-500'
                : 'text-slate-300';

            return (
              <li
                key={action.id}
                className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-colors ${
                  isDone ? 'border-slate-100 bg-slate-50/60' : 'border-slate-100 bg-white'
                }`}
              >
                <StatusIcon className={`w-5 h-5 shrink-0 mt-0.5 ${statusColor}`} aria-hidden="true" />

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-bold ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {action.title}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isSeller ? 'bg-[#00A0E2]/10 text-[#0078A8]' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isSeller ? <User className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                      {isSeller ? 'Vous' : 'Votre conseiller'}
                    </span>

                    {isWaiting && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        En attente
                      </span>
                    )}
                  </div>

                  {action.description && (
                    <p className={`text-xs leading-relaxed ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                      {action.description}
                    </p>
                  )}

                  {(action.dueDate || action.doneDate) && (
                    <p className="text-[11px] font-medium text-slate-400 tabular-nums">
                      {isDone && action.doneDate
                        ? `Fait le ${action.doneDate}`
                        : action.dueDate
                          ? `Échéance : ${action.dueDate}`
                          : null}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
