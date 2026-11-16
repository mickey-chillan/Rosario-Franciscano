import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Bird,
  BookOpen,
  Cross,
  Crown,
  RotateCcw,
  Sun,
} from 'lucide-react';
import {
  DEFAULT_DOLOROSOS_ORDER,
  getDayLabel,
  getMysterySetsForRosary,
  getRecommendedMysteryForDay,
  getSectionsForRosary,
  PRAYERS,
} from '../data/rosaryCatalog';
import {
  DayOfWeek,
  DolorososOrder,
  MysteryType,
  OpeningPrayerChoice,
  RosaryBead,
  RosaryId,
} from '../types/rosary';

interface TopMysteryBarProps {
  rosaryId: RosaryId;
  selectedDay: DayOfWeek;
  activeMystery: MysteryType;
  dolorososOrder: DolorososOrder;
  activeBead: RosaryBead;
  openingChoice: OpeningPrayerChoice;
  onSelectMystery: (mystery: MysteryType) => void;
  onUpdateDolorososOrder: (nextOrder: DolorososOrder) => void;
  onJumpToMysteryBead: (decadeNumber: 1 | 2 | 3 | 4 | 5) => void;
}

const MYSTERY_BUTTON_ORDER: MysteryType[] = [
  'gozosos',
  'luminosos',
  'dolorosos',
  'gloriosos',
];

const MYSTERY_BUTTON_CONFIG: Record<
  MysteryType,
  {
    label: string;
    daysShort: string;
    activeClass: string;
    idleClass: string;
    Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  }
> = {
  gozosos: {
    label: 'Misterios Gozosos',
    daysShort: 'Lun·Sáb',
    activeClass:
      'bg-[#8B5A0B] text-white border-[#8B5A0B] dark:bg-[#B7791F] dark:border-[#E2A94C]',
    idleClass:
      'bg-[#FBF7EC] dark:bg-[#1E1A14] text-[#5C3B1E] dark:text-[#F2DFC0] border-[#DFD2B5] dark:border-[#493E2B] hover:bg-[#F3E9D2] dark:hover:bg-[#2A2319]',
    Icon: Bird,
  },
  luminosos: {
    label: 'Misterios Luminosos',
    daysShort: 'Jue',
    activeClass:
      'bg-[#A16207] text-white border-[#A16207] dark:bg-[#CA8A04] dark:border-[#FACC15]',
    idleClass:
      'bg-[#FEF9E6] dark:bg-[#211D11] text-[#714E10] dark:text-[#FDE68A] border-[#E8D596] dark:border-[#564820] hover:bg-[#FBF0C4] dark:hover:bg-[#2D2717]',
    Icon: Sun,
  },
  dolorosos: {
    label: 'Misterios Dolorosos',
    daysShort: 'Mar·Vie',
    activeClass:
      'bg-[#8C2323] text-white border-[#8C2323] dark:bg-[#B91C1C] dark:border-[#F87171]',
    idleClass:
      'bg-[#FDF1F1] dark:bg-[#241618] text-[#7F2424] dark:text-[#FCA5A5] border-[#E7BCBC] dark:border-[#5B2F34] hover:bg-[#FAE1E1] dark:hover:bg-[#321E21]',
    Icon: Cross,
  },
  gloriosos: {
    label: 'Misterios Gloriosos',
    daysShort: 'Mié·Dom',
    activeClass:
      'bg-[#1E3A5F] text-white border-[#1E3A5F] dark:bg-[#2563EB] dark:border-[#60A5FA]',
    idleClass:
      'bg-[#EFF5FD] dark:bg-[#151F2D] text-[#1E467A] dark:text-[#BFDBFE] border-[#BAD0EC] dark:border-[#2E4666] hover:bg-[#E1ECFA] dark:hover:bg-[#1D2B3E]',
    Icon: Crown,
  },
};

export const TopMysteryBar: React.FC<TopMysteryBarProps> = ({
  rosaryId,
  selectedDay,
  activeMystery,
  dolorososOrder,
  activeBead,
  openingChoice,
  onSelectMystery,
  onUpdateDolorososOrder,
  onJumpToMysteryBead,
}) => {
  const [isReorderingDolorosos, setIsReorderingDolorosos] = useState(false);

  const mysterySets = getMysterySetsForRosary(rosaryId, dolorososOrder);
  const activeSet = mysterySets[activeMystery];
  const recommendedMystery = getRecommendedMysteryForDay(selectedDay);
  const dayLabel = getDayLabel(selectedDay);
  const sections = getSectionsForRosary(rosaryId);
  const activeSection =
    sections.find((s) => s.id === activeBead.sectionId) ?? sections[0];

  const isCustomDolorososOrder = dolorososOrder.some(
    (num, idx) => num !== DEFAULT_DOLOROSOS_ORDER[idx]
  );

  const moveDolorosoItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= dolorososOrder.length) return;
    const next = [...dolorososOrder] as DolorososOrder;
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onUpdateDolorososOrder(next);
  };

  const resetDolorososOrder = () => {
    onUpdateDolorososOrder([...DEFAULT_DOLOROSOS_ORDER]);
  };

  const selectedDecade = activeBead.decadeIndex ?? activeSection.decadeIndex;
  const selectedMysteryItem = selectedDecade
    ? activeSet.mysteries.find((m) => m.number === selectedDecade)
    : undefined;

  // Oración exacta correspondiente a la esfera en rezo actual
  let spherePrayers: Array<{ title: string; text: string }> = [];

  if (activeSection.prayerType === 'opening') {
    spherePrayers = [
      PRAYERS.senalDeLaCruz,
      openingChoice === 'credo' ? PRAYERS.credo : PRAYERS.actoDeContricion,
    ];
  } else if (
    activeSection.prayerType === 'intro-padrenuestro' ||
    activeSection.prayerType === 'mystery-padrenuestro'
  ) {
    spherePrayers = [PRAYERS.padreNuestro];
  } else if (activeSection.prayerType === 'intro-avemarias') {
    spherePrayers = [
      {
        title: activeBead.aveMariaIndex
          ? `Ave María (${activeBead.aveMariaIndex} de 3)`
          : PRAYERS.aveMaria.title,
        text: PRAYERS.aveMaria.text,
      },
      PRAYERS.gloria,
    ];
  } else if (activeSection.prayerType === 'decade-avemarias') {
    spherePrayers = [
      {
        title: activeBead.aveMariaIndex
          ? `Ave María (${activeBead.aveMariaIndex} de 10)`
          : PRAYERS.aveMaria.title,
        text: PRAYERS.aveMaria.text,
      },
    ];
    if (activeBead.isEndOfDecade) {
      spherePrayers.push(PRAYERS.gloria, PRAYERS.oracionDeFatima);
    }
  } else if (activeSection.prayerType === 'closing-salve') {
    spherePrayers = [PRAYERS.salve];
  }

  return (
    <section
      aria-label="Selección de misterios y frame de oración actual"
      className="mb-6 space-y-3"
    >
      {/* Botonera compacta de los 4 Misterios agrupados de dos en dos (2×2) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div
          className="grid grid-cols-2 gap-2 w-full sm:w-auto"
          role="group"
          aria-label="Seleccionar conjunto de misterios"
        >
          {MYSTERY_BUTTON_ORDER.map((mType) => {
            const cfg = MYSTERY_BUTTON_CONFIG[mType];
            const Icon = cfg.Icon;
            const isActive = activeMystery === mType;
            const isToday = recommendedMystery === mType;

            return (
              <button
                key={mType}
                type="button"
                onClick={() => onSelectMystery(mType)}
                aria-pressed={isActive}
                title={`${cfg.label} (${cfg.daysShort}${isToday ? ` · Recomendado para ${dayLabel}` : ''})`}
                className={`inline-flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive ? cfg.activeClass : cfg.idleClass
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden={true} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            if (activeMystery !== 'dolorosos') {
              onSelectMystery('dolorosos');
            }
            setIsReorderingDolorosos((prev) => !prev);
          }}
          aria-expanded={isReorderingDolorosos}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center ${
            isReorderingDolorosos
              ? 'bg-[#7F2424] text-white border-[#7F2424]'
              : 'bg-[#FDF1F1] dark:bg-[#241618] text-[#7F2424] dark:text-[#FCA5A5] border-[#DBA4A4] dark:border-[#6B383E] hover:bg-[#FAE1E1] dark:hover:bg-[#321E21]'
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {isReorderingDolorosos
              ? 'Cerrar reacomodo'
              : isCustomDolorososOrder
                ? 'Reacomodar dolorosos (Personalizado)'
                : 'Reacomodar dolorosos'}
          </span>
        </button>
      </div>

      {/* Panel para reacomodar los 5 Misterios Dolorosos */}
      {isReorderingDolorosos && (
        <div
          aria-label="Reacomodar Misterios Dolorosos"
          className="rounded-xl border border-[#E7BCBC] dark:border-[#5B2F34] bg-[#FDF5F5] dark:bg-[#1E1416] p-4 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E7BCBC]/70 dark:border-[#5B2F34]/70">
            <div>
              <h4 className="font-display text-lg font-semibold text-[#7F2424] dark:text-[#FCA5A5]">
                Reacomodar los Misterios Dolorosos
              </h4>
              <p className="text-xs text-[#5C5248] dark:text-[#B5AEA4]">
                Ajusta el orden de los 5 misterios dolorosos; se reflejará en las esferas, el frame superior y el PDF.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isCustomDolorososOrder && (
                <button
                  type="button"
                  onClick={resetDolorososOrder}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#DBA4A4] dark:border-[#7B3F46] bg-white dark:bg-[#2C1C1F] text-[#7F2424] dark:text-[#FECACA] hover:bg-[#FAE3E3] dark:hover:bg-[#3A2428] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Restaurar orden tradicional</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsReorderingDolorosos(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#7F2424] text-white hover:bg-[#661B1B] transition-colors cursor-pointer whitespace-nowrap"
              >
                Listo
              </button>
            </div>
          </div>

          <ol className="space-y-2">
            {mysterySets.dolorosos.mysteries.map((item, idx) => (
              <li
                key={`doloroso-order-${item.originalNumber ?? item.number}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#E7BCBC] dark:border-[#4D2A2E] bg-white/90 dark:bg-[#26181A] px-3.5 py-2"
              >
                <div className="flex items-baseline gap-2.5 min-w-0">
                  <span className="text-xs font-bold text-[#7F2424] dark:text-[#FCA5A5] tabular-nums shrink-0">
                    {idx + 1}.º Misterio
                  </span>
                  <span className="font-prayer text-sm text-[#1F1A17] dark:text-[#F2ECE1] truncate sm:whitespace-normal">
                    {item.title}
                  </span>
                  <span className="hidden md:inline text-xs text-[#6E6256] dark:text-[#A9A29A] shrink-0">
                    ({item.scriptureRef})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveDolorosoItem(idx, -1)}
                    disabled={idx === 0}
                    aria-label={`Subir ${item.title}`}
                    className="p-1.5 rounded-md border border-[#DBA4A4] dark:border-[#6B383E] bg-[#FDF1F1] dark:bg-[#321E21] text-[#7F2424] dark:text-[#FECACA] hover:bg-[#F9DADA] dark:hover:bg-[#42262A] disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDolorosoItem(idx, 1)}
                    disabled={idx === 4}
                    aria-label={`Bajar ${item.title}`}
                    className="p-1.5 rounded-md border border-[#DBA4A4] dark:border-[#6B383E] bg-[#FDF1F1] dark:bg-[#321E21] text-[#7F2424] dark:text-[#FECACA] hover:bg-[#F9DADA] dark:hover:bg-[#42262A] disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Frame superior interactivo: muestra el rezo de la esfera actual, misterio y pasaje del Evangelio */}
      <div
        aria-live="polite"
        aria-label="Frame superior de oración actual y lectura del Evangelio"
        className="rounded-xl border border-[#C9B9A0] dark:border-[#344256] bg-[#F6F1E6] dark:bg-[#171C24] p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E4DACB] dark:border-[#2C303A]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5248] dark:text-[#A9A29A]">
            <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
              Rezando ahora: {activeBead.label}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
              {activeSet.name} ({activeSet.daysLabel})
            </span>
          </div>

          <div
            className="flex flex-wrap items-center gap-1"
            role="group"
            aria-label="Ir directamente a una esfera de misterio"
          >
            {([1, 2, 3, 4, 5] as const).map((num) => {
              const isCurrentDecade = selectedDecade === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onJumpToMysteryBead(num)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                    isCurrentDecade
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-[#EFE7D8] dark:bg-[#232833] text-[#4C4138] dark:text-[#C5BEB3] hover:bg-[#E4DACB] dark:hover:bg-[#2D3340]'
                  }`}
                >
                  {num}.º Misterio
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 ${
            selectedMysteryItem ? 'lg:grid-cols-12' : ''
          }`}
        >
          {/* Bloque del Misterio y Evangelio (si la esfera pertenece a un misterio/decena) */}
          {selectedMysteryItem && (
            <div className="lg:col-span-6 rounded-lg border border-[#DFD3C0] dark:border-[#2C3646] bg-[#FBF8F1] dark:bg-[#1E2430] p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#8B5A0B] dark:text-[#E2A94C]">
                  {selectedMysteryItem.number}.º Misterio · {activeSet.name}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-[#1E3A5F] dark:text-[#93C5FD]">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{selectedMysteryItem.scriptureRef}</span>
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1F1A17] dark:text-[#F2ECE1] leading-snug text-balance">
                {selectedMysteryItem.title}
              </h2>

              <p className="font-prayer text-[15px] leading-relaxed text-[#2C241E] dark:text-[#E5DEC9]">
                {selectedMysteryItem.gospelText}
              </p>

              <p className="text-xs italic font-medium text-[#8B5A0B] dark:text-[#E2A94C] pt-1">
                {selectedMysteryItem.pauseNote}
              </p>
            </div>
          )}

          {/* Bloque del Rezo correspondiente a la esfera seleccionada */}
          <div
            className={`${
              selectedMysteryItem ? 'lg:col-span-6' : ''
            } rounded-lg border border-[#DFD3C0] dark:border-[#2C3646] bg-[#FBF8F1] dark:bg-[#1E2430] p-4 space-y-2.5`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD]">
                Oración de la esfera seleccionada · {activeSection.shortLabel}
              </span>
              {!selectedMysteryItem && (
                <span className="text-xs text-[#6E6256] dark:text-[#A9A29A] italic">
                  {activeSet.subtitle}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {spherePrayers.map((p, idx) => (
                <div
                  key={`${p.title}-${idx}`}
                  className={
                    idx > 0
                      ? 'pt-2 border-t border-[#E4DACB] dark:border-[#2C3646] space-y-1'
                      : 'space-y-1'
                  }
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8B5A0B] dark:text-[#E2A94C]">
                    {p.title}
                  </p>
                  <p className="font-prayer text-[15px] leading-relaxed text-[#1F1A17] dark:text-[#F2ECE1]">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
