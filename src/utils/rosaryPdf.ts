import { jsPDF } from 'jspdf';
import {
  DEFAULT_DAILY_INTENTIONS,
  getDayLabel,
  getMysterySetsForRosary,
  getSectionsForRosary,
  PRAYERS,
  ROSARY_DEFINITIONS,
} from '../data/rosaryCatalog';
import {
  CustomPrayerElement,
  DailyIntention,
  DayOfWeek,
  DolorososOrder,
  MysteryType,
  OpeningPrayerChoice,
  RosaryId,
} from '../types/rosary';

export interface RosaryPdfInput {
  rosaryId: RosaryId;
  selectedDay: DayOfWeek;
  activeMystery: MysteryType;
  dolorososOrder?: DolorososOrder;
  openingChoice: OpeningPrayerChoice;
  customElements: CustomPrayerElement[];
  customIntentions: DailyIntention[];
}

function buildPdfDocument(input: RosaryPdfInput): {
  doc: jsPDF;
  fileName: string;
  shareSummary: string;
} {
  const definition = ROSARY_DEFINITIONS[input.rosaryId];
  const mysterySet = getMysterySetsForRosary(
    input.rosaryId,
    input.dolorososOrder
  )[input.activeMystery];
  const sections = getSectionsForRosary(input.rosaryId);
  const dayLabel = getDayLabel(input.selectedDay);
  const isMarian = input.rosaryId === 'mes-de-maria-2026';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  const writeParagraph = (
    text: string,
    fontSize = 10.5,
    fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
    color: [number, number, number] = [31, 26, 23],
    lineHeight = 5.2
  ) => {
    doc.setFont('times', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(lineHeight + 2);
      doc.text(line, margin, y);
      y += lineHeight;
    });
  };

  // Encabezado del documento
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(110, 59, 30);
  doc.text('Santo Rosario — Guía de Rezo', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(92, 82, 72);
  doc.text(`Día: ${dayLabel} · ${mysterySet.name}`, margin, y);
  y += 4;

  doc.setDrawColor(210, 198, 180);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Bloque de los 5 misterios del día con pasajes del Evangelio
  writeParagraph(
    `${mysterySet.name} (${mysterySet.daysLabel})`,
    13,
    'bold',
    [31, 26, 23],
    6.5
  );
  writeParagraph(mysterySet.subtitle, 9.8, 'italic', [92, 82, 72], 4.8);
  y += 1.5;
  mysterySet.mysteries.forEach((m) => {
    writeParagraph(
      `${m.number}º ${m.title} (${m.scriptureRef})`,
      10.5,
      'bold',
      [44, 36, 30],
      5.2
    );
    writeParagraph(
      `${m.gospelText} ${m.pauseNote}`,
      9.8,
      'normal',
      [60, 50, 42],
      4.7
    );
    y += 1;
  });
  y += 4;

  // Guía paso a paso de las 14 secciones
  writeParagraph(
    'Cómo rezarlo (14 secciones)',
    13,
    'bold',
    [31, 26, 23],
    6.5
  );

  sections.forEach((sec) => {
    ensureSpace(16);
    writeParagraph(sec.title, 11, 'bold', [30, 58, 95], 5.6);
    writeParagraph(sec.description, 9.5, 'italic', [92, 82, 72], 4.6);

    if (sec.prayerType === 'opening') {
      writeParagraph(
        `Señal de la Cruz: ${PRAYERS.senalDeLaCruz.text}`,
        10,
        'normal',
        [31, 26, 23],
        4.9
      );
      const openingPrayer =
        input.openingChoice === 'credo'
          ? PRAYERS.credo
          : PRAYERS.actoDeContricion;
      writeParagraph(
        `${openingPrayer.title}: ${openingPrayer.text}`,
        10,
        'normal',
        [31, 26, 23],
        4.9
      );
    } else if (
      sec.prayerType === 'intro-padrenuestro' ||
      sec.prayerType === 'mystery-padrenuestro'
    ) {
      if (sec.decadeIndex) {
        const mystery = mysterySet.mysteries.find(
          (m) => m.number === sec.decadeIndex
        );
        if (mystery) {
          writeParagraph(
            `Anuncio del ${mystery.number}.º Misterio: ${mystery.title} (${mystery.scriptureRef})`,
            10,
            'bold',
            [139, 90, 11],
            5
          );
          writeParagraph(
            `${mystery.gospelText} ${mystery.pauseNote}`,
            9.5,
            'italic',
            [70, 58, 48],
            4.6
          );
        }
      }
      writeParagraph(
        `Padre Nuestro: ${PRAYERS.padreNuestro.text}`,
        10,
        'normal',
        [31, 26, 23],
        4.9
      );
    } else if (sec.prayerType === 'intro-gloria') {
      writeParagraph(
        `Gloria: ${PRAYERS.gloria.text}`,
        10,
        'normal',
        [31, 26, 23],
        4.9
      );
    } else if (
      sec.prayerType === 'intro-avemarias' ||
      sec.prayerType === 'decade-avemarias'
    ) {
      writeParagraph(
        `Ave María: ${PRAYERS.aveMaria.text}`,
        10,
        'normal',
        [31, 26, 23],
        4.9
      );
      if (!isMarian || sec.prayerType === 'decade-avemarias') {
        writeParagraph(
          `Gloria: ${PRAYERS.gloria.text}`,
          9.8,
          'normal',
          [60, 50, 42],
          4.7
        );
      }
      if (!isMarian && sec.prayerType === 'decade-avemarias') {
        writeParagraph(
          `Oración de Fátima: ${PRAYERS.oracionDeFatima.text}`,
          9.8,
          'normal',
          [60, 50, 42],
          4.7
        );
      }
      if (isMarian && sec.id === 14) {
        writeParagraph(
          `Cierre opcional — Salve: ${PRAYERS.salve.text}`,
          9.8,
          'normal',
          [60, 50, 42],
          4.7
        );
      }
    } else if (sec.prayerType === 'closing-salve') {
      writeParagraph(
        `Salve: ${PRAYERS.salve.text}`,
        10,
        'normal',
        [31, 26, 23],
        4.9
      );
    }

    const sectionCustoms = input.customElements.filter(
      (el) => el.sectionId === sec.id
    );
    sectionCustoms.forEach((el) => {
      writeParagraph(
        `[+] ${el.title}: ${el.content}`,
        9.8,
        'italic',
        [30, 58, 95],
        4.8
      );
    });

    y += 2.5;
  });

  // Intenciones diarias
  ensureSpace(24);
  y += 2;
  writeParagraph(
    'Intenciones de Oración',
    13,
    'bold',
    [31, 26, 23],
    6.5
  );
  const allIntentions = [...DEFAULT_DAILY_INTENTIONS, ...input.customIntentions];
  allIntentions.forEach((intItem, idx) => {
    writeParagraph(
      `${idx + 1}. ${intItem.text}`,
      9.8,
      'normal',
      [44, 36, 30],
      4.8
    );
  });

  // Pie de página en todas las páginas
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 110, 100);
    doc.text(
      `${definition.name} · Página ${p} de ${pageCount}`,
      margin,
      pageHeight - 10
    );
  }

  const safeDay = dayLabel.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fileName = `Guia_Santo_Rosario_${safeDay}.pdf`;

  const mysteriesSummary = mysterySet.mysteries
    .map((m) => `${m.number}º ${m.title} (${m.scriptureRef})`)
    .join('\n');

  const shareSummary = [
    `*Santo Rosario — Guía de Rezo*`,
    `Día: ${dayLabel} (${mysterySet.name})`,
    '',
    mysteriesSummary,
    '',
    'Te comparto la guía completa en PDF para rezar el Santo Rosario.',
  ].join('\n');

  return { doc, fileName, shareSummary };
}

export function downloadRosaryPdf(input: RosaryPdfInput): string {
  const { doc, fileName } = buildPdfDocument(input);
  doc.save(fileName);
  return fileName;
}

export async function shareRosaryPdfViaWhatsApp(input: RosaryPdfInput): Promise<{
  mode: 'native-file-share' | 'downloaded-with-link';
  fileName: string;
  whatsappUrl: string;
}> {
  const { doc, fileName, shareSummary } = buildPdfDocument(input);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareSummary)}`;

  const blob = doc.output('blob');
  const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };

  if (
    typeof navigator.share === 'function' &&
    typeof nav.canShare === 'function' &&
    nav.canShare({ files: [pdfFile] })
  ) {
    try {
      await navigator.share({
        title: `Guía del Santo Rosario (${ROSARY_DEFINITIONS[input.rosaryId].name})`,
        text: shareSummary,
        files: [pdfFile],
      });
      return { mode: 'native-file-share', fileName, whatsappUrl };
    } catch {
      // Si el usuario cancela o falla el share nativo, descargamos y ofrecemos enlace WhatsApp
    }
  }

  doc.save(fileName);
  return { mode: 'downloaded-with-link', fileName, whatsappUrl };
}
