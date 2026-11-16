import {
  DailyIntention,
  DayOfWeek,
  DolorososOrder,
  MysterySet,
  MysteryType,
  RosaryDefinition,
  RosaryId,
  RosarySection,
} from '../types/rosary';

export const ROSARY_DEFINITIONS: Record<RosaryId, RosaryDefinition> = {
  'un-rosario-por-chile': {
    id: 'un-rosario-por-chile',
    name: 'Santo Rosario',
    shortName: 'Santo Rosario',
    subtitle: 'Guía tradicional paso a paso · Medallón central y La Salve',
    sourceLabel: 'Guía para rezar el Santo Rosario',
    directionLabel: 'Rosario tradicional con medallón central y La Salve',
    footerNote:
      'Basado en la Guía para rezar El Rosario. Oremos contemplativamente dando las pausas de silencio luego de cada pasaje bíblico.',
    theme: 'classic',
  },
  'mes-de-maria-2026': {
    id: 'mes-de-maria-2026',
    name: 'Santo Rosario',
    shortName: 'Santo Rosario',
    subtitle: 'Guía tradicional paso a paso · Medallón central y La Salve',
    sourceLabel: 'Guía para rezar el Santo Rosario',
    directionLabel: 'Rosario tradicional con medallón central y La Salve',
    footerNote:
      'Basado en la Guía para rezar El Rosario. Oremos contemplativamente dando las pausas de silencio luego de cada pasaje bíblico.',
    theme: 'classic',
  },
};

export const DAYS_OF_WEEK: {
  id: DayOfWeek;
  label: string;
  shortLabel: string;
  recommendedMystery: MysteryType;
}[] = [
  { id: 'lunes', label: 'Lunes', shortLabel: 'Lun', recommendedMystery: 'gozosos' },
  { id: 'martes', label: 'Martes', shortLabel: 'Mar', recommendedMystery: 'dolorosos' },
  { id: 'miercoles', label: 'Miércoles', shortLabel: 'Mié', recommendedMystery: 'gloriosos' },
  { id: 'jueves', label: 'Jueves', shortLabel: 'Jue', recommendedMystery: 'luminosos' },
  { id: 'viernes', label: 'Viernes', shortLabel: 'Vie', recommendedMystery: 'dolorosos' },
  { id: 'sabado', label: 'Sábado', shortLabel: 'Sáb', recommendedMystery: 'gozosos' },
  { id: 'domingo', label: 'Domingo', shortLabel: 'Dom', recommendedMystery: 'gloriosos' },
];

export function getTodayDayOfWeek(): DayOfWeek {
  const jsDay = new Date().getDay();
  const map: Record<number, DayOfWeek> = {
    0: 'domingo',
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sabado',
  };
  return map[jsDay] ?? 'lunes';
}

export function getRecommendedMysteryForDay(day: DayOfWeek): MysteryType {
  return DAYS_OF_WEEK.find((d) => d.id === day)?.recommendedMystery ?? 'gozosos';
}

export function getDayLabel(day: DayOfWeek): string {
  return DAYS_OF_WEEK.find((d) => d.id === day)?.label ?? 'Lunes';
}

export const CHILE_MYSTERY_SETS: Record<MysteryType, MysterySet> = {
  gozosos: {
    id: 'gozosos',
    name: 'Misterios Gozosos',
    shortName: 'Gozosos',
    daysLabel: 'Lunes y sábado',
    days: ['lunes', 'sabado'],
    subtitle:
      'Son misterios de gozo por la venida de Jesucristo al mundo, fuente de perenne alegría.',
    mysteries: [
      {
        number: 1,
        title: 'La encarnación del Hijo de Dios',
        scriptureRef: 'Lc. 1, 30;35;38',
        gospelText:
          'El ángel le dijo: “Alégrate, llena de gracia el Señor está contigo… El Espíritu Santo vendrá sobre ti y el poder del Altísimo te cubrirá con su sombra; por eso el que ha de nacer será santo y será llamado Hijo de Dios”; Dijo María: “Yo soy la esclava del Señor: que se cumpla en mí según tu palabra”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 2,
        title: 'La visita de María a su prima Isabel',
        scriptureRef: 'Lc. 1, 41-42',
        gospelText:
          'Isabel, al oír el saludo de María, llena del Espíritu Santo, exclamó con gran voz: “Bendita eres tú entre todas las mujeres y bendito es el fruto de tu vientre”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 3,
        title: 'Nacimiento del Hijo de Dios',
        scriptureRef: 'Lc. 2, 6-7',
        gospelText:
          'Estando ellos en Belén, le llegó a María la hora del parto, y dio a luz a su hijo primogénito. Lo envolvió en pañales y lo acostó en un pesebre, porque no habían encontrado sitio en la posada.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 4,
        title: 'Presentación del niño Jesús en el templo',
        scriptureRef: 'Lc. 2, 27-28;30',
        gospelText:
          'Cuando los padres introducían al niño Jesús en el Templo para cumplir lo que la Ley prescribía sobre él, Simeón lo tomó en brazos y bendijo a Dios diciendo: “Mis ojos han visto a tu Salvador”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 5,
        title: 'El niño Jesús perdido y hallado en el templo',
        scriptureRef: 'Lc. 2, 46-47',
        gospelText:
          'Le encontraron en el Templo sentado en medio de los maestros; todos los que le oían, estaban estupefactos por su inteligencia y sus respuestas.',
        pauseNote: 'Silencio - pausa.',
      },
    ],
  },
  luminosos: {
    id: 'luminosos',
    name: 'Misterios Luminosos',
    shortName: 'Luminosos',
    daysLabel: 'Jueves',
    days: ['jueves'],
    subtitle:
      'En los misterios de la luz contemplamos la vida pública de Jesús; su anuncio del Evangelio del Reino de Dios Padre.',
    mysteries: [
      {
        number: 1,
        title: 'El bautismo de Jesús en el río Jordán',
        scriptureRef: 'Mt. 3, 16-17',
        gospelText:
          'Bautizado Jesús, salió luego del agua; y en esto se abrieron los cielos y vio al Espíritu de Dios que bajaba en forma de paloma y venía sobre él. Y una voz que salía de los cielos decía: “Este es mi Hijo amado, en quien me complazco”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 2,
        title: 'Las bodas de Caná',
        scriptureRef: 'Jn. 2, 1-5',
        gospelText:
          'Tres días después se celebraba una boda en Caná de Galilea y estaba allí la madre de Jesús. Fue invitado también a la boda Jesús con sus discípulos. Y, como faltara vino, porque se había acabado, le dice a Jesús su madre: “No tienen vino”. Jesús le responde: “¿Qué tengo yo contigo, mujer? Todavía no ha llegado mi hora”. Dice su madre a los sirvientes: “Haced lo que él os diga”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 3,
        title: 'Jesús anuncia el Reino de Dios invitando a la conversión',
        scriptureRef: 'Mc. 1, 15',
        gospelText:
          'El tiempo se ha cumplido y el Reino de Dios está cerca; convertíos y creed en el Evangelio.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 4,
        title: 'La Transfiguración de Jesús',
        scriptureRef: 'Mt. 17, 1-2',
        gospelText:
          'Seis días después, Jesús tomó consigo a Pedro, a Santiago y a su hermano Juan, y los llevó aparte, a un monte alto. Y se transfiguró delante de ellos: su rostro se puso brillante como el sol y sus vestidos se volvieron blancos como la luz.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 5,
        title: 'La institución de la Eucaristía',
        scriptureRef: 'Mt. 26, 26-28',
        gospelText:
          'Mientras estaban comiendo, tomó Jesús pan y lo bendijo, lo partió y, dándoselo a sus discípulos, dijo: “Tomad, comed, este es mi cuerpo.” Tomó luego una copa y, dadas las gracias, se la dio diciendo: “Bebed de ella todos, porque esta es mi sangre de la Alianza, que es derramada por muchos para perdón de los pecados”.',
        pauseNote: 'Silencio - pausa.',
      },
    ],
  },
  dolorosos: {
    id: 'dolorosos',
    name: 'Misterios Dolorosos',
    shortName: 'Dolorosos',
    daysLabel: 'Martes y viernes',
    days: ['martes', 'viernes'],
    subtitle:
      'Los misterios del dolor de Jesús son la cumbre de la revelación del amor y fuente de nuestra salvación.',
    mysteries: [
      {
        number: 1,
        title: 'La oración de Jesús en el Huerto',
        scriptureRef: 'Lc. 22, 41-43',
        gospelText:
          'Se apartó de ellos como un tiro de piedra y, puesto de rodillas, oraba diciendo: “Padre, si quieres, aparta de mí este cáliz, pero no se haga mi voluntad, sino la tuya”. Se le apareció entonces un ángel venido del cielo que le confortaba.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 2,
        title: 'La Flagelación del Señor',
        scriptureRef: 'Mt. 26,67 y 27,26',
        gospelText:
          'Comenzaron a escupirle en el rostro y a darle puñetazos; y otros le golpeaban, diciendo: “Profetízanos, Cristo, quién es el que te ha pegado” …Y a Jesús, después de haberlo hecho azotar, Pilatos lo entregó para que lo crucificaran.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 3,
        title: 'La Coronación de espinas',
        scriptureRef: 'Mt. 27, 28-29',
        gospelText:
          'Le desnudaron y le echaron encima un manto de púrpura. Y tejiendo una corona de espinas se la pusieron sobre su cabeza, y en su mano derecha una caña; y doblando ante Él la rodilla se burlaban diciendo: “¡Salve, Rey de los judíos!”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 4,
        title: 'Jesús carga con la Cruz',
        scriptureRef: 'Jn. 19, 17',
        gospelText:
          'Tomaron a Jesús y él cargando con la cruz, salió hacia el lugar llamado Calvario, en hebreo Gólgota.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 5,
        title: 'Jesús muere en la Cruz',
        scriptureRef: 'Lc. 23, 44-46',
        gospelText:
          'Era ya cerca de la hora sexta y al eclipsarse el sol, las tinieblas cubrieron toda la tierra hasta la hora nona. El velo del Santuario se rasgó por medio. Jesús, dando una gran voz, dijo: “Padre, en tus manos entrego mi espíritu”, y dicho esto, expiró.',
        pauseNote: 'Silencio - pausa.',
      },
    ],
  },
  gloriosos: {
    id: 'gloriosos',
    name: 'Misterios Gloriosos',
    shortName: 'Gloriosos',
    daysLabel: 'Miércoles y domingo',
    days: ['miercoles', 'domingo'],
    subtitle:
      'En los misterios de gloria contemplamos y adoramos a Cristo Resucitado. Alimentan la esperanza en la meta final, del camino que recorre el Pueblo de Dios.',
    mysteries: [
      {
        number: 1,
        title: 'La Resurrección del Señor',
        scriptureRef: 'Mt. 28, 5-6',
        gospelText:
          'El Ángel se dirigió a las mujeres y les dijo: “Vosotras no temáis, pues sé que buscáis a Jesús, el Crucificado; no está aquí, ha resucitado”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 2,
        title: 'La Ascensión del Señor',
        scriptureRef: 'Lc. 24, 50',
        gospelText:
          'Los sacó hasta cerca de Betania y, alzando sus manos, los bendijo. Y sucedió que, mientras los bendecía, se separó de ellos y fue llevado al cielo.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 3,
        title: 'La venida del Espíritu Santo sobre la Santísima Virgen María y los Apóstoles',
        scriptureRef: 'Hch. 2,1; 3-4',
        gospelText:
          'Al llegar el día de Pentecostés, estaban todos reunidos en un mismo lugar… Se les aparecieron unas lenguas como de fuego que se posaron sobre cada uno de ellos; quedaron llenos del Espíritu Santo y se pusieron a hablar en otras lenguas.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 4,
        title: 'La Asunción de la Santísima Virgen María al cielo',
        scriptureRef: 'Lc. 1, 48-49',
        gospelText:
          '“Todas las generaciones me llamarán bienaventurada porque el Señor ha hecho obras grandes en mí”.',
        pauseNote: 'Silencio - pausa.',
      },
      {
        number: 5,
        title: 'Coronación de la Santísima Virgen María como Reina y Señora de todo lo creado',
        scriptureRef: 'Ap. 12, 1',
        gospelText:
          'Una gran señal apareció en el cielo: una mujer, vestida de sol, con la luna bajo sus pies, y una corona de doce estrellas sobre su cabeza.',
        pauseNote: 'Silencio - pausa.',
      },
    ],
  },
};

export const MYSTERY_SETS = CHILE_MYSTERY_SETS;

export const DEFAULT_DOLOROSOS_ORDER: DolorososOrder = [1, 2, 3, 4, 5];

export function getMysterySetsForRosary(
  _rosaryId: RosaryId,
  dolorososOrder?: DolorososOrder
): Record<MysteryType, MysterySet> {
  const baseSets = CHILE_MYSTERY_SETS;

  if (!dolorososOrder || dolorososOrder.length !== 5) {
    return baseSets;
  }

  const baseDolorosos = baseSets.dolorosos;
  const reorderedMysteries = dolorososOrder.map((origNum, idx) => {
    const found =
      baseDolorosos.mysteries.find((m) => m.number === origNum) ??
      baseDolorosos.mysteries[idx];
    return {
      ...found,
      number: (idx + 1) as 1 | 2 | 3 | 4 | 5,
      originalNumber: found.number,
    };
  });

  return {
    ...baseSets,
    dolorosos: {
      ...baseDolorosos,
      mysteries: reorderedMysteries,
    },
  };
}

export const PRAYERS = {
  senalDeLaCruz: {
    title: 'Señal de la Cruz',
    text: 'Por la señal de la Santa Cruz, de nuestros enemigos, líbranos Señor Dios nuestro. En el nombre del Padre y del Hijo y del Espíritu Santo. Amén.',
  },
  credo: {
    title: 'Credo',
    text: 'Creo en Dios Padre Todopoderoso, creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo. Nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado. Descendió a los infiernos, al tercer día resucitó de entre los muertos. Subió a los cielos y está sentado a la derecha de Dios Padre Todopoderoso. Desde allí ha de venir a juzgar a vivos y a muertos. Creo en el Espíritu Santo, en la santa Iglesia Católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y en la vida eterna. Amén.',
  },
  actoDeContricion: {
    title: 'Acto de Contrición',
    text: 'Señor mío, Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío; por ser Vos quien sois, Bondad infinita, y porque os amo sobre todas las cosas, me pesa de todo corazón de haberos ofendido; también me pesa porque podéis castigarme con las penas del infierno. Ayudado de vuestra divina gracia, propongo firmemente nunca más pecar, confesarme y cumplir la penitencia que me fuere impuesta. Amén.',
  },
  padreNuestro: {
    title: 'Padre Nuestro',
    text: 'Padre Nuestro que estás en el cielo, santificado sea tu Nombre, venga a nosotros tu Reino. Hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día, perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación y líbranos del mal. Amén.',
  },
  aveMaria: {
    title: 'Ave María',
    text: 'Dios te salve María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros los pecadores ahora y en la hora de nuestra muerte. Amén.',
  },
  gloria: {
    title: 'Gloria',
    text: 'Gloria al Padre, al Hijo y al Espíritu Santo. Como era en el principio ahora y siempre. Por los siglos de los siglos. Amén.',
  },
  oracionDeFatima: {
    title: 'Oración de Fátima',
    text: 'Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva todas las almas al cielo y socorre especialmente a las más necesitadas de tu misericordia. Amén.',
  },
  salve: {
    title: 'La Salve',
    text: 'Dios te salve, Reina y Madre de misericordia, vida y dulzura, esperanza nuestra, Dios te salve. A ti clamamos los desterrados hijos de Eva, a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora Abogada Nuestra, vuelve a nosotros tus ojos misericordiosos, y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. Oh clemente, oh piadosa, oh dulce Virgen María. Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas y gracias de Nuestro Señor Jesucristo. Amén.',
  },
};

export interface GuideStepItem {
  step: number;
  title: string;
  body: string;
  quote?: string;
  targetSectionId?: 1 | 2 | 3 | 4 | 5 | 14;
}

export const ROSARY_GUIDE_CONTENT = {
  heading: 'Guía para rezar el Rosario',
  introParagraph:
    'El Rosario es la oración que la Santísima Virgen María pide con insistencia que recemos a diario, para alcanzar nuestra conversión, nuestra salvación y la de toda la humanidad.',
  intentionsLead:
    'Se promueve el rezo cotidiano del rosario especialmente por estas siete intenciones:',
  closingContemplation:
    'Oremos este rosario contemplativamente, dando las pausas de silencio que —luego de cada texto bíblico— la guía señala. Así, nuestro rezo posterior será el eco de lo meditado, y grato a Dios, en las manos de la Santísima Virgen María.',
  stepByStepLead: 'Existen varios modos de rezar el rosario. El más difundido es este:',
  steps: [
    {
      step: 1,
      title: 'Señal de la Cruz y Credo',
      body: 'Recitándola, realice sobre sí la Señal de la Cruz y a continuación recite el Credo (o el Acto de Contrición).',
      targetSectionId: 1,
    },
    {
      step: 2,
      title: 'Ofrecer las intenciones',
      body: 'Diga: “Pido por las intenciones del Santo Rosario y las intenciones particulares de cada orante”.',
      targetSectionId: 1,
    },
    {
      step: 3,
      title: 'Tres Avemarías y un Padre Nuestro',
      body: 'Luego rece tres Avemarías y un Padre Nuestro, por las intenciones del Santo Padre.',
      targetSectionId: 2,
    },
    {
      step: 4,
      title: 'Primer Misterio y lectura del Evangelio',
      body: 'Anuncie el Primer Misterio del día (según los Misterios que corresponden a cada día de la semana) y lea el pasaje bíblico que le acompaña. Medite un momento en lo leído (Silencio - pausa).',
      targetSectionId: 4,
    },
    {
      step: 5,
      title: 'Padre Nuestro, diez Ave Marías, Gloria y jaculatoria',
      body: 'Rece un Padre Nuestro, luego diez Ave María (una por cada cuenta/bolita). Finalice rezando un Gloria y luego diga:',
      quote:
        '“Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva todas las almas al cielo y socorre especialmente a las más necesitadas de tu misericordia. Amén”.',
      targetSectionId: 5,
    },
    {
      step: 6,
      title: 'Continuar con los misterios segundo al quinto',
      body: 'Se repite lo mismo que en los pasos 4 y 5, pero anunciando los misterios que siguen para el día (segundo, tercero, cuarto y quinto).',
      targetSectionId: 4,
    },
    {
      step: 7,
      title: 'Oración final: La Salve',
      body: 'Al finalizar su rezo de los cinco misterios (cada uno con sus correspondientes Padrenuestro, diez Ave María y Gloria), rece La Salve.',
      targetSectionId: 14,
    },
  ] as GuideStepItem[],
};

export const CHILE_ROSARY_SECTIONS: RosarySection[] = [
  {
    id: 1,
    title: '1) Señal de la Cruz y Credo o Acto de Contrición',
    shortLabel: 'Cruz y Credo',
    description: 'Recita sobre ti la Señal de la Cruz, el Credo (o Acto de Contrición) y ofrece tus intenciones.',
    prayerType: 'opening',
  },
  {
    id: 2,
    title: '2) Padre Nuestro inicial',
    shortLabel: 'Padre Nuestro inicial',
    description: 'Primera cuenta grande por las intenciones del Santo Padre.',
    prayerType: 'intro-padrenuestro',
  },
  {
    id: 3,
    title: '3) Rezar 3 Avemarías y Gloria',
    shortLabel: '3 Avemarías y Gloria',
    description: 'Tres cuentas iniciales pidiendo Fe, Esperanza y Caridad, cerrando con el Gloria.',
    prayerType: 'intro-avemarias',
  },
  {
    id: 4,
    title: '4) Primer misterio y Padre Nuestro',
    shortLabel: '1.er Misterio',
    description: 'Anuncia el primer misterio, lee el pasaje bíblico, haz silencio-pausa y reza un Padre Nuestro.',
    decadeIndex: 1,
    prayerType: 'mystery-padrenuestro',
  },
  {
    id: 5,
    title: '5) 10 Avemarías, Gloria y Oración de Fátima',
    shortLabel: '1.ª Decena (10 Avemarías)',
    description: 'Diez Avemarías del primer misterio, concluyendo con Gloria y Oración de Fátima.',
    decadeIndex: 1,
    prayerType: 'decade-avemarias',
  },
  {
    id: 6,
    title: '6) Segundo misterio y Padre Nuestro',
    shortLabel: '2.º Misterio',
    description: 'Anuncia el segundo misterio, lee el pasaje bíblico, haz silencio-pausa y reza un Padre Nuestro.',
    decadeIndex: 2,
    prayerType: 'mystery-padrenuestro',
  },
  {
    id: 7,
    title: '7) 10 Avemarías, Gloria y Oración de Fátima',
    shortLabel: '2.ª Decena (10 Avemarías)',
    description: 'Diez Avemarías del segundo misterio, concluyendo con Gloria y Oración de Fátima.',
    decadeIndex: 2,
    prayerType: 'decade-avemarias',
  },
  {
    id: 8,
    title: '8) Tercer misterio y Padre Nuestro',
    shortLabel: '3.er Misterio',
    description: 'Anuncia el tercer misterio, lee el pasaje bíblico, haz silencio-pausa y reza un Padre Nuestro.',
    decadeIndex: 3,
    prayerType: 'mystery-padrenuestro',
  },
  {
    id: 9,
    title: '9) 10 Avemarías, Gloria y Oración de Fátima',
    shortLabel: '3.ª Decena (10 Avemarías)',
    description: 'Diez Avemarías del tercer misterio, concluyendo con Gloria y Oración de Fátima.',
    decadeIndex: 3,
    prayerType: 'decade-avemarias',
  },
  {
    id: 10,
    title: '10) Cuarto misterio y Padre Nuestro',
    shortLabel: '4.º Misterio',
    description: 'Anuncia el cuarto misterio, lee el pasaje bíblico, haz silencio-pausa y reza un Padre Nuestro.',
    decadeIndex: 4,
    prayerType: 'mystery-padrenuestro',
  },
  {
    id: 11,
    title: '11) 10 Avemarías, Gloria y Oración de Fátima',
    shortLabel: '4.ª Decena (10 Avemarías)',
    description: 'Diez Avemarías del cuarto misterio, concluyendo con Gloria y Oración de Fátima.',
    decadeIndex: 4,
    prayerType: 'decade-avemarias',
  },
  {
    id: 12,
    title: '12) Quinto misterio y Padre Nuestro',
    shortLabel: '5.º Misterio',
    description: 'Anuncia el quinto misterio, lee el pasaje bíblico, haz silencio-pausa y reza un Padre Nuestro.',
    decadeIndex: 5,
    prayerType: 'mystery-padrenuestro',
  },
  {
    id: 13,
    title: '13) 10 Avemarías, Gloria y Oración de Fátima',
    shortLabel: '5.ª Decena (10 Avemarías)',
    description: 'Diez Avemarías del quinto misterio, concluyendo con Gloria y Oración de Fátima.',
    decadeIndex: 5,
    prayerType: 'decade-avemarias',
  },
  {
    id: 14,
    title: '14) Rezar La Salve',
    shortLabel: 'La Salve',
    description: 'Oración final del Santo Rosario en el medallón central.',
    prayerType: 'closing-salve',
  },
];

export const ROSARY_SECTIONS = CHILE_ROSARY_SECTIONS;

export function getSectionsForRosary(_rosaryId: RosaryId): RosarySection[] {
  return CHILE_ROSARY_SECTIONS;
}

export const DEFAULT_DAILY_INTENTIONS: DailyIntention[] = [
  {
    id: 'int-1',
    text: 'Que la Virgen del Carmen interceda ante Dios Padre, por la protección de Chile.',
  },
  {
    id: 'int-2',
    text: 'Que en Chile se rece el Santo Rosario, vivamos los valores cristianos y protejamos la vida humana desde su concepción hasta su muerte natural.',
  },
  {
    id: 'int-3',
    text: 'Por la Iglesia, por el Santo Padre y sus intenciones.',
  },
  {
    id: 'int-4',
    text: 'Por la santidad de nuestros sacerdotes, y el incremento de las vocaciones sacerdotales y religiosas.',
  },
  {
    id: 'int-5',
    text: 'Para que las familias chilenas recen unidas y sean un reflejo de la Sagrada Familia de Nazareth.',
  },
  {
    id: 'int-6',
    text: 'Por nuestros políticos, autoridades gubernamentales, legislativas, judiciales y quienes trabajan en los medios de comunicación.',
  },
  {
    id: 'int-7',
    text: 'Por las intenciones particulares de cada orante del Santo Rosario.',
  },
];
