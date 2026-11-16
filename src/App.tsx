import { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  FileDown,
  Moon,
  Plus,
  Sun,
  X,
} from 'lucide-react';
import { AddElementModal } from './components/AddElementModal';
import { CatholicFeastsCalendar } from './components/CatholicFeastsCalendar';
import { CustomElementsManager } from './components/CustomElementsManager';
import { DayMysteryBanner } from './components/DayMysteryBanner';
import { IntentionsPanel } from './components/IntentionsPanel';
import { MysteriesOverview } from './components/MysteriesOverview';
import { PrayerGuideBookletPanel } from './components/PrayerGuideBookletPanel';
import { PrayerGuidePanel } from './components/PrayerGuidePanel';
import { RosaryCanvas } from './components/RosaryCanvas';
import { TopMysteryBar } from './components/TopMysteryBar';
import {
  getDayLabel,
  getMysterySetsForRosary,
  getRecommendedMysteryForDay,
  ROSARY_DEFINITIONS,
} from './data/rosaryCatalog';
import {
  CustomElementKind,
  CustomPrayerElement,
  DayOfWeek,
  DolorososOrder,
  MysteryType,
  OpeningPrayerChoice,
  RosaryId,
  RosaryPersistedState,
  SectionId,
} from './types/rosary';
import { getRosaryGeometry } from './utils/rosaryGeometry';
import { downloadRosaryPdf, shareRosaryPdfViaWhatsApp } from './utils/rosaryPdf';
import { getInitialState, savePersistedState } from './utils/storage';

type AppTab = 'rosario' | 'guia' | 'misterios' | 'intenciones' | 'personalizar';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.77 14.07c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.91-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.38-5.16-4.58-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41 0 .59.01.19.01.44-.07.69.53.24.6.82 2.08.89 2.23.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.03 2.12 1.35 2.42 1.5.3.15.48.13.66-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.08.13.08.73-.16 1.41z" />
  </svg>
);

function formatLiveDateTime(date: Date): { dateText: string; timeText: string } {
  const rawDateText = date.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const dateText = rawDateText.charAt(0).toUpperCase() + rawDateText.slice(1);
  const timeText = date.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return { dateText, timeText };
}

export default function App() {
  const [state, setState] = useState<RosaryPersistedState>(() => getInitialState());
  const [activeTab, setActiveTab] = useState<AppTab>('rosario');
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());

  const [whatsappBanner, setWhatsappBanner] = useState<{
    fileName: string;
    whatsappUrl: string;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSectionId, setModalSectionId] = useState<SectionId>(1);
  const [editingElement, setEditingElement] = useState<CustomPrayerElement | null>(
    null
  );

  // Reloj en vivo (fecha y hora visible en la barra superior)
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Sincronizar clase .dark en <html> con el modo Día / Noche
  useEffect(() => {
    const root = document.documentElement;
    if (state.themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.themeMode]);

  // Persistencia automática en localStorage
  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  // Limpia el aviso breve de confirmación de doble tap tras unos segundos
  useEffect(() => {
    if (!lastFeedback) return;
    const timer = window.setTimeout(() => setLastFeedback(null), 2800);
    return () => window.clearTimeout(timer);
  }, [lastFeedback]);

  const activeRosaryId = state.activeRosaryId;
  const activeDefinition = ROSARY_DEFINITIONS[activeRosaryId];
  const currentProgress = state.progressByRosary[activeRosaryId];
  const { beads: activeRosaryBeads } = useMemo(
    () => getRosaryGeometry(activeRosaryId),
    [activeRosaryId]
  );

  const prayedBeadSet = useMemo(
    () => new Set(currentProgress.prayedBeadIds),
    [currentProgress.prayedBeadIds]
  );

  const completedCustomSet = useMemo(
    () => new Set(currentProgress.completedCustomElementIds),
    [currentProgress.completedCustomElementIds]
  );

  const prayedIntentionSet = useMemo(
    () => new Set(state.prayedIntentionIds),
    [state.prayedIntentionIds]
  );

  const activeBead = useMemo(
    () =>
      activeRosaryBeads.find((b) => b.id === currentProgress.activeBeadId) ??
      activeRosaryBeads[0],
    [activeRosaryBeads, currentProgress.activeBeadId]
  );

  const activeRosaryCustomElements = state.customElements;

  const customCountBySection = useMemo(() => {
    const counts: Record<number, number> = {};
    activeRosaryCustomElements.forEach((el) => {
      counts[el.sectionId] = (counts[el.sectionId] ?? 0) + 1;
    });
    return counts;
  }, [activeRosaryCustomElements]);

  const { dateText, timeText } = formatLiveDateTime(now);

  const handleToggleTheme = () => {
    setState((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'dark' ? 'light' : 'dark',
      hasCustomTheme: true,
    }));
  };

  const handleSelectDay = (day: DayOfWeek) => {
    const recommended = getRecommendedMysteryForDay(day);
    const sets = getMysterySetsForRosary(activeRosaryId);
    setState((prev) => ({
      ...prev,
      selectedDay: day,
      activeMystery: recommended,
    }));
    setLastFeedback(
      `${getDayLabel(day)}: asignados los ${sets[recommended].name}`
    );
  };

  const handleSelectMystery = (mystery: MysteryType) => {
    const sets = getMysterySetsForRosary(activeRosaryId, state.dolorososOrder);
    setState((prev) => ({
      ...prev,
      activeMystery: mystery,
    }));
    setLastFeedback(`Misterios activos: ${sets[mystery].name}`);
  };

  const handleUpdateDolorososOrder = (nextOrder: DolorososOrder) => {
    setState((prev) => ({
      ...prev,
      dolorososOrder: nextOrder,
    }));
    setLastFeedback('Orden de los Misterios Dolorosos actualizado');
  };

  const handleJumpToMysteryBead = (decadeNumber: 1 | 2 | 3 | 4 | 5) => {
    const targetBead = activeRosaryBeads.find(
      (b) => b.decadeIndex === decadeNumber && b.kind === 'large'
    );
    if (!targetBead) return;
    handleSelectBead(targetBead.id);
    setActiveTab('rosario');
  };

  const handleSelectBead = (beadId: string) => {
    const targetBead = activeRosaryBeads.find((b) => b.id === beadId);
    setState((prev) => ({
      ...prev,
      progressByRosary: {
        ...prev.progressByRosary,
        [activeRosaryId]: {
          ...prev.progressByRosary[activeRosaryId],
          activeBeadId: beadId,
        },
      },
    }));
    if (targetBead) {
      setLastFeedback(`Rezando ahora: ${targetBead.label}`);
    }
  };

  const handleToggleBeadPrayed = (beadId: string) => {
    const targetBead = activeRosaryBeads.find((b) => b.id === beadId);
    setState((prev) => {
      const progress = prev.progressByRosary[activeRosaryId];
      const exists = progress.prayedBeadIds.includes(beadId);
      const nextPrayed = exists
        ? progress.prayedBeadIds.filter((id) => id !== beadId)
        : [...progress.prayedBeadIds, beadId];

      setLastFeedback(
        exists
          ? `Desmarcada: ${targetBead?.label ?? 'Esfera'}`
          : `Marcada como rezada: ${targetBead?.label ?? 'Esfera'}`
      );

      return {
        ...prev,
        progressByRosary: {
          ...prev.progressByRosary,
          [activeRosaryId]: {
            ...progress,
            activeBeadId: beadId,
            prayedBeadIds: nextPrayed,
          },
        },
      };
    });
  };

  const handleSelectSection = (sectionId: SectionId) => {
    const firstBead = activeRosaryBeads.find((b) => b.sectionId === sectionId);
    if (!firstBead) return;
    handleSelectBead(firstBead.id);
    setActiveTab('rosario');
  };

  const handlePreviousBead = () => {
    const prevBead = activeRosaryBeads[activeBead.order - 1];
    if (prevBead) {
      handleSelectBead(prevBead.id);
    }
  };

  const handleNextBead = () => {
    const nextBead = activeRosaryBeads[activeBead.order + 1];
    if (nextBead) {
      handleSelectBead(nextBead.id);
    }
  };

  const handleMarkAndAdvance = () => {
    const nextBead = activeRosaryBeads[activeBead.order + 1];
    setState((prev) => {
      const progress = prev.progressByRosary[activeRosaryId];
      const alreadyPrayed = progress.prayedBeadIds.includes(activeBead.id);
      const nextPrayed = alreadyPrayed
        ? progress.prayedBeadIds
        : [...progress.prayedBeadIds, activeBead.id];

      return {
        ...prev,
        progressByRosary: {
          ...prev.progressByRosary,
          [activeRosaryId]: {
            ...progress,
            prayedBeadIds: nextPrayed,
            activeBeadId: nextBead ? nextBead.id : activeBead.id,
          },
        },
      };
    });

    setLastFeedback(
      nextBead
        ? `Rezada · Avanzando a ${nextBead.label}`
        : 'Has completado todas las cuentas de este Rosario'
    );
  };

  const handleResetProgress = () => {
    setState((prev) => ({
      ...prev,
      progressByRosary: {
        ...prev.progressByRosary,
        [activeRosaryId]: {
          prayedBeadIds: [],
          activeBeadId: 'cross',
          completedCustomElementIds: [],
        },
      },
    }));
    setLastFeedback('Progreso reiniciado al inicio del Rosario');
  };

  const handleChangeOpeningChoice = (choice: OpeningPrayerChoice) => {
    setState((prev) => ({
      ...prev,
      openingChoice: choice,
    }));
  };

  const handleDownloadPdf = () => {
    const fileName = downloadRosaryPdf({
      rosaryId: activeRosaryId,
      selectedDay: state.selectedDay,
      activeMystery: state.activeMystery,
      dolorososOrder: state.dolorososOrder,
      openingChoice: state.openingChoice,
      customElements: activeRosaryCustomElements,
      customIntentions: state.customIntentions,
    });
    setLastFeedback(`Guía PDF descargada: ${fileName}`);
  };

  const handleShareWhatsAppPdf = async () => {
    const result = await shareRosaryPdfViaWhatsApp({
      rosaryId: activeRosaryId,
      selectedDay: state.selectedDay,
      activeMystery: state.activeMystery,
      dolorososOrder: state.dolorososOrder,
      openingChoice: state.openingChoice,
      customElements: activeRosaryCustomElements,
      customIntentions: state.customIntentions,
    });

    if (result.mode === 'native-file-share') {
      setLastFeedback(`PDF compartido: ${result.fileName}`);
      setWhatsappBanner(null);
    } else {
      setWhatsappBanner({
        fileName: result.fileName,
        whatsappUrl: result.whatsappUrl,
      });
      setLastFeedback(`PDF listo (${result.fileName}) para enviar por WhatsApp`);
    }
  };

  const handleApplyFeastDay = (day: DayOfWeek, feastName: string) => {
    const recommended = getRecommendedMysteryForDay(day);
    const sets = getMysterySetsForRosary(activeRosaryId);
    setState((prev) => ({
      ...prev,
      selectedDay: day,
      activeMystery: recommended,
    }));
    setActiveTab('rosario');
    setLastFeedback(`${feastName}: ${getDayLabel(day)} (${sets[recommended].shortName})`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddModal = (sectionId: SectionId) => {
    setEditingElement(null);
    setModalSectionId(sectionId);
    setModalOpen(true);
  };

  const handleEditCustomElement = (element: CustomPrayerElement) => {
    setEditingElement(element);
    setModalSectionId(element.sectionId);
    setModalOpen(true);
  };

  const handleSaveCustomElement = (data: {
    id?: string;
    rosaryId: RosaryId;
    sectionId: SectionId;
    kind: CustomElementKind;
    title: string;
    content: string;
  }) => {
    setState((prev) => {
      if (data.id) {
        return {
          ...prev,
          customElements: prev.customElements.map((el) =>
            el.id === data.id
              ? {
                  ...el,
                  rosaryId: data.rosaryId,
                  sectionId: data.sectionId,
                  kind: data.kind,
                  title: data.title,
                  content: data.content,
                }
              : el
          ),
        };
      }

      const newItem: CustomPrayerElement = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        rosaryId: data.rosaryId,
        sectionId: data.sectionId,
        kind: data.kind,
        title: data.title,
        content: data.content,
        createdAt: Date.now(),
      };

      return {
        ...prev,
        customElements: [...prev.customElements, newItem],
      };
    });
    setLastFeedback(`Elemento guardado en la sección ${data.sectionId}`);
  };

  const handleDeleteCustomElement = (id: string) => {
    setState((prev) => ({
      ...prev,
      customElements: prev.customElements.filter((el) => el.id !== id),
      progressByRosary: {
        ...prev.progressByRosary,
        [activeRosaryId]: {
          ...prev.progressByRosary[activeRosaryId],
          completedCustomElementIds: prev.progressByRosary[
            activeRosaryId
          ].completedCustomElementIds.filter((cid) => cid !== id),
        },
      },
    }));
  };

  const handleToggleCustomElementDone = (id: string) => {
    setState((prev) => {
      const progress = prev.progressByRosary[activeRosaryId];
      const exists = progress.completedCustomElementIds.includes(id);
      return {
        ...prev,
        progressByRosary: {
          ...prev.progressByRosary,
          [activeRosaryId]: {
            ...progress,
            completedCustomElementIds: exists
              ? progress.completedCustomElementIds.filter((cid) => cid !== id)
              : [...progress.completedCustomElementIds, id],
          },
        },
      };
    });
  };

  const handleClearAllCustom = () => {
    setState((prev) => ({
      ...prev,
      customElements: [],
      progressByRosary: {
        ...prev.progressByRosary,
        [activeRosaryId]: {
          ...prev.progressByRosary[activeRosaryId],
          completedCustomElementIds: [],
        },
      },
    }));
  };

  const handleToggleIntentionPrayed = (id: string) => {
    setState((prev) => {
      const exists = prev.prayedIntentionIds.includes(id);
      return {
        ...prev,
        prayedIntentionIds: exists
          ? prev.prayedIntentionIds.filter((i) => i !== id)
          : [...prev.prayedIntentionIds, id],
      };
    });
  };

  const handleAddCustomIntention = (text: string) => {
    setState((prev) => ({
      ...prev,
      customIntentions: [
        ...prev.customIntentions,
        { id: `int-custom-${Date.now()}`, text, isCustom: true },
      ],
    }));
  };

  const handleDeleteCustomIntention = (id: string) => {
    setState((prev) => ({
      ...prev,
      customIntentions: prev.customIntentions.filter((i) => i.id !== id),
      prayedIntentionIds: prev.prayedIntentionIds.filter((pid) => pid !== id),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F1] dark:bg-[#111317] text-[#1F1A17] dark:text-[#F2ECE1] transition-colors">
      {/* Barra superior: título, navegación y reloj en vivo */}
      <header className="border-b border-[#E4DACB] dark:border-[#2C303A] bg-[#FBF8F1]/95 dark:bg-[#111317]/95 sticky top-0 z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('rosario')}
            className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#1F1A17] dark:text-[#F2ECE1] whitespace-nowrap shrink-0 cursor-pointer"
          >
            El Santo Rosario
          </button>

          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
          >
            {(
              [
                { id: 'rosario', label: 'Rosario' },
                { id: 'guia', label: 'Guía de rezo' },
                { id: 'misterios', label: 'Misterios' },
                { id: 'intenciones', label: 'Intenciones' },
                { id: 'personalizar', label: 'Personalizar' },
              ] as { id: AppTab; label: string }[]
            ).map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#B7791F] dark:border-[#E2A94C] text-[#1F1A17] dark:text-[#F2ECE1] font-semibold'
                      : 'border-transparent text-[#5C5248] dark:text-[#A9A29A] hover:text-[#1F1A17] dark:hover:text-[#F2ECE1]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#5C5248] dark:text-[#D5CEC2] tabular-nums whitespace-nowrap shrink-0"
            aria-label="Fecha y hora actual"
          >
            <Clock
              className="w-3.5 h-3.5 text-[#8B5A0B] dark:text-[#E2A94C] shrink-0"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">{dateText}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-semibold text-[#8B5A0B] dark:text-[#E2A94C]">
              {timeText}
            </span>
          </div>
        </div>

        {/* Navegación móvil */}
        <nav
          aria-label="Navegación móvil"
          className="flex lg:hidden border-t border-[#E4DACB] dark:border-[#2C303A] px-2 overflow-x-auto"
        >
          {(
            [
              { id: 'rosario', label: 'Rosario' },
              { id: 'guia', label: 'Guía de rezo' },
              { id: 'misterios', label: 'Misterios' },
              { id: 'intenciones', label: 'Intenciones' },
              { id: 'personalizar', label: 'Personalizar' },
            ] as { id: AppTab; label: string }[]
          ).map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 py-2 px-2 text-xs font-medium border-b-2 text-center whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-[#B7791F] dark:border-[#E2A94C] text-[#1F1A17] dark:text-[#F2ECE1] font-semibold'
                    : 'border-transparent text-[#5C5248] dark:text-[#A9A29A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Barra de acciones unificada: Día/Noche, Agregar rezo, PDF, Compartir y Cancionero */}
      <div className="border-b border-[#E4DACB] dark:border-[#2C303A] bg-[#F5EFE2] dark:bg-[#171B22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={
              state.themeMode === 'dark'
                ? 'Cambiar a modo día'
                : 'Cambiar a modo noche'
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-[#FBF8F1] dark:bg-[#1E232D] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#2A303D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {state.themeMode === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F5D57A]" aria-hidden="true" />
                <span>Día</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#1E3A5F]" aria-hidden="true" />
                <span>Noche</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal(activeBead.sectionId)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162C49] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Agregar rezo</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#C9B9A0] dark:border-[#363C49] bg-[#FBF8F1] dark:bg-[#1E232D] text-[#1F1A17] dark:text-[#F2ECE1] hover:bg-[#EFE7D8] dark:hover:bg-[#2A303D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-[#8B5A0B] dark:text-[#E2A94C]" aria-hidden="true" />
            <span>Guía de rezo en PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsAppPdf}
            aria-label="Compartir guía PDF por WhatsApp"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1F6E43] text-white hover:bg-[#185835] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Compartir</span>
            <WhatsAppIcon className="w-4 h-4" />
          </button>

          <a
            href="https://cancionero-san-francisco-chillan.ai.studio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir Cancionero Franciscano en nueva pestaña"
            className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold rounded-lg border border-[#5B88B8] dark:border-[#4B79A8] bg-[#FBF8F1] dark:bg-[#161B24] text-[#1E3A5F] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#232B38] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Cancionero</span>
          </a>
        </div>

        {/* Confirmación directa cuando el navegador descarga el PDF para adjuntar en WhatsApp */}
        {whatsappBanner && (
          <div className="border-t border-[#DFD3C0] dark:border-[#2C303A] bg-[#ECF7F0] dark:bg-[#13261C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#164E31] dark:text-[#A7F3D0]">
              <span>
                Se descargó <span className="font-semibold">{whatsappBanner.fileName}</span>. Abre WhatsApp y adjúntalo en tu chat.
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappBanner.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-md bg-[#1F6E43] text-white font-semibold hover:bg-[#185835] whitespace-nowrap"
                >
                  Abrir WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setWhatsappBanner(null)}
                  aria-label="Cerrar aviso de WhatsApp"
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'rosario' && (
          <>
            <TopMysteryBar
              rosaryId={activeRosaryId}
              selectedDay={state.selectedDay}
              activeMystery={state.activeMystery}
              dolorososOrder={state.dolorososOrder}
              activeBead={activeBead}
              openingChoice={state.openingChoice}
              onSelectMystery={handleSelectMystery}
              onUpdateDolorososOrder={handleUpdateDolorososOrder}
              onJumpToMysteryBead={handleJumpToMysteryBead}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <RosaryCanvas
                  rosaryId={activeRosaryId}
                  themeMode={state.themeMode}
                  activeBeadId={activeBead.id}
                  activeSectionId={activeBead.sectionId}
                  prayedBeadIds={prayedBeadSet}
                  customCountBySection={customCountBySection}
                  lastFeedback={lastFeedback}
                  onSelectBead={handleSelectBead}
                  onToggleBeadPrayed={handleToggleBeadPrayed}
                  onSelectSection={handleSelectSection}
                  onResetProgress={handleResetProgress}
                />
              </div>

              <div className="lg:col-span-5 space-y-5">
                <DayMysteryBanner
                  rosaryId={activeRosaryId}
                  selectedDay={state.selectedDay}
                  activeMystery={state.activeMystery}
                  dolorososOrder={state.dolorososOrder}
                  onSelectDay={handleSelectDay}
                  onSelectMystery={handleSelectMystery}
                />

                <PrayerGuidePanel
                  rosaryId={activeRosaryId}
                  activeBead={activeBead}
                  activeMystery={state.activeMystery}
                  dolorososOrder={state.dolorososOrder}
                  openingChoice={state.openingChoice}
                  isBeadPrayed={prayedBeadSet.has(activeBead.id)}
                  customElements={activeRosaryCustomElements}
                  completedCustomElementIds={completedCustomSet}
                  onChangeOpeningChoice={handleChangeOpeningChoice}
                  onToggleCurrentBeadPrayed={() =>
                    handleToggleBeadPrayed(activeBead.id)
                  }
                  onPreviousBead={handlePreviousBead}
                  onNextBead={handleNextBead}
                  onMarkAndAdvance={handleMarkAndAdvance}
                  onOpenAddModal={handleOpenAddModal}
                  onEditCustomElement={handleEditCustomElement}
                  onDeleteCustomElement={handleDeleteCustomElement}
                  onToggleCustomElementDone={handleToggleCustomElementDone}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'guia' && (
          <PrayerGuideBookletPanel
            rosaryId={activeRosaryId}
            activeMystery={state.activeMystery}
            dolorososOrder={state.dolorososOrder}
            onGoToSection={handleSelectSection}
            onSelectMysteryAndGo={(m) => {
              handleSelectMystery(m);
              setActiveTab('rosario');
            }}
            onDownloadPdf={handleDownloadPdf}
          />
        )}

        {activeTab === 'guia' && (
          <PrayerGuideBookletPanel
            rosaryId={activeRosaryId}
            activeMystery={state.activeMystery}
            dolorososOrder={state.dolorososOrder}
            onGoToSection={handleSelectSection}
            onSelectMysteryAndGo={(m) => {
              handleSelectMystery(m);
              setActiveTab('rosario');
            }}
            onDownloadPdf={handleDownloadPdf}
          />
        )}

        {activeTab === 'misterios' && (
          <MysteriesOverview
            rosaryId={activeRosaryId}
            selectedDay={state.selectedDay}
            activeMystery={state.activeMystery}
            dolorososOrder={state.dolorososOrder}
            onSelectMysteryAndGo={(m) => {
              handleSelectMystery(m);
              setActiveTab('rosario');
            }}
          />
        )}

        {activeTab === 'intenciones' && (
          <IntentionsPanel
            customIntentions={state.customIntentions}
            prayedIntentionIds={prayedIntentionSet}
            onToggleIntentionPrayed={handleToggleIntentionPrayed}
            onAddCustomIntention={handleAddCustomIntention}
            onDeleteCustomIntention={handleDeleteCustomIntention}
          />
        )}

        {activeTab === 'personalizar' && (
          <CustomElementsManager
            rosaryId={activeRosaryId}
            customElements={activeRosaryCustomElements}
            onOpenAddModal={handleOpenAddModal}
            onEditElement={handleEditCustomElement}
            onDeleteElement={handleDeleteCustomElement}
            onGoToSection={handleSelectSection}
            onClearAllCustom={handleClearAllCustom}
          />
        )}

        {/* Calendario de próximas fiestas religiosas católicas en la parte final */}
        <CatholicFeastsCalendar
          rosaryId={activeRosaryId}
          now={now}
          onApplyFeastDay={handleApplyFeastDay}
        />
      </main>

      {/* Pie discreto con atribución del material activo */}
      <footer className="border-t border-[#E4DACB] dark:border-[#2C303A] bg-[#F6F1E6] dark:bg-[#171B22] py-4 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5C5248] dark:text-[#A9A29A] text-center sm:text-left">
          <p>{activeDefinition.sourceLabel}</p>
          <p className="italic">{activeDefinition.footerNote}</p>
        </div>
      </footer>

      <AddElementModal
        isOpen={modalOpen}
        rosaryId={activeRosaryId}
        initialSectionId={modalSectionId}
        editingElement={editingElement}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCustomElement}
      />
    </div>
  );
}
