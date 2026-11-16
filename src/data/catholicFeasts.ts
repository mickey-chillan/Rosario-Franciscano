import { DayOfWeek, MysteryType } from '../types/rosary';
import { getRecommendedMysteryForDay } from './rosaryCatalog';

export type LiturgicalRank = 'Solemnidad' | 'Fiesta' | 'Memoria';

export interface CatholicFeast {
  id: string;
  date: Date;
  isoDate: string;
  name: string;
  rank: LiturgicalRank;
  description: string;
  dayOfWeek: DayOfWeek;
  recommendedMystery: MysteryType;
}

const WEEKDAY_MAP: Record<number, DayOfWeek> = {
  0: 'domingo',
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
};

// Algoritmo gregoriano de Computus para calcular el Domingo de Pascua de Resurrección
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=marzo, 4=abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function makeFeast(
  idPrefix: string,
  date: Date,
  name: string,
  rank: LiturgicalRank,
  description: string
): CatholicFeast {
  const dayOfWeek = WEEKDAY_MAP[date.getDay()] ?? 'domingo';
  return {
    id: `${idPrefix}-${toIsoDate(date)}`,
    date,
    isoDate: toIsoDate(date),
    name,
    rank,
    description,
    dayOfWeek,
    recommendedMystery: getRecommendedMysteryForDay(dayOfWeek),
  };
}

export function getCatholicFeastsForYear(year: number): CatholicFeast[] {
  const easter = getEasterSunday(year);

  // Primer Domingo de Adviento: 4 domingos antes de Navidad
  const christmas = new Date(year, 11, 25);
  const christmasWeekday = christmas.getDay(); // 0=Dom..6=Sab
  const daysToPrevSunday = christmasWeekday === 0 ? 7 : christmasWeekday;
  const fourthAdvent = addDays(christmas, -daysToPrevSunday);
  const firstAdvent = addDays(fourthAdvent, -21);
  const christTheKing = addDays(firstAdvent, -7);

  // Sagrada Familia: domingo entre 26 y 31 de diciembre, o 30 de diciembre si Navidad es domingo
  let holyFamily = new Date(year, 11, 30);
  for (let d = 26; d <= 31; d++) {
    const candidate = new Date(year, 11, d);
    if (candidate.getDay() === 0) {
      holyFamily = candidate;
      break;
    }
  }

  const fixedAndMovable: CatholicFeast[] = [
    makeFeast(
      'madre-dios',
      new Date(year, 0, 1),
      'Santa María, Madre de Dios',
      'Solemnidad',
      'Octava de Navidad y Jornada Mundial de la Paz.'
    ),
    makeFeast(
      'epifania',
      new Date(year, 0, 6),
      'Epifanía del Señor',
      'Solemnidad',
      'Manifestación de Jesús a los Reyes Magos.'
    ),
    makeFeast(
      'candelaria',
      new Date(year, 1, 2),
      'Presentación del Señor (La Candelaria)',
      'Fiesta',
      'Jesús es presentado en el Templo como luz de las naciones.'
    ),
    makeFeast(
      'lourdes',
      new Date(year, 1, 11),
      'Nuestra Señora de Lourdes',
      'Memoria',
      'Jornada Mundial del Enfermo.'
    ),
    makeFeast(
      'ceniza',
      addDays(easter, -46),
      'Miércoles de Ceniza',
      'Fiesta',
      'Inicio del tiempo litúrgico de la Cuaresma.'
    ),
    makeFeast(
      'san-jose',
      new Date(year, 2, 19),
      'San José, Esposo de la Virgen María',
      'Solemnidad',
      'Patrono de la Iglesia Universal.'
    ),
    makeFeast(
      'anunciacion',
      new Date(year, 2, 25),
      'La Anunciación del Señor',
      'Solemnidad',
      'El Ángel Gabriel anuncia a María la Encarnación del Hijo de Dios.'
    ),
    makeFeast(
      'ramos',
      addDays(easter, -7),
      'Domingo de Ramos',
      'Solemnidad',
      'Entrada triunfal de Jesús en Jerusalén e inicio de Semana Santa.'
    ),
    makeFeast(
      'jueves-santo',
      addDays(easter, -3),
      'Jueves Santo',
      'Solemnidad',
      'Última Cena, institución de la Eucaristía y del sacerdocio.'
    ),
    makeFeast(
      'viernes-santo',
      addDays(easter, -2),
      'Viernes Santo',
      'Solemnidad',
      'Pasión y Muerte del Señor.'
    ),
    makeFeast(
      'pascua',
      easter,
      'Domingo de Pascua de Resurrección',
      'Solemnidad',
      'Fiesta central de la fe cristiana: Cristo ha resucitado.'
    ),
    makeFeast(
      'fatima',
      new Date(year, 4, 13),
      'Nuestra Señora de Fátima',
      'Memoria',
      'Llamado a la oración del Santo Rosario y a la paz.'
    ),
    makeFeast(
      'ascension',
      addDays(easter, 42),
      'La Ascensión del Señor',
      'Solemnidad',
      'Jesús sube al Cielo y nos confía la misión evangelizadora.'
    ),
    makeFeast(
      'pentecostes',
      addDays(easter, 49),
      'Domingo de Pentecostés',
      'Solemnidad',
      'Venida del Espíritu Santo sobre María y los Apóstoles.'
    ),
    makeFeast(
      'visitacion',
      new Date(year, 4, 31),
      'Visitación de la Santísima Virgen María',
      'Fiesta',
      'Encuentro de María con su prima Santa Isabel.'
    ),
    makeFeast(
      'trinidad',
      addDays(easter, 56),
      'Santísima Trinidad',
      'Solemnidad',
      'Celebración del misterio de un solo Dios en tres Personas.'
    ),
    makeFeast(
      'corpus-christi',
      addDays(easter, 63),
      'Corpus Christi',
      'Solemnidad',
      'Solemnidad del Santísimo Cuerpo y Sangre de Cristo.'
    ),
    makeFeast(
      'sagrado-corazon',
      addDays(easter, 68),
      'Sagrado Corazón de Jesús',
      'Solemnidad',
      'Celebración del amor redentor del Corazón de Cristo.'
    ),
    makeFeast(
      'pedro-pablo',
      new Date(year, 5, 29),
      'San Pedro y San Pablo, Apóstoles',
      'Solemnidad',
      'Pilares de la Iglesia y testigos de la fe.'
    ),
    makeFeast(
      'virgen-carmen',
      new Date(year, 6, 16),
      'Nuestra Señora del Carmen',
      'Solemnidad',
      'Reina y Patrona de Chile.'
    ),
    makeFeast(
      'asuncion',
      new Date(year, 7, 15),
      'Asunción de la Santísima Virgen María',
      'Solemnidad',
      'María es llevada en cuerpo y alma a la gloria del Cielo.'
    ),
    makeFeast(
      'natividad-maria',
      new Date(year, 8, 8),
      'Natividad de la Santísima Virgen María',
      'Fiesta',
      'Celebración del nacimiento de la Madre del Salvador.'
    ),
    makeFeast(
      'dolores-maria',
      new Date(year, 8, 15),
      'Nuestra Señora de los Dolores',
      'Memoria',
      'Contemplación de María al pie de la Cruz.'
    ),
    makeFeast(
      'virgen-rosario',
      new Date(year, 9, 7),
      'Nuestra Señora del Rosario',
      'Memoria',
      'Fiesta dedicada especialmente a la oración del Santo Rosario.'
    ),
    makeFeast(
      'todos-santos',
      new Date(year, 10, 1),
      'Todos los Santos',
      'Solemnidad',
      'Celebración de toda la Iglesia triunfante en el Cielo.'
    ),
    makeFeast(
      'fieles-difuntos',
      new Date(year, 10, 2),
      'Conmemoración de los Fieles Difuntos',
      'Memoria',
      'Oración por el eterno descanso de nuestros seres queridos.'
    ),
    makeFeast(
      'presentacion-maria',
      new Date(year, 10, 21),
      'Presentación de la Santísima Virgen María',
      'Memoria',
      'Consagración total de María al servicio de Dios.'
    ),
    makeFeast(
      'cristo-rey',
      christTheKing,
      'Nuestro Señor Jesucristo, Rey del Universo',
      'Solemnidad',
      'Culminación del Año Litúrgico proclamando el Reino de Cristo.'
    ),
    makeFeast(
      'primer-adviento',
      firstAdvent,
      'Primer Domingo de Adviento',
      'Solemnidad',
      'Inicio del nuevo Año Litúrgico y preparación para la Navidad.'
    ),
    makeFeast(
      'san-andres',
      new Date(year, 10, 30),
      'San Andrés, Apóstol',
      'Fiesta',
      'Hermano de San Pedro y primer llamado por el Señor.'
    ),
    makeFeast(
      'inmaculada',
      new Date(year, 11, 8),
      'Inmaculada Concepción de la Virgen María',
      'Solemnidad',
      'Clausura del Mes de María · Solemnidad mariana.'
    ),
    makeFeast(
      'guadalupe',
      new Date(year, 11, 12),
      'Nuestra Señora de Guadalupe',
      'Fiesta',
      'Patrona de América.'
    ),
    makeFeast(
      'navidad',
      christmas,
      'Natividad del Señor (Navidad)',
      'Solemnidad',
      'Nacimiento de nuestro Salvador Jesucristo en Belén.'
    ),
    makeFeast(
      'sagrada-familia',
      holyFamily,
      'La Sagrada Familia de Jesús, María y José',
      'Fiesta',
      'Modelo de hogar cristiano, fe y amor familiar.'
    ),
  ];

  // Ordenar cronológicamente y evitar duplicados por fecha+nombre
  return fixedAndMovable.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getUpcomingCatholicFeasts(
  fromDate: Date,
  limit = 8
): CatholicFeast[] {
  const startOfDay = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate()
  );
  const currentYear = startOfDay.getFullYear();
  const pool = [
    ...getCatholicFeastsForYear(currentYear),
    ...getCatholicFeastsForYear(currentYear + 1),
  ];

  return pool
    .filter((f) => f.date.getTime() >= startOfDay.getTime())
    .slice(0, limit);
}

export function getFeastsInMonth(year: number, monthIndex: number): CatholicFeast[] {
  return getCatholicFeastsForYear(year).filter(
    (f) => f.date.getFullYear() === year && f.date.getMonth() === monthIndex
  );
}
