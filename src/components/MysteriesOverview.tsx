import React from 'react';
import { Check } from 'lucide-react';
import {
  getDayLabel,
  getMysterySetsForRosary,
  getRecommendedMysteryForDay,
  ROSARY_DEFINITIONS,
} from '../data/rosaryCatalog';
import { DayOfWeek, DolorososOrder, MysteryType, RosaryId } from '../types/rosary';

interface MysteriesOverviewProps {
  rosaryId: RosaryId;
  selectedDay: DayOfWeek;
  activeMystery: MysteryType;
  dolorososOrder?: DolorososOrder;
  onSelectMysteryAndGo: (mystery: MysteryType) => void;
}

export const MysteriesOverview: React.FC<MysteriesOverviewProps> = ({
  rosaryId,
  selectedDay,
  activeMystery,
  dolorososOrder,
  onSelectMysteryAndGo,
}) => {
  const mysterySets = getMysterySetsForRosary(rosaryId, dolorososOrder);
  const definition = ROSARY_DEFINITIONS[rosaryId];
  const recommended = getRecommendedMysteryForDay(selectedDay);
  const dayLabel = getDayLabel(selectedDay);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-[#E4DACB] dark:border-[#2C303A]">
        <div>
          <p className="text-xs font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
            {definition.name} · Ciclos del Santo Rosario
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1] mt-1">
            Los Cuatro Misterios
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#5C5248] dark:text-[#A9A29A] max-w-md">
          Según el día elegido ({dayLabel}), corresponde agregar los{' '}
          <span className="font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
            {mysterySets[recommended].name}
          </span>
          . Puedes consultar los 4 ciclos o activar cualquiera de ellos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(['gozosos', 'luminosos', 'dolorosos', 'gloriosos'] as MysteryType[]).map(
          (mType) => {
            const set = mysterySets[mType];
            const isActive = activeMystery === mType;
            const isDayMatch = recommended === mType;

            return (
              <div
                key={mType}
                className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isActive
                    ? 'bg-[#F6F1E6] dark:bg-[#1E232D] border-[#B7791F] dark:border-[#E2A94C]'
                    : 'bg-[#FBF8F1] dark:bg-[#161A21] border-[#E4DACB] dark:border-[#2C303A]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
                      {set.daysLabel}
                      {isDayMatch ? ` · Recomendado para ${dayLabel}` : ''}
                    </span>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD]">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Activo</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                      {set.name}
                    </h3>
                    <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-0.5">
                      {set.subtitle}
                    </p>
                  </div>

                  <ol className="pt-2 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-3">
                    {set.mysteries.map((item) => (
                      <li
                        key={item.number}
                        className="space-y-1 text-sm text-[#2C241E] dark:text-[#D5CEC2]"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums w-4 shrink-0">
                            {item.number}.
                          </span>
                          <span className="font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                            {item.title}{' '}
                            <span className="text-xs font-medium text-[#1E3A5F] dark:text-[#93C5FD]">
                              ({item.scriptureRef})
                            </span>
                          </span>
                        </div>
                        <p className="font-prayer text-[14px] leading-relaxed pl-6 text-[#3B312B] dark:text-[#C5BEB3]">
                          {item.gospelText}{' '}
                          <span className="italic text-[#8B5A0B] dark:text-[#E2A94C]">
                            {item.pauseNote}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectMysteryAndGo(mType)}
                    className={`w-full py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1E3A5F] text-white hover:bg-[#162C49]'
                        : 'bg-[#EFE7D8] dark:bg-[#232833] text-[#1F1A17] dark:text-[#E5DEC9] hover:bg-[#E4DACB] dark:hover:bg-[#2D3340]'
                    }`}
                  >
                    {isActive ? 'Continuar rezando estos misterios' : `Rezar ${set.name}`}
                  </button>
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
};
