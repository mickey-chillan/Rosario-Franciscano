import { RosaryBead, RosaryId, SectionId } from '../types/rosary';

export const ROSARY_VIEWBOX_WIDTH = 780;
export const ROSARY_VIEWBOX_HEIGHT = 840;

const CX = 390;
const CY = 310;
const RX = 236;
const RY = 270;

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function pointOnLoop(deg: number, cx = CX, cy = CY, rx = RX, ry = RY): { x: number; y: number } {
  const rad = degToRad(deg);
  return {
    x: Number((cx + rx * Math.cos(rad)).toFixed(1)),
    y: Number((cy + ry * Math.sin(rad)).toFixed(1)),
  };
}

export interface SectionCalloutAnchor {
  sectionId: SectionId;
  shortTag: string;
  x: number;
  y: number;
  align: 'start' | 'middle' | 'end';
}

export interface DirectionArrowPath {
  id: string;
  d: string;
}

// ---------------------------------------------------------------------------
// 1. SANTO ROSARIO TRADICIONAL (Antihorario, medallón central + 59 cuentas/cruz)
// ---------------------------------------------------------------------------

export function buildChileRosaryBeads(): RosaryBead[] {
  const beads: RosaryBead[] = [];
  let order = 0;

  beads.push({
    id: 'cross',
    order: order++,
    sectionId: 1,
    kind: 'cross',
    x: CX,
    y: 804,
    label: 'Señal de la Cruz y Credo',
    shortCounter: 'Paso 1',
  });

  beads.push({
    id: 'intro-pn',
    order: order++,
    sectionId: 2,
    kind: 'large',
    x: CX,
    y: 736,
    label: 'Padre Nuestro inicial',
    shortCounter: 'Paso 2',
  });

  const introYs = [694, 660, 626];
  introYs.forEach((y, idx) => {
    beads.push({
      id: `intro-am-${idx + 1}`,
      order: order++,
      sectionId: 3,
      kind: 'small',
      x: CX,
      y,
      label: `Avemaría inicial ${idx + 1} de 3`,
      shortCounter: `${idx + 1}/3`,
      aveMariaIndex: idx + 1,
      isEndOfDecade: idx === 2,
    });
  });

  const decadeStartAngles = [66, 3.5, -59, -121.5, -184];
  const mysterySectionPairs: Array<{ pnSection: SectionId; amSection: SectionId }> = [
    { pnSection: 4, amSection: 5 },
    { pnSection: 6, amSection: 7 },
    { pnSection: 8, amSection: 9 },
    { pnSection: 10, amSection: 11 },
    { pnSection: 12, amSection: 13 },
  ];

  decadeStartAngles.forEach((pnDeg, dIdx) => {
    const decadeNumber = (dIdx + 1) as 1 | 2 | 3 | 4 | 5;
    const { pnSection, amSection } = mysterySectionPairs[dIdx];
    const pnPos = pointOnLoop(pnDeg);

    beads.push({
      id: `m${decadeNumber}-pn`,
      order: order++,
      sectionId: pnSection,
      kind: 'large',
      x: pnPos.x,
      y: pnPos.y,
      label: `${decadeNumber}.º Misterio y Padre Nuestro`,
      shortCounter: `M${decadeNumber}`,
      decadeIndex: decadeNumber,
    });

    const firstAmDeg = pnDeg - 9.5;
    const amSpanDeg = 44;
    const amStepDeg = amSpanDeg / 9;

    for (let i = 0; i < 10; i++) {
      const deg = firstAmDeg - i * amStepDeg;
      const pos = pointOnLoop(deg);
      beads.push({
        id: `m${decadeNumber}-am-${i + 1}`,
        order: order++,
        sectionId: amSection,
        kind: 'small',
        x: pos.x,
        y: pos.y,
        label: `Misterio ${decadeNumber} · Avemaría ${i + 1} de 10`,
        shortCounter: `${i + 1}/10`,
        decadeIndex: decadeNumber,
        aveMariaIndex: i + 1,
        isEndOfDecade: i === 9,
      });
    }
  });

  const medalPos = pointOnLoop(90);
  beads.push({
    id: 'salve',
    order: order++,
    sectionId: 14,
    kind: 'medal',
    x: medalPos.x,
    y: medalPos.y,
    label: 'Rezar La Salve',
    shortCounter: 'Salve',
  });

  return beads;
}

export const ROSARY_BEADS: RosaryBead[] = buildChileRosaryBeads();

export function getRosaryCordPath(): string {
  const loopPoints: string[] = [];
  for (let deg = 90; deg >= -270; deg -= 4) {
    const p = pointOnLoop(deg);
    loopPoints.push(`${deg === 90 ? 'M' : 'L'} ${p.x} ${p.y}`);
  }
  const stemStart = pointOnLoop(90);
  return `${loopPoints.join(' ')} Z M ${stemStart.x} ${stemStart.y} L ${CX} 786`;
}

export const SECTION_CALLOUT_ANCHORS: SectionCalloutAnchor[] = [
  { sectionId: 1, shortTag: '1) Cruz y Credo', x: 438, y: 808, align: 'start' },
  { sectionId: 2, shortTag: '2) Padrenuestro', x: 422, y: 740, align: 'start' },
  { sectionId: 3, shortTag: '3) 3 Avemarías', x: 422, y: 664, align: 'start' },
  { sectionId: 4, shortTag: '4) 1.er Misterio', x: 508, y: 576, align: 'start' },
  { sectionId: 5, shortTag: '5) 10 Avemarías', x: 616, y: 472, align: 'start' },
  { sectionId: 6, shortTag: '6) 2.º Misterio', x: 654, y: 330, align: 'start' },
  { sectionId: 7, shortTag: '7) 10 Avemarías', x: 628, y: 178, align: 'start' },
  { sectionId: 8, shortTag: '8) 3.er Misterio', x: 534, y: 66, align: 'start' },
  { sectionId: 9, shortTag: '9) 10 Avemarías', x: 390, y: 20, align: 'middle' },
  { sectionId: 10, shortTag: '10) 4.º Misterio', x: 244, y: 66, align: 'end' },
  { sectionId: 11, shortTag: '11) 10 Avemarías', x: 150, y: 178, align: 'end' },
  { sectionId: 12, shortTag: '12) 5.º Misterio', x: 126, y: 332, align: 'end' },
  { sectionId: 13, shortTag: '13) 10 Avemarías', x: 168, y: 472, align: 'end' },
  { sectionId: 14, shortTag: '14) La Salve', x: 348, y: 602, align: 'end' },
];

// ---------------------------------------------------------------------------
// 2. MES DE MARÍA 2026 (Sentido horario según guía adjunta, 61 cuentas/cruz)
// ---------------------------------------------------------------------------

const MM_CY = 252;
const MM_RY = 198;

export function buildMesDeMariaBeads(): RosaryBead[] {
  const beads: RosaryBead[] = [];
  let order = 0;

  // 1) Cruz y Credo
  beads.push({
    id: 'cross',
    order: order++,
    sectionId: 1,
    kind: 'cross',
    x: CX,
    y: 672,
    label: 'Cruz y Credo',
    shortCounter: 'Credo',
  });

  // 2) Padre Nuestro inicial
  beads.push({
    id: 'intro-pn',
    order: order++,
    sectionId: 2,
    kind: 'large',
    x: CX,
    y: 610,
    label: 'Padre Nuestro inicial',
    shortCounter: 'Paso 2',
  });

  // 3) 3 Ave María
  const mmIntroYs = [576, 554, 532];
  mmIntroYs.forEach((y, idx) => {
    beads.push({
      id: `intro-am-${idx + 1}`,
      order: order++,
      sectionId: 3,
      kind: 'small',
      x: CX,
      y,
      label: `Ave María inicial ${idx + 1} de 3`,
      shortCounter: `${idx + 1}/3`,
      aveMariaIndex: idx + 1,
    });
  });

  // 4) Gloria inicial (cuenta grande previa a la corona)
  beads.push({
    id: 'intro-gloria',
    order: order++,
    sectionId: 4,
    kind: 'large',
    x: CX,
    y: 496,
    label: 'Gloria inicial',
    shortCounter: 'Gloria',
  });

  // 5..14) 5 Misterios en sentido HORARIO (ángulos crecientes desde 90° en la unión)
  const mmDecades: Array<{
    mysteryAngle: number;
    amStartAngle: number;
    amEndAngle: number;
    pnSection: SectionId;
    amSection: SectionId;
  }> = [
    { mysteryAngle: 90, amStartAngle: 105, amEndAngle: 157, pnSection: 5, amSection: 6 },
    { mysteryAngle: 172, amStartAngle: 186, amEndAngle: 224, pnSection: 7, amSection: 8 },
    { mysteryAngle: 238, amStartAngle: 251, amEndAngle: 289, pnSection: 9, amSection: 10 },
    { mysteryAngle: 302, amStartAngle: 316, amEndAngle: 354, pnSection: 11, amSection: 12 },
    { mysteryAngle: 368, amStartAngle: 383, amEndAngle: 435, pnSection: 13, amSection: 14 },
  ];

  mmDecades.forEach((dec, idx) => {
    const decadeNumber = (idx + 1) as 1 | 2 | 3 | 4 | 5;
    const pnPos = pointOnLoop(dec.mysteryAngle, CX, MM_CY, RX, MM_RY);

    beads.push({
      id: `m${decadeNumber}-pn`,
      order: order++,
      sectionId: dec.pnSection,
      kind: 'large',
      x: pnPos.x,
      y: pnPos.y,
      label: `Anunciar el ${decadeNumber}.º Misterio y Padre Nuestro`,
      shortCounter: `M${decadeNumber}`,
      decadeIndex: decadeNumber,
    });

    const step = (dec.amEndAngle - dec.amStartAngle) / 9;
    for (let i = 0; i < 10; i++) {
      const deg = dec.amStartAngle + i * step;
      const pos = pointOnLoop(deg, CX, MM_CY, RX, MM_RY);
      beads.push({
        id: `m${decadeNumber}-am-${i + 1}`,
        order: order++,
        sectionId: dec.amSection,
        kind: 'small',
        x: pos.x,
        y: pos.y,
        label: `Misterio ${decadeNumber} · Ave María ${i + 1} de 10`,
        shortCounter: `${i + 1}/10`,
        decadeIndex: decadeNumber,
        aveMariaIndex: i + 1,
        isEndOfDecade: i === 9,
      });
    }
  });

  return beads;
}

export const MES_DE_MARIA_BEADS: RosaryBead[] = buildMesDeMariaBeads();

export function getMesDeMariaCordPath(): string {
  const loopPoints: string[] = [];
  for (let deg = 90; deg <= 450; deg += 4) {
    const p = pointOnLoop(deg, CX, MM_CY, RX, MM_RY);
    loopPoints.push(`${deg === 90 ? 'M' : 'L'} ${p.x} ${p.y}`);
  }
  const stemStart = pointOnLoop(90, CX, MM_CY, RX, MM_RY);
  return `${loopPoints.join(' ')} Z M ${stemStart.x} ${stemStart.y} L ${CX} 652`;
}

export const MES_DE_MARIA_CALLOUT_ANCHORS: SectionCalloutAnchor[] = [
  { sectionId: 1, shortTag: '1) Credo', x: 378, y: 676, align: 'start' },
  { sectionId: 2, shortTag: '2) Padre Nuestro', x: 368, y: 614, align: 'start' },
  { sectionId: 3, shortTag: '3) 3 Ave María', x: 368, y: 558, align: 'start' },
  { sectionId: 4, shortTag: '4) Gloria', x: 368, y: 500, align: 'start' },
  { sectionId: 5, shortTag: '5) 1.er Misterio', x: 314, y: 476, align: 'end' },
  { sectionId: 6, shortTag: '6) 10 Ave María', x: 204, y: 424, align: 'end' },
  { sectionId: 7, shortTag: '7) 2.º Misterio', x: 152, y: 284, align: 'end' },
  { sectionId: 8, shortTag: '8) 10 Ave María', x: 174, y: 168, align: 'end' },
  { sectionId: 9, shortTag: '9) 3.er Misterio', x: 230, y: 74, align: 'end' },
  { sectionId: 10, shortTag: '10) 10 Ave María', x: 340, y: 26, align: 'middle' },
  { sectionId: 11, shortTag: '11) 4.º Misterio', x: 450, y: 74, align: 'start' },
  { sectionId: 12, shortTag: '12) 10 Ave María', x: 506, y: 168, align: 'start' },
  { sectionId: 13, shortTag: '13) 5.º Misterio', x: 528, y: 284, align: 'start' },
  { sectionId: 14, shortTag: '14) 10 Ave María', x: 476, y: 424, align: 'start' },
];

export const MES_DE_MARIA_ARROWS: DirectionArrowPath[] = [
  // Curva desde la Cruz hacia arriba
  { id: 'arrow-cross', d: 'M 384 654 Q 408 648 408 620' },
  // Curva sentido horario en la primera decena (abajo izquierda subiendo)
  { id: 'arrow-dec1', d: 'M 218 446 Q 192 430 184 398' },
  // Curva sentido horario en la corona superior (izquierda a derecha)
  { id: 'arrow-top', d: 'M 314 38 Q 340 28 366 38' },
  // Curva sentido horario bajando por la derecha
  { id: 'arrow-dec4', d: 'M 526 206 Q 536 228 526 250' },
];

export function getRosaryGeometry(rosaryId: RosaryId): {
  beads: RosaryBead[];
  cordPath: string;
  callouts: SectionCalloutAnchor[];
  arrows: DirectionArrowPath[];
} {
  if (rosaryId === 'mes-de-maria-2026') {
    return {
      beads: MES_DE_MARIA_BEADS,
      cordPath: getMesDeMariaCordPath(),
      callouts: MES_DE_MARIA_CALLOUT_ANCHORS,
      arrows: MES_DE_MARIA_ARROWS,
    };
  }
  return {
    beads: ROSARY_BEADS,
    cordPath: getRosaryCordPath(),
    callouts: SECTION_CALLOUT_ANCHORS,
    arrows: [],
  };
}
