import React from 'react';
import { ArrowRight, BookOpen, FileDown, HeartHandshake } from 'lucide-react';
import {
  DEFAULT_DAILY_INTENTIONS,
  getMysterySetsForRosary,
  PRAYERS,
  ROSARY_GUIDE_CONTENT,
} from '../data/rosaryCatalog';
import { DolorososOrder, MysteryType, RosaryId, SectionId } from '../types/rosary';

interface PrayerGuideBookletPanelProps {
  rosaryId: RosaryId;
  activeMystery: MysteryType;
  dolorososOrder: DolorososOrder;
  onGoToSection: (sectionId: SectionId) => void;
  onSelectMysteryAndGo: (mystery: MysteryType) => void;
  onDownloadPdf: () => void;
}

export const PrayerGuideBookletPanel: React.FC<PrayerGuideBookletPanelProps> = ({
  rosaryId,
  activeMystery,
  dolorososOrder,
  onGoToSection,
  onSelectMysteryAndGo,
  onDownloadPdf,
}) => {
  const mysterySets = getMysterySetsForRosary(rosaryId, dolorososOrder);

  return (
    <section
      aria-label="Guía completa para rezar el Santo Rosario"
      className="space-y-8"
    >
      {/* Cabecera editorial */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-[#E4DACB] dark:border-[#2C303A]">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8B5A0B] dark:text-[#E2A94C]">
            Guía Devocional Integrada
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1] text-balance">
            {ROSARY_GUIDE_CONTENT.heading}
          </h2>
          <p className="font-prayer text-base sm:text-lg leading-relaxed text-[#3B312B] dark:text-[#D5CEC2]">
            {ROSARY_GUIDE_CONTENT.introParagraph}
          </p>
        </div>

        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162C49] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <FileDown className="w-4 h-4" aria-hidden="true" />
          <span>Descargar Guía en PDF</span>
        </button>
      </div>

      {/* Guía Paso a Paso + Las Intenciones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="space-y-1 pb-3 border-b border-[#E4DACB] dark:border-[#2C303A]">
            <h3 className="font-display text-2xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
              Guía paso a paso
            </h3>
            <p className="text-xs text-[#5C5248] dark:text-[#A9A29A]">
              {ROSARY_GUIDE_CONTENT.stepByStepLead}
            </p>
          </div>

          <ol className="space-y-3.5">
            {ROSARY_GUIDE_CONTENT.steps.map((item) => (
              <li
                key={item.step}
                className="rounded-lg border border-[#E4DACB] dark:border-[#2C303A] bg-[#F6F1E6] dark:bg-[#1C212B] p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-xs font-bold text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums">
                      Paso {item.step}.
                    </span>
                    <h4 className="font-display text-lg font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                      {item.title}
                    </h4>
                  </div>

                  {item.targetSectionId && (
                    <button
                      type="button"
                      onClick={() => onGoToSection(item.targetSectionId!)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] hover:underline cursor-pointer whitespace-nowrap"
                    >
                      <span>Ir al Rosario</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <p className="font-prayer text-[15px] leading-relaxed text-[#2C241E] dark:text-[#D5CEC2]">
                  {item.body}
                </p>

                {item.quote && (
                  <blockquote className="rounded-md border border-[#DFD3C0] dark:border-[#2E3848] bg-[#FBF8F1] dark:bg-[#141820] p-3 font-prayer text-[15px] italic leading-relaxed text-[#3B312B] dark:text-[#E5DEC9]">
                    {item.quote}
                  </blockquote>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5 space-y-5">
          {/* Nota contemplativa y pausas de silencio */}
          <div className="bg-[#F6F1E6] dark:bg-[#191D24] border border-[#DFD3C0] dark:border-[#2C303A] rounded-xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5A0B] dark:text-[#E2A94C]">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Oración contemplativa y silencio</span>
            </div>
            <p className="font-prayer text-[15.5px] leading-relaxed text-[#2C241E] dark:text-[#EAE3D5]">
              {ROSARY_GUIDE_CONTENT.closingContemplation}
            </p>
          </div>

          {/* Siete intenciones de oración */}
          <div className="bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E4DACB] dark:border-[#2C303A]">
              <HeartHandshake
                className="w-4 h-4 text-[#8B5A0B] dark:text-[#E2A94C]"
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                Intenciones de la guía
              </h3>
            </div>
            <p className="text-xs text-[#5C5248] dark:text-[#A9A29A]">
              {ROSARY_GUIDE_CONTENT.intentionsLead}
            </p>
            <ul className="space-y-2">
              {DEFAULT_DAILY_INTENTIONS.map((item, idx) => (
                <li
                  key={item.id}
                  className="flex items-baseline gap-2.5 text-sm text-[#2C241E] dark:text-[#D5CEC2]"
                >
                  <span className="text-xs font-bold text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums w-4 shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="font-prayer text-[15px] leading-snug">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Las Oraciones completas */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-[#E4DACB] dark:border-[#2C303A]">
          <h3 className="font-display text-2xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
            Las Oraciones
          </h3>
          <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-0.5">
            Textos completos contenidos en la guía tradicional del Santo Rosario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            PRAYERS.senalDeLaCruz,
            PRAYERS.credo,
            PRAYERS.padreNuestro,
            PRAYERS.aveMaria,
            PRAYERS.gloria,
            PRAYERS.oracionDeFatima,
            PRAYERS.salve,
            PRAYERS.actoDeContricion,
          ].map((prayer) => (
            <article
              key={prayer.title}
              className="bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-4 sm:p-5 space-y-2"
            >
              <h4 className="font-display text-xl font-semibold text-[#1E3A5F] dark:text-[#93C5FD]">
                {prayer.title}
              </h4>
              <p className="font-prayer text-[15.5px] leading-relaxed text-[#2C241E] dark:text-[#EAE3D5]">
                {prayer.text}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Los 4 Misterios con Citas y Pasajes del Evangelio */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-[#E4DACB] dark:border-[#2C303A]">
          <h3 className="font-display text-2xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
            Los Misterios y sus Pasajes del Evangelio
          </h3>
          <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-0.5">
            Textos bíblicos completos extraídos de la guía para meditar en cada misterio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(['gozosos', 'luminosos', 'dolorosos', 'gloriosos'] as MysteryType[]).map(
            (mType) => {
              const set = mysterySets[mType];
              const isSelected = activeMystery === mType;
              return (
                <article
                  key={mType}
                  className={`rounded-xl border p-5 space-y-4 ${
                    isSelected
                      ? 'bg-[#F6F1E6] dark:bg-[#1E232D] border-[#B7791F] dark:border-[#E2A94C]'
                      : 'bg-[#FBF8F1] dark:bg-[#161A21] border-[#E4DACB] dark:border-[#2C303A]'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#E4DACB] dark:border-[#2C303A]">
                    <div>
                      <p className="text-xs font-semibold text-[#8B5A0B] dark:text-[#E2A94C]">
                        {set.daysLabel}
                      </p>
                      <h4 className="font-display text-2xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                        {set.name}
                      </h4>
                      <p className="font-prayer text-sm italic text-[#5C5248] dark:text-[#A9A29A] mt-0.5">
                        {set.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectMysteryAndGo(mType)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162C49] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Rezar ahora
                    </button>
                  </div>

                  <ol className="space-y-3.5">
                    {set.mysteries.map((item) => (
                      <li key={`${mType}-${item.number}`} className="space-y-1">
                        <p className="text-sm font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                          <span className="text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums mr-1.5">
                            {item.number}º
                          </span>
                          <span>{item.title}</span>{' '}
                          <span className="text-xs font-medium text-[#1E3A5F] dark:text-[#93C5FD]">
                            ({item.scriptureRef})
                          </span>
                        </p>
                        <p className="font-prayer text-[14.5px] leading-relaxed text-[#3B312B] dark:text-[#D5CEC2]">
                          {item.gospelText}{' '}
                          <span className="italic text-[#8B5A0B] dark:text-[#E2A94C]">
                            {item.pauseNote}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};
