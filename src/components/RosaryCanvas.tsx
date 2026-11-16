import React, { useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  getSectionsForRosary,
  ROSARY_DEFINITIONS,
} from '../data/rosaryCatalog';
import { RosaryBead, RosaryId, SectionId, ThemeMode } from '../types/rosary';
import {
  getRosaryGeometry,
  ROSARY_VIEWBOX_HEIGHT,
  ROSARY_VIEWBOX_WIDTH,
} from '../utils/rosaryGeometry';

interface RosaryCanvasProps {
  rosaryId: RosaryId;
  themeMode: ThemeMode;
  activeBeadId: string;
  activeSectionId: SectionId;
  prayedBeadIds: Set<string>;
  customCountBySection: Record<number, number>;
  lastFeedback: string | null;
  onSelectBead: (beadId: string) => void;
  onToggleBeadPrayed: (beadId: string) => void;
  onSelectSection: (sectionId: SectionId) => void;
  onResetProgress: () => void;
}

export const RosaryCanvas: React.FC<RosaryCanvasProps> = ({
  rosaryId,
  themeMode,
  activeBeadId,
  activeSectionId,
  prayedBeadIds,
  customCountBySection,
  lastFeedback,
  onSelectBead,
  onToggleBeadPrayed,
  onSelectSection,
  onResetProgress,
}) => {
  const lastTouchTapRef = useRef<{ beadId: string; time: number } | null>(null);
  const lastTouchToggleTimeRef = useRef<number>(0);

  const definition = ROSARY_DEFINITIONS[rosaryId];
  const isMarian = definition.theme === 'marian';
  const isDark = themeMode === 'dark';
  const sections = getSectionsForRosary(rosaryId);
  const { beads, cordPath, callouts, arrows } = getRosaryGeometry(rosaryId);

  const prayedCount = prayedBeadIds.size;
  const totalCount = beads.length;
  const progressPercent = Math.round((prayedCount / totalCount) * 100);

  const completedSections = new Set<SectionId>();
  sections.forEach((sec) => {
    const sectionBeads = beads.filter((b) => b.sectionId === sec.id);
    if (sectionBeads.length > 0 && sectionBeads.every((b) => prayedBeadIds.has(b.id))) {
      completedSections.add(sec.id);
    }
  });

  const handleDoubleClick = (
    e: React.MouseEvent<SVGGElement>,
    beadId: string
  ) => {
    e.preventDefault();
    if (Date.now() - lastTouchToggleTimeRef.current < 500) {
      return;
    }
    onToggleBeadPrayed(beadId);
  };

  const handlePointerUp = (
    e: React.PointerEvent<SVGGElement>,
    bead: RosaryBead
  ) => {
    if (e.pointerType === 'mouse') {
      return;
    }

    const now = Date.now();
    const prev = lastTouchTapRef.current;
    if (prev && prev.beadId === bead.id && now - prev.time < 340) {
      e.preventDefault();
      lastTouchTapRef.current = null;
      lastTouchToggleTimeRef.current = now;
      onSelectBead(bead.id);
      onToggleBeadPrayed(bead.id);
    } else {
      lastTouchTapRef.current = { beadId: bead.id, time: now };
      onSelectBead(bead.id);
    }
  };

  const surfaceClass = isMarian
    ? 'bg-[#F4F8FC] dark:bg-[#131922] border-[#D0DEEC] dark:border-[#273445]'
    : 'bg-[#F6F1E6] dark:bg-[#191612] border-[#E4DACB] dark:border-[#322B22]';
  const dividerClass = isMarian
    ? 'border-[#D0DEEC] dark:border-[#273445]'
    : 'border-[#E4DACB] dark:border-[#322B22]';
  const progressTrackClass = isMarian
    ? 'bg-[#DCE7F3] dark:bg-[#232F3E]'
    : 'bg-[#E6DDD0] dark:bg-[#2D261E]';
  const progressFillClass = isMarian
    ? 'bg-[#1E5693] dark:bg-[#60A5FA]'
    : 'bg-[#B7791F] dark:bg-[#E2A94C]';
  const activeRingStroke = isDark
    ? '#F5D57A'
    : isMarian
      ? '#163F6E'
      : '#1E3A5F';
  const haloFill = isDark
    ? isMarian
      ? 'rgba(96, 165, 250, 0.16)'
      : 'rgba(226, 169, 76, 0.16)'
    : isMarian
      ? 'rgba(30, 86, 147, 0.12)'
      : 'rgba(183, 121, 31, 0.14)';
  const haloStroke = isDark
    ? isMarian
      ? '#60A5FA'
      : '#E2A94C'
    : isMarian
      ? '#1E5693'
      : '#B7791F';

  return (
    <section
      aria-label={`Imagen interactiva del rosario: ${definition.name}`}
      className={`border rounded-xl p-4 sm:p-6 flex flex-col justify-between transition-colors ${surfaceClass}`}
    >
      {/* Cabecera compacta del lienzo del rosario */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${dividerClass}`}
      >
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1] tracking-tight">
            {definition.name}
          </h2>
          <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-0.5">
            {definition.directionLabel} · Doble tap en una esfera para marcar o desmarcar
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-sm font-semibold text-[#1F1A17] dark:text-[#F2ECE1] tabular-nums">
              {prayedCount} / {totalCount}
            </span>
            <span className="text-xs text-[#5C5248] dark:text-[#A9A29A] ml-1.5 tabular-nums">
              ({progressPercent}%)
            </span>
          </div>

          <button
            type="button"
            onClick={onResetProgress}
            disabled={prayedCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D5DCE4] dark:border-[#363C49] bg-white dark:bg-[#232833] text-[#333A42] dark:text-[#E5DEC9] hover:bg-[#EDF2F7] dark:hover:bg-[#2D3340] disabled:opacity-45 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Desmarcar todas las cuentas de este rosario"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Barra fina de progreso */}
      <div className={`w-full h-1.5 rounded-full overflow-hidden mt-3 ${progressTrackClass}`}>
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${progressFillClass}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Escenario SVG del Rosario */}
      <div className="relative w-full flex items-center justify-center my-2">
        <svg
          viewBox={`0 0 ${ROSARY_VIEWBOX_WIDTH} ${ROSARY_VIEWBOX_HEIGHT}`}
          className="w-full max-w-[620px] h-auto select-none"
          role="img"
          aria-label={`Diagrama interactivo de las 14 secciones del rosario ${definition.name}`}
        >
          <defs>
            {/* Madera natural para cuentas pendientes (Un Rosario por Chile) */}
            <radialGradient id="bead-wood" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#9C6038" />
              <stop offset="55%" stopColor="#6E3B1E" />
              <stop offset="100%" stopColor="#45220F" />
            </radialGradient>

            <radialGradient id="bead-wood-section" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#B87648" />
              <stop offset="60%" stopColor="#7E4523" />
              <stop offset="100%" stopColor="#512A13" />
            </radialGradient>

            {/* Azul mariano y gris plata para Mes de María 2026 */}
            <radialGradient id="bead-marian-blue" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#457BB5" />
              <stop offset="55%" stopColor="#1E5693" />
              <stop offset="100%" stopColor="#12365E" />
            </radialGradient>

            <radialGradient id="bead-marian-blue-section" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#5E95CE" />
              <stop offset="55%" stopColor="#2769B0" />
              <stop offset="100%" stopColor="#164273" />
            </radialGradient>

            <radialGradient id="bead-marian-silver" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="60%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </radialGradient>

            {/* Oro bruñido para cuentas rezadas (completadas con doble tap) */}
            <radialGradient id="bead-gold" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#F5D57A" />
              <stop offset="52%" stopColor="#C98D26" />
              <stop offset="100%" stopColor="#8B5A0B" />
            </radialGradient>

            {/* Azul zafiro luminoso para la esfera actualmente en rezo (1 clic) */}
            <radialGradient id="bead-active-sapphire" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="52%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>

            {/* Cruces */}
            <linearGradient id="cross-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A4E29" />
              <stop offset="100%" stopColor="#4B2510" />
            </linearGradient>

            <linearGradient id="cross-marian" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2B6CB0" />
              <stop offset="100%" stopColor="#163F6E" />
            </linearGradient>

            <linearGradient id="cross-active-sapphire" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>

            <linearGradient id="cross-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0CB6B" />
              <stop offset="100%" stopColor="#9A6612" />
            </linearGradient>

            {/* Punta de flecha direccional (Mes de María 2026) */}
            <marker
              id="marian-arrowhead"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path
                d="M 0 0 L 7 3.5 L 0 7 z"
                fill={isDark ? '#60A5FA' : '#1E5693'}
              />
            </marker>

            {/* Sombra suave bajo las cuentas */}
            <filter id="bead-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="1.5"
                stdDeviation="1.5"
                floodColor="#000000"
                floodOpacity={isDark ? '0.45' : '0.2'}
              />
            </filter>
          </defs>

          {/* Cordón / cadena del rosario */}
          <path
            d={cordPath}
            fill="none"
            stroke={
              isDark
                ? isMarian
                  ? '#4E6785'
                  : '#6D5C48'
                : isMarian
                  ? '#9EB4CB'
                  : '#9C8468'
            }
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Flechas direccionales para Mes de María 2026 */}
          {arrows.map((arrow) => (
            <path
              key={arrow.id}
              d={arrow.d}
              fill="none"
              stroke={isDark ? '#60A5FA' : '#1E5693'}
              strokeWidth="2"
              strokeLinecap="round"
              markerEnd="url(#marian-arrowhead)"
              opacity="0.82"
              pointerEvents="none"
            />
          ))}

          {/* Halo de las cuentas que pertenecen a la sección activa */}
          {beads
            .filter((b) => b.sectionId === activeSectionId)
            .map((bead) => (
              <circle
                key={`halo-${bead.id}`}
                cx={bead.x}
                cy={bead.y}
                r={
                  bead.kind === 'cross'
                    ? 34
                    : bead.kind === 'medal'
                      ? 22
                      : bead.kind === 'large'
                        ? 15.5
                        : 10.8
                }
                fill={haloFill}
                stroke={haloStroke}
                strokeWidth="1.25"
                strokeDasharray={bead.id === activeBeadId ? undefined : '3 2'}
                pointerEvents="none"
              />
            ))}

          {/* Etiquetas de las 14 secciones alrededor del rosario */}
          {callouts.map((anchor) => {
            const isActive = anchor.sectionId === activeSectionId;
            const isCompleted = completedSections.has(anchor.sectionId);
            const customCount = customCountBySection[anchor.sectionId] ?? 0;

            const activeTextColor = isDark
              ? isMarian
                ? '#93C5FD'
                : '#F5D57A'
              : isMarian
                ? '#143D6B'
                : '#8B5A0B';
            const completedTextColor = isDark
              ? '#6EE7B7'
              : isMarian
                ? '#2B6E4F'
                : '#4D6B3C';
            const defaultTextColor = isDark
              ? '#B8C0CC'
              : isMarian
                ? '#3E5369'
                : '#5C5248';

            return (
              <g
                key={`sec-label-${anchor.sectionId}`}
                onClick={() => onSelectSection(anchor.sectionId)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Ir a sección ${anchor.shortTag}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSection(anchor.sectionId);
                  }
                }}
              >
                <text
                  x={anchor.x}
                  y={anchor.y}
                  textAnchor={anchor.align}
                  className="text-[11.5px] transition-colors duration-150"
                  fill={
                    isActive
                      ? activeTextColor
                      : isCompleted
                        ? completedTextColor
                        : defaultTextColor
                  }
                  fontWeight={isActive ? 700 : 500}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {anchor.shortTag}
                  {isCompleted ? ' ✓' : ''}
                  {customCount > 0 ? ` (+${customCount})` : ''}
                </text>
              </g>
            );
          })}

          {/* Nodos interactivos: Cruz, Cuentas grandes, Cuentas pequeñas y Medallón */}
          {beads.map((bead) => {
            const isPrayed = prayedBeadIds.has(bead.id);
            const isActive = bead.id === activeBeadId;
            const inActiveSection = bead.sectionId === activeSectionId;

            if (bead.kind === 'cross') {
              return (
                <g
                  key={bead.id}
                  className="rosary-bead-node cursor-pointer"
                  onClick={() => onSelectBead(bead.id)}
                  onDoubleClick={(e) => handleDoubleClick(e, bead.id)}
                  onPointerUp={(e) => handlePointerUp(e, bead)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${bead.label}. Estado: ${isPrayed ? 'Rezada' : 'Pendiente'}. Doble tap para marcar o desmarcar.`}
                  aria-pressed={isPrayed}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onToggleBeadPrayed(bead.id);
                    } else if (e.key === ' ') {
                      e.preventDefault();
                      onSelectBead(bead.id);
                    }
                  }}
                >
                  <circle cx={bead.x} cy={bead.y} r={32} fill="transparent" />

                  {isActive && (
                    <circle
                      cx={bead.x}
                      cy={bead.y}
                      r={31}
                      fill="none"
                      stroke={activeRingStroke}
                      strokeWidth="2"
                    />
                  )}

                  <g filter="url(#bead-shadow)">
                    <rect
                      x={bead.x - 5.5}
                      y={bead.y - 26}
                      width="11"
                      height="56"
                      rx="2"
                      fill={
                        isPrayed
                          ? 'url(#cross-gold)'
                          : isActive
                            ? 'url(#cross-active-sapphire)'
                            : isMarian
                              ? 'url(#cross-marian)'
                              : 'url(#cross-wood)'
                      }
                      stroke={
                        isActive ? '#1E3A8A' : isMarian ? '#0F2B4C' : '#3A1C0C'
                      }
                      strokeWidth="1"
                    />
                    <rect
                      x={bead.x - 19}
                      y={bead.y - 12}
                      width="38"
                      height="10.5"
                      rx="2"
                      fill={
                        isPrayed
                          ? 'url(#cross-gold)'
                          : isActive
                            ? 'url(#cross-active-sapphire)'
                            : isMarian
                              ? 'url(#cross-marian)'
                              : 'url(#cross-wood)'
                      }
                      stroke={
                        isActive ? '#1E3A8A' : isMarian ? '#0F2B4C' : '#3A1C0C'
                      }
                      strokeWidth="1"
                    />
                  </g>

                  {isPrayed && (
                    <circle
                      cx={bead.x}
                      cy={bead.y - 6.7}
                      r="3"
                      fill="#FFFBEB"
                      pointerEvents="none"
                    />
                  )}
                </g>
              );
            }

            if (bead.kind === 'medal') {
              return (
                <g
                  key={bead.id}
                  className="rosary-bead-node cursor-pointer"
                  onClick={() => onSelectBead(bead.id)}
                  onDoubleClick={(e) => handleDoubleClick(e, bead.id)}
                  onPointerUp={(e) => handlePointerUp(e, bead)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${bead.label}. Estado: ${isPrayed ? 'Rezada' : 'Pendiente'}. Doble tap para marcar o desmarcar.`}
                  aria-pressed={isPrayed}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onToggleBeadPrayed(bead.id);
                    } else if (e.key === ' ') {
                      e.preventDefault();
                      onSelectBead(bead.id);
                    }
                  }}
                >
                  <circle cx={bead.x} cy={bead.y} r={22} fill="transparent" />
                  {isActive && (
                    <circle
                      cx={bead.x}
                      cy={bead.y}
                      r={19}
                      fill="none"
                      stroke={activeRingStroke}
                      strokeWidth="2.2"
                    />
                  )}
                  <ellipse
                    cx={bead.x}
                    cy={bead.y}
                    rx="13.5"
                    ry="16"
                    filter="url(#bead-shadow)"
                    fill={
                      isPrayed
                        ? 'url(#bead-gold)'
                        : isActive
                          ? 'url(#bead-active-sapphire)'
                          : '#D7C3A1'
                    }
                    stroke={
                      isPrayed ? '#784A04' : isActive ? '#1E3A8A' : '#7C5D3B'
                    }
                    strokeWidth="1.5"
                  />
                  <text
                    x={bead.x}
                    y={bead.y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={
                      isPrayed ? '#3B2303' : isActive ? '#FFFFFF' : '#4B341E'
                    }
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    pointerEvents="none"
                  >
                    {isPrayed ? '✓' : 'M'}
                  </text>
                </g>
              );
            }

            const radius = bead.kind === 'large' ? 10.6 : 7.4;
            const hitRadius = bead.kind === 'large' ? 14.5 : 10.8;

            const isMarianMysteryBead =
              isMarian && bead.kind === 'large' && bead.decadeIndex !== undefined;

            const unprayedFill = isMarian
              ? isMarianMysteryBead
                ? 'url(#bead-marian-silver)'
                : inActiveSection
                  ? 'url(#bead-marian-blue-section)'
                  : 'url(#bead-marian-blue)'
              : inActiveSection
                ? 'url(#bead-wood-section)'
                : 'url(#bead-wood)';

            const strokeColor = isPrayed
              ? '#784A04'
              : isActive
                ? activeRingStroke
                : isMarian
                  ? isMarianMysteryBead
                    ? '#475569'
                    : '#0F2B4C'
                  : '#3B1E0D';

            return (
              <g
                key={bead.id}
                className="rosary-bead-node cursor-pointer"
                onClick={() => onSelectBead(bead.id)}
                onDoubleClick={(e) => handleDoubleClick(e, bead.id)}
                onPointerUp={(e) => handlePointerUp(e, bead)}
                role="button"
                tabIndex={0}
                aria-label={`${bead.label}. Estado: ${isPrayed ? 'Rezada' : 'Pendiente'}. Doble tap para marcar o desmarcar.`}
                aria-pressed={isPrayed}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onToggleBeadPrayed(bead.id);
                  } else if (e.key === ' ') {
                    e.preventDefault();
                    onSelectBead(bead.id);
                  }
                }}
              >
                <circle cx={bead.x} cy={bead.y} r={hitRadius} fill="transparent" />

                {isActive && (
                  <circle
                    cx={bead.x}
                    cy={bead.y}
                    r={radius + 4.5}
                    fill="none"
                    stroke={activeRingStroke}
                    strokeWidth="2.2"
                  />
                )}

                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r={radius}
                  filter="url(#bead-shadow)"
                  fill={
                    isPrayed
                      ? 'url(#bead-gold)'
                      : isActive
                        ? 'url(#bead-active-sapphire)'
                        : unprayedFill
                  }
                  stroke={
                    isPrayed
                      ? '#784A04'
                      : isActive
                        ? '#1E3A8A'
                        : strokeColor
                  }
                  strokeWidth={isActive ? '1.8' : '0.9'}
                />

                {isPrayed && (
                  <path
                    d={`M ${bead.x - 3.2} ${bead.y + 0.2} L ${bead.x - 0.8} ${bead.y + 2.6} L ${bead.x + 3.4} ${bead.y - 2.4}`}
                    fill="none"
                    stroke="#3B2303"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Pie del lienzo con leyenda clara */}
      <div
        className={`pt-3 border-t ${dividerClass} flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C5248] dark:text-[#A9A29A]`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`w-3 h-3 rounded-full border inline-block ${
                isMarian
                  ? 'bg-[#1E5693] border-[#0F2B4C]'
                  : 'bg-[#6E3B1E] border-[#3B1E0D]'
              }`}
            />
            <span>Pendiente</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2563EB] border-2 border-[#1E3A8A] dark:border-[#93C5FD] inline-block" />
            <span>Rezando ahora (1 clic)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C98D26] border border-[#784A04] inline-flex items-center justify-center text-[8px] font-bold text-[#3B2303]">
              ✓
            </span>
            <span>Rezada (doble tap)</span>
          </span>
        </div>

        <div className="min-h-[18px] text-right font-medium text-[#1E3A5F] dark:text-[#93C5FD]">
          {lastFeedback ?? '1 clic para rezar · Doble tap para marcar o desmarcar'}
        </div>
      </div>
    </section>
  );
};
