import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { DEFAULT_DAILY_INTENTIONS } from '../data/rosaryCatalog';
import { DailyIntention } from '../types/rosary';

interface IntentionsPanelProps {
  customIntentions: DailyIntention[];
  prayedIntentionIds: Set<string>;
  onToggleIntentionPrayed: (id: string) => void;
  onAddCustomIntention: (text: string) => void;
  onDeleteCustomIntention: (id: string) => void;
}

export const IntentionsPanel: React.FC<IntentionsPanelProps> = ({
  customIntentions,
  prayedIntentionIds,
  onToggleIntentionPrayed,
  onAddCustomIntention,
  onDeleteCustomIntention,
}) => {
  const [newIntention, setNewIntention] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntention.trim()) return;
    onAddCustomIntention(newIntention.trim());
    setNewIntention('');
  };

  const allIntentions = [...DEFAULT_DAILY_INTENTIONS, ...customIntentions];
  const prayedCount = allIntentions.filter((i) => prayedIntentionIds.has(i.id)).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-[#E4DACB] dark:border-[#2C303A]">
        <div>
          <p className="text-xs font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
            Santo Rosario · Siete intenciones de la guía
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1] mt-1">
            Intenciones Diarias de Oración
          </h2>
        </div>
        <span className="text-xs font-medium text-[#5C5248] dark:text-[#A9A29A] tabular-nums">
          {prayedCount} / {allIntentions.length} ofrecidas
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-5 sm:p-6 space-y-4">
          <h3 className="font-display text-xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
            Reza diariamente por las siguientes intenciones
          </h3>

          <ul className="divide-y divide-[#E4DACB] dark:divide-[#2C303A]">
            {allIntentions.map((intention, index) => {
              const checked = prayedIntentionIds.has(intention.id);
              return (
                <li key={intention.id} className="py-3.5 first:pt-1 last:pb-1">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleIntentionPrayed(intention.id)}
                      className="flex items-start gap-3 text-left cursor-pointer flex-1"
                    >
                      <span
                        className={`mt-1 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-[#B7791F] border-[#8B5A0B] text-white'
                            : 'bg-white dark:bg-[#232833] border-[#B8A894] dark:border-[#4B5563]'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" aria-hidden="true" />}
                      </span>
                      <span className="space-y-0.5">
                        <span className="block text-[11px] font-medium text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums">
                          {intention.isCustom
                            ? 'Intención personal agregada'
                            : `Intención ${index + 1}`}
                        </span>
                        <span
                          className={`font-prayer text-[15.5px] leading-relaxed block ${
                            checked
                              ? 'text-[#6E6256] dark:text-[#8E877D] line-through'
                              : 'text-[#1F1A17] dark:text-[#EAE3D5]'
                          }`}
                        >
                          {intention.text}
                        </span>
                      </span>
                    </button>

                    {intention.isCustom && (
                      <button
                        type="button"
                        onClick={() => onDeleteCustomIntention(intention.id)}
                        aria-label="Eliminar intención personal"
                        className="p-1.5 text-[#5C5248] dark:text-[#A9A29A] hover:text-[#9A3412] dark:hover:text-[#F87171] rounded-md hover:bg-[#EFE7D8] dark:hover:bg-[#2D3340] cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="lg:col-span-4 bg-[#F6F1E6] dark:bg-[#191D24] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
              Agregar intención particular
            </h3>
            <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-1 leading-relaxed">
              Añade tus propias peticiones familiares o comunitarias. Se guardarán
              automáticamente en este navegador.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              rows={3}
              value={newIntention}
              onChange={(e) => setNewIntention(e.target.value)}
              placeholder="Por la salud, paz o una intención especial..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-white dark:bg-[#111317] text-[#1F1A17] dark:text-[#F2ECE1] placeholder:text-[#9A8E80] dark:placeholder:text-[#6B7280] font-prayer focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            />
            <button
              type="submit"
              disabled={!newIntention.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162C49] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Incorporar intención</span>
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
};
