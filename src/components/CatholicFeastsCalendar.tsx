import React, { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CatholicFeast,
  getFeastsInMonth,
  getUpcomingCatholicFeasts,
} from '../data/catholicFeasts';
import { getDayLabel, getMysterySetsForRosary } from '../data/rosaryCatalog';
import { DayOfWeek, RosaryId } from '../types/rosary';

interface CatholicFeastsCalendarProps {
  rosaryId: RosaryId;
  now: Date;
  onApplyFeastDay: (day: DayOfWeek, feastName: string) => void;
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const SHORT_WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getDaysDiff(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export const CatholicFeastsCalendar: React.FC<CatholicFeastsCalendarProps> = ({
  rosaryId,
  now,
  onApplyFeastDay,
}) => {
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedFeast, setSelectedFeast] = useState<CatholicFeast | null>(null);

  const mysterySets = getMysterySetsForRosary(rosaryId);

  const upcomingFeasts = useMemo(
    () => getUpcomingCatholicFeasts(now, 8),
    [now.getFullYear(), now.getMonth(), now.getDate()]
  );

  const monthFeasts = useMemo(
    () => getFeastsInMonth(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const feastsByDayNumber = useMemo(() => {
    const map = new Map<number, CatholicFeast[]>();
    monthFeasts.forEach((f) => {
      const d = f.date.getDate();
      const existing = map.get(d) ?? [];
      existing.push(f);
      map.set(d, existing);
    });
    return map;
  }, [monthFeasts]);

  // Construir grilla mensual empezando en Lunes
  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    // getDay(): 0=Dom..6=Sab => convertir a 0=Lun..6=Dom
    const startOffset = (firstDay.getDay() + 6) % 7;

    const cells: Array<{ day: number | null }> = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null });
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ day: d });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedFeast(null);
  };

  const highlightedFeast = selectedFeast ?? upcomingFeasts[0] ?? null;

  return (
    <section
      aria-label="Calendario de próximas fiestas religiosas católicas"
      className="mt-10 pt-8 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
            Año litúrgico católico
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1] mt-0.5">
            Calendario de Próximas Fiestas Religiosas Católicas
          </h2>
        </div>

        <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] max-w-md">
          Consulta las solemnidades y fiestas que se aproximan y alinea el rosario con
          el día de cada celebración.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendario mensual interactivo */}
        <div className="lg:col-span-5 bg-[#F6F1E6] dark:bg-[#191D24] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays
                className="w-4 h-4 text-[#8B5A0B] dark:text-[#E2A94C]"
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleGoToday}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#FBF8F1] dark:bg-[#232833] border border-[#D8CBB8] dark:border-[#363C49] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EFE7D8] dark:hover:bg-[#2D3340] cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Mes anterior"
                className="p-1.5 rounded-md border border-[#D8CBB8] dark:border-[#363C49] bg-[#FBF8F1] dark:bg-[#232833] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EFE7D8] dark:hover:bg-[#2D3340] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Mes siguiente"
                className="p-1.5 rounded-md border border-[#D8CBB8] dark:border-[#363C49] bg-[#FBF8F1] dark:bg-[#232833] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EFE7D8] dark:hover:bg-[#2D3340] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#5C5248] dark:text-[#9CA3AF]">
            {SHORT_WEEKDAYS.map((wd) => (
              <div key={wd} className="py-1">
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              if (cell.day === null) {
                return <div key={`empty-${idx}`} className="h-10" />;
              }

              const dayFeasts = feastsByDayNumber.get(cell.day) ?? [];
              const hasFeast = dayFeasts.length > 0;
              const isToday =
                viewYear === now.getFullYear() &&
                viewMonth === now.getMonth() &&
                cell.day === now.getDate();
              const isSelected =
                hasFeast &&
                selectedFeast?.isoDate === dayFeasts[0].isoDate;

              return (
                <button
                  key={`day-${cell.day}`}
                  type="button"
                  disabled={!hasFeast}
                  onClick={() => hasFeast && setSelectedFeast(dayFeasts[0])}
                  title={
                    hasFeast
                      ? dayFeasts.map((f) => f.name).join(' / ')
                      : undefined
                  }
                  className={`h-10 rounded-lg flex flex-col items-center justify-center text-xs tabular-nums transition-colors ${
                    isSelected
                      ? 'bg-[#1E3A5F] text-white font-semibold cursor-pointer'
                      : hasFeast
                        ? 'bg-[#FEF7E6] dark:bg-[#2D2518] border border-[#D49B35]/70 dark:border-[#B7791F] text-[#3B2303] dark:text-[#F5D57A] font-semibold hover:bg-[#FBECC8] dark:hover:bg-[#3A2F1D] cursor-pointer'
                        : isToday
                          ? 'bg-[#EFE7D8] dark:bg-[#272D38] border border-[#1E3A5F] dark:border-[#60A5FA] text-[#1F1A17] dark:text-[#F2ECE1] font-semibold'
                          : 'text-[#4C4138] dark:text-[#B6B0A6]'
                  }`}
                >
                  <span>{cell.day}</span>
                  {hasFeast && (
                    <span className="text-[9px] leading-none mt-0.5">✦</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detalle de la fiesta seleccionada en el calendario */}
          {highlightedFeast && (
            <div className="pt-3 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C5248] dark:text-[#A9A29A]">
                <span className="font-semibold text-[#8B5A0B] dark:text-[#E2A94C]">
                  {highlightedFeast.rank} · {formatShortDate(highlightedFeast.date)}
                </span>
                <span>
                  {getDayLabel(highlightedFeast.dayOfWeek)} ({mysterySets[highlightedFeast.recommendedMystery].shortName})
                </span>
              </div>
              <p className="font-display text-lg font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                {highlightedFeast.name}
              </p>
              <p className="text-xs text-[#4C4138] dark:text-[#C5BEB3] leading-relaxed">
                {highlightedFeast.description}
              </p>
              <button
                type="button"
                onClick={() =>
                  onApplyFeastDay(
                    highlightedFeast.dayOfWeek,
                    highlightedFeast.name
                  )
                }
                className="mt-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#1E3A5F] text-white hover:bg-[#162C49] transition-colors cursor-pointer"
              >
                Preparar rosario para {getDayLabel(highlightedFeast.dayOfWeek)} ({mysterySets[highlightedFeast.recommendedMystery].shortName})
              </button>
            </div>
          )}
        </div>

        {/* Lista cronológica de próximas fiestas católicas */}
        <div className="lg:col-span-7 bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E4DACB] dark:border-[#2C303A]">
            <h3 className="font-display text-xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
              Próximas Fiestas que se Vienen
            </h3>
            <span className="text-xs text-[#5C5248] dark:text-[#A9A29A] tabular-nums">
              Desde {formatShortDate(now)}
            </span>
          </div>

          <ul className="divide-y divide-[#E4DACB] dark:divide-[#2C303A]">
            {upcomingFeasts.map((feast) => {
              const daysLeft = getDaysDiff(now, feast.date);
              const whenLabel =
                daysLeft === 0
                  ? 'Hoy'
                  : daysLeft === 1
                    ? 'Mañana'
                    : `En ${daysLeft} días`;

              return (
                <li
                  key={feast.id}
                  className="py-3.5 first:pt-3 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5248] dark:text-[#A9A29A]">
                      <span className="font-semibold text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums">
                        {formatShortDate(feast.date)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#1F1A17] dark:text-[#F2ECE1]">
                        {whenLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{feast.rank}</span>
                    </div>

                    <p className="font-display text-lg font-semibold text-[#1F1A17] dark:text-[#F2ECE1] leading-snug">
                      {feast.name}
                    </p>
                    <p className="text-xs text-[#5C5248] dark:text-[#A9A29A]">
                      {feast.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1.5">
                    <span className="text-[11px] font-medium text-[#1E3A5F] dark:text-[#93C5FD] whitespace-nowrap">
                      {getDayLabel(feast.dayOfWeek)} ·{' '}
                      {mysterySets[feast.recommendedMystery].shortName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setViewYear(feast.date.getFullYear());
                        setViewMonth(feast.date.getMonth());
                        setSelectedFeast(feast);
                      }}
                      className="px-2.5 py-1 text-xs font-medium rounded-md border border-[#D8CBB8] dark:border-[#363C49] bg-[#F3ECE0] dark:bg-[#232833] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Ver en calendario
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
