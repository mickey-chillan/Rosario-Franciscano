import {
  DEFAULT_DOLOROSOS_ORDER,
  getRecommendedMysteryForDay,
  getTodayDayOfWeek,
} from '../data/rosaryCatalog';
import {
  DolorososOrder,
  RosaryId,
  RosaryPersistedState,
  RosaryProgress,
} from '../types/rosary';

const STORAGE_KEY = 'el_santo_rosario_state_v2';
const LEGACY_STORAGE_KEY = 'el_santo_rosario_state_v1';

const EMPTY_PROGRESS: RosaryProgress = {
  prayedBeadIds: [],
  activeBeadId: 'cross',
  completedCustomElementIds: [],
};

function sanitizeDolorososOrder(order: unknown): DolorososOrder {
  if (!Array.isArray(order) || order.length !== 5) {
    return [...DEFAULT_DOLOROSOS_ORDER];
  }
  const nums = order.map((n) => Number(n));
  const valid =
    [1, 2, 3, 4, 5].every((expected) => nums.includes(expected)) &&
    new Set(nums).size === 5;
  return valid ? (nums as DolorososOrder) : [...DEFAULT_DOLOROSOS_ORDER];
}

export function getInitialState(): RosaryPersistedState {
  const today = getTodayDayOfWeek();
  const defaultState: RosaryPersistedState = {
    activeRosaryId: 'un-rosario-por-chile',
    selectedDay: today,
    activeMystery: getRecommendedMysteryForDay(today),
    dolorososOrder: [...DEFAULT_DOLOROSOS_ORDER],
    openingChoice: 'credo',
    themeMode: 'dark',
    hasCustomTheme: false,
    progressByRosary: {
      'mes-de-maria-2026': { ...EMPTY_PROGRESS },
      'un-rosario-por-chile': { ...EMPTY_PROGRESS },
    },
    customElements: [],
    customIntentions: [],
    prayedIntentionIds: [],
  };

  try {
    const rawV2 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<RosaryPersistedState>;
      const validRosaryId: RosaryId = 'un-rosario-por-chile';
      const hasCustomTheme = Boolean(parsed.hasCustomTheme);

      return {
        ...defaultState,
        ...parsed,
        activeRosaryId: validRosaryId,
        dolorososOrder: sanitizeDolorososOrder(parsed.dolorososOrder),
        hasCustomTheme,
        themeMode: hasCustomTheme
          ? parsed.themeMode === 'light'
            ? 'light'
            : 'dark'
          : 'dark',
        progressByRosary: {
          'mes-de-maria-2026': {
            ...EMPTY_PROGRESS,
            ...(parsed.progressByRosary?.['mes-de-maria-2026'] ?? {}),
          },
          'un-rosario-por-chile': {
            ...EMPTY_PROGRESS,
            ...(parsed.progressByRosary?.['un-rosario-por-chile'] ?? {}),
          },
        },
        customElements: Array.isArray(parsed.customElements)
          ? parsed.customElements
          : [],
        customIntentions: Array.isArray(parsed.customIntentions)
          ? parsed.customIntentions
          : [],
        prayedIntentionIds: Array.isArray(parsed.prayedIntentionIds)
          ? parsed.prayedIntentionIds
          : [],
      };
    }

    // Migrar datos previos de v1 si existían
    const rawV1 = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawV1) {
      const legacy = JSON.parse(rawV1) as {
        selectedDay?: RosaryPersistedState['selectedDay'];
        activeMystery?: RosaryPersistedState['activeMystery'];
        openingChoice?: RosaryPersistedState['openingChoice'];
        prayedBeadIds?: string[];
        activeBeadId?: string;
        customElements?: RosaryPersistedState['customElements'];
        completedCustomElementIds?: string[];
        customIntentions?: RosaryPersistedState['customIntentions'];
        prayedIntentionIds?: string[];
      };

      return {
        ...defaultState,
        selectedDay: legacy.selectedDay ?? defaultState.selectedDay,
        activeMystery: legacy.activeMystery ?? defaultState.activeMystery,
        openingChoice: legacy.openingChoice ?? 'credo',
        progressByRosary: {
          'mes-de-maria-2026': { ...EMPTY_PROGRESS },
          'un-rosario-por-chile': {
            prayedBeadIds: Array.isArray(legacy.prayedBeadIds)
              ? legacy.prayedBeadIds
              : [],
            activeBeadId: legacy.activeBeadId ?? 'cross',
            completedCustomElementIds: Array.isArray(legacy.completedCustomElementIds)
              ? legacy.completedCustomElementIds
              : [],
          },
        },
        customElements: Array.isArray(legacy.customElements)
          ? legacy.customElements.map((el) => ({
              ...el,
              rosaryId: el.rosaryId ?? 'un-rosario-por-chile',
            }))
          : [],
        customIntentions: Array.isArray(legacy.customIntentions)
          ? legacy.customIntentions
          : [],
        prayedIntentionIds: Array.isArray(legacy.prayedIntentionIds)
          ? legacy.prayedIntentionIds
          : [],
      };
    }

    return defaultState;
  } catch {
    return defaultState;
  }
}

export function savePersistedState(state: RosaryPersistedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignorar errores de cuota de almacenamiento
  }
}
