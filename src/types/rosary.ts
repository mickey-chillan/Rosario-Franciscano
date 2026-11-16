export type RosaryId = 'mes-de-maria-2026' | 'un-rosario-por-chile';

export type DayOfWeek =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export type MysteryType = 'gozosos' | 'luminosos' | 'dolorosos' | 'gloriosos';

export type OpeningPrayerChoice = 'credo' | 'contricion';

export type BeadKind = 'cross' | 'large' | 'small' | 'medal';

export type SectionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface RosaryDefinition {
  id: RosaryId;
  name: string;
  shortName: string;
  subtitle: string;
  sourceLabel: string;
  directionLabel: string;
  footerNote: string;
  theme: 'marian' | 'classic';
}

export interface MysteryItem {
  number: 1 | 2 | 3 | 4 | 5;
  originalNumber?: 1 | 2 | 3 | 4 | 5;
  title: string;
  scriptureRef: string;
  gospelText: string;
  pauseNote: string;
}

export interface MysterySet {
  id: MysteryType;
  name: string;
  shortName: string;
  daysLabel: string;
  days: DayOfWeek[];
  subtitle: string;
  mysteries: MysteryItem[];
}

export interface RosarySection {
  id: SectionId;
  title: string;
  shortLabel: string;
  description: string;
  decadeIndex?: 1 | 2 | 3 | 4 | 5;
  prayerType:
    | 'opening'
    | 'intro-padrenuestro'
    | 'intro-avemarias'
    | 'intro-gloria'
    | 'mystery-padrenuestro'
    | 'decade-avemarias'
    | 'closing-salve';
}

export interface RosaryBead {
  id: string;
  order: number;
  sectionId: SectionId;
  kind: BeadKind;
  x: number;
  y: number;
  label: string;
  shortCounter?: string;
  decadeIndex?: 1 | 2 | 3 | 4 | 5;
  aveMariaIndex?: number;
  isEndOfDecade?: boolean;
}

export type CustomElementKind = 'rezo' | 'meditacion' | 'intencion' | 'elemento';

export interface CustomPrayerElement {
  id: string;
  rosaryId?: RosaryId;
  sectionId: SectionId;
  kind: CustomElementKind;
  title: string;
  content: string;
  createdAt: number;
}

export interface DailyIntention {
  id: string;
  text: string;
  isCustom?: boolean;
}

export interface RosaryProgress {
  prayedBeadIds: string[];
  activeBeadId: string;
  completedCustomElementIds: string[];
}

export type ThemeMode = 'light' | 'dark';

export type DolorososOrder = (1 | 2 | 3 | 4 | 5)[];

export interface RosaryPersistedState {
  activeRosaryId: RosaryId;
  selectedDay: DayOfWeek;
  activeMystery: MysteryType;
  dolorososOrder: DolorososOrder;
  openingChoice: OpeningPrayerChoice;
  themeMode: ThemeMode;
  hasCustomTheme?: boolean;
  progressByRosary: Record<RosaryId, RosaryProgress>;
  customElements: CustomPrayerElement[];
  customIntentions: DailyIntention[];
  prayedIntentionIds: string[];
}
