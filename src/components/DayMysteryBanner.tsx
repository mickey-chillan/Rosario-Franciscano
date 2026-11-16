import React, { useState } from 'react';
import { AlertTriangle, Calendar, ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  DAYS_OF_WEEK,
  getDayLabel,
  getMysterySetsForRosary,
  getRecommendedMysteryForDay,
} from '../data/rosaryCatalog';
import { DayOfWeek, DolorososOrder, MysteryType, RosaryId } from '../types/rosary';

interface DayMysteryBannerProps {
  rosaryId: RosaryId;
  selectedDay: DayOfWeek;
  activeMystery: MysteryType;
  dolorososOrder?: DolorososOrder;
  onSelectDay: (day: DayOfWeek) => void;
  onSelectMystery: (mystery: MysteryType) => void;
}

export const DayMysteryBanner: React.FC<DayMysteryBannerProps> = ({
  rosaryId,
  selectedDay,
  activeMystery,
  dolorososOrder,
  onSelectDay,
  onSelectMystery,
}) => {
  const [showList, setShowList] = useState(false);

  const mysterySets = getMysterySetsForRosary(rosaryId, dolorososOrder);
  const recommendedMystery = getRecommendedMysteryForDay(selectedDay);
  const recommendedSet = mysterySets[recommendedMystery];
  const activeSet = mysterySets[activeMystery];
  const dayLabel = getDayLabel(selectedDay);
  const hasMismatch = activeMystery !== recommendedMystery;

  return (
    <div className="bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5248] dark:text-[#A9A29A]">
          <Calendar
            className="w-3.5 h-3.5 text-[#8B5A0B] dark:text-[#E2A94C]"
            aria-hidden="true"
          />
          <span>Selecciona el día para asignar automáticamente los misterios</span>
        </div>
        <span className="text-xs text-[#5C5248] dark:text-[#A9A29A]">
          {activeSet.daysLabel}
        </span>
      </div>

      <div
        className="grid grid-cols-7 gap-1 p-1 bg-[#EFE7D8] dark:bg-[#222732] rounded-lg"
        role="group"
        aria-label="Seleccionar día de la semana"
      >
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = day.id === selectedDay;
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onSelectDay(day.id)}
              className={`py-2 px-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#FBF8F1] dark:bg-[#161A21] text-[#1F1A17] dark:text-[#F2ECE1] shadow-xs font-semibold'
                  : 'text-[#5C5248] dark:text-[#A9A29A] hover:text-[#1F1A17] dark:hover:text-[#F2ECE1]'
              }`}
            >
              <span className="hidden sm:inline">{day.label}</span>
              <span className="sm:hidden">{day.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {hasMismatch ? (
        <div
          role="alert"
          className="rounded-lg border border-[#D49B35] bg-[#FEF7E6] dark:bg-[#2B2212] p-3.5 text-sm text-[#4A2F05] dark:text-[#FDE68A] space-y-2"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle
              className="w-4 h-4 text-[#B7791F] dark:text-[#FBBF24] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-1 flex-1">
              <p className="font-semibold text-[#3B2303] dark:text-[#FEF3C7]">
                Aviso para {dayLabel}: corresponde agregar los {recommendedSet.name}
              </p>
              <p className="text-xs text-[#5C4114] dark:text-[#E5C98B] leading-relaxed">
                Seleccionaste el día {dayLabel} (día de {recommendedSet.name}), pero tienes
                activos los {activeSet.name}.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => onSelectMystery(recommendedMystery)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[#8B5A0B] text-white hover:bg-[#724807] transition-colors cursor-pointer whitespace-nowrap"
            >
              Cambiar a {recommendedSet.name}
            </button>
            <button
              type="button"
              onClick={() => setShowList((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#724807] dark:text-[#FCD34D] hover:underline cursor-pointer"
            >
              <span>{showList ? 'Ocultar lista' : 'Ver misterios a agregar'}</span>
              {showList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-[#DFD3C0] dark:border-[#2C303A] bg-[#F5EFE2] dark:bg-[#1E232D] p-3.5 text-sm text-[#2C241E] dark:text-[#E5DEC9]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Info
                className="w-4 h-4 text-[#8B5A0B] dark:text-[#E2A94C] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                  {dayLabel}: corresponde agregar los {recommendedSet.name}
                </p>
                <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-0.5">
                  {recommendedSet.subtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowList((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3A5F] dark:text-[#93C5FD] hover:underline shrink-0 cursor-pointer whitespace-nowrap"
            >
              <span>{showList ? 'Ocultar' : 'Ver los 5 misterios'}</span>
              {showList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {showList && (
        <ol className="pt-2 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-1.5 text-xs text-[#3B312B] dark:text-[#D5CEC2]">
          {recommendedSet.mysteries.map((m) => (
            <li key={m.number} className="flex items-baseline gap-2">
              <span className="font-semibold text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums w-4 shrink-0">
                {m.number}.
              </span>
              <span className="font-prayer text-sm text-[#1F1A17] dark:text-[#F2ECE1]">
                {m.title}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-[#5C5248] dark:text-[#A9A29A]">
          Misterios activos:
        </span>
        <div
          className="flex flex-wrap items-center gap-1"
          role="group"
          aria-label="Elegir conjunto de misterios"
        >
          {(['gozosos', 'dolorosos', 'gloriosos', 'luminosos'] as MysteryType[]).map(
            (mType) => {
              const set = mysterySets[mType];
              const active = activeMystery === mType;
              return (
                <button
                  key={mType}
                  type="button"
                  onClick={() => onSelectMystery(mType)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#1E3A5F] text-white font-medium'
                      : 'bg-[#EFE7D8] dark:bg-[#232833] text-[#4C4138] dark:text-[#C5BEB3] hover:bg-[#E4DACB] dark:hover:bg-[#2D3340]'
                  }`}
                >
                  {set.shortName}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
