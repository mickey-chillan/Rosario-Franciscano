import React from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  getMysterySetsForRosary,
  getSectionsForRosary,
  PRAYERS,
} from '../data/rosaryCatalog';
import {
  CustomPrayerElement,
  DolorososOrder,
  MysteryType,
  OpeningPrayerChoice,
  RosaryBead,
  RosaryId,
  SectionId,
} from '../types/rosary';
import { getRosaryGeometry } from '../utils/rosaryGeometry';

interface PrayerGuidePanelProps {
  rosaryId: RosaryId;
  activeBead: RosaryBead;
  activeMystery: MysteryType;
  dolorososOrder?: DolorososOrder;
  openingChoice: OpeningPrayerChoice;
  isBeadPrayed: boolean;
  customElements: CustomPrayerElement[];
  completedCustomElementIds: Set<string>;
  onChangeOpeningChoice: (choice: OpeningPrayerChoice) => void;
  onToggleCurrentBeadPrayed: () => void;
  onPreviousBead: () => void;
  onNextBead: () => void;
  onMarkAndAdvance: () => void;
  onOpenAddModal: (sectionId: SectionId) => void;
  onEditCustomElement: (element: CustomPrayerElement) => void;
  onDeleteCustomElement: (id: string) => void;
  onToggleCustomElementDone: (id: string) => void;
}

const KIND_LABELS: Record<CustomPrayerElement['kind'], string> = {
  rezo: 'Rezo agregado',
  meditacion: 'Meditación agregada',
  intencion: 'Intención agregada',
  elemento: 'Elemento agregado',
};

export const PrayerGuidePanel: React.FC<PrayerGuidePanelProps> = ({
  rosaryId,
  activeBead,
  activeMystery,
  dolorososOrder,
  openingChoice,
  isBeadPrayed,
  customElements,
  completedCustomElementIds,
  onChangeOpeningChoice,
  onToggleCurrentBeadPrayed,
  onPreviousBead,
  onNextBead,
  onMarkAndAdvance,
  onOpenAddModal,
  onEditCustomElement,
  onDeleteCustomElement,
  onToggleCustomElementDone,
}) => {
  const sections = getSectionsForRosary(rosaryId);
  const section = sections.find((s) => s.id === activeBead.sectionId) ?? sections[0];
  const mysterySets = getMysterySetsForRosary(rosaryId, dolorososOrder);
  const mysterySet = mysterySets[activeMystery];
  const currentMystery = section.decadeIndex
    ? mysterySet.mysteries.find((m) => m.number === section.decadeIndex)
    : undefined;

  const { beads } = getRosaryGeometry(rosaryId);
  const isFirstBead = activeBead.order === 0;
  const isLastBead = activeBead.order === beads.length - 1;
  const isMarian = rosaryId === 'mes-de-maria-2026';

  const sectionCustomElements = customElements.filter(
    (el) => el.sectionId === section.id
  );

  return (
    <article
      aria-label="Guía de oración de la sección actual"
      className="bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-5 sm:p-6 flex flex-col justify-between gap-5"
    >
      <div className="space-y-4">
        {/* Metadatos limpios sin cápsulas */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E4DACB] dark:border-[#2C303A]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5248] dark:text-[#A9A29A]">
            <span className="font-semibold text-[#8B5A0B] dark:text-[#E2A94C] tabular-nums">
              Sección {section.id} de 14
            </span>
            <span aria-hidden="true">·</span>
            <span>{activeBead.label}</span>
            {activeBead.shortCounter && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-medium text-[#1F1A17] dark:text-[#F2ECE1]">
                  {activeBead.shortCounter}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCurrentBeadPrayed}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isBeadPrayed
                ? 'bg-[#FEF7E6] dark:bg-[#2B2212] border-[#C98D26] text-[#6E4404] dark:text-[#F5D57A] hover:bg-[#FBECC8] dark:hover:bg-[#382C17]'
                : 'bg-[#F3ECE0] dark:bg-[#232833] border-[#D8CBB8] dark:border-[#363C49] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340]'
            }`}
          >
            <Check
              className={`w-3.5 h-3.5 ${isBeadPrayed ? 'opacity-100' : 'opacity-40'}`}
              aria-hidden="true"
            />
            <span>{isBeadPrayed ? 'Rezada (clic para desmarcar)' : 'Marcar como rezada'}</span>
          </button>
        </div>

        {/* Título de la sección */}
        <div>
          <h3 className="font-display text-2xl sm:text-[26px] font-semibold text-[#1F1A17] dark:text-[#F2ECE1] leading-tight text-balance">
            {section.title}
          </h3>
          <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-1">
            {section.description}
          </p>
        </div>

        {/* Anuncio del misterio activo con cita y pasaje del Evangelio */}
        {currentMystery && (
          <div className="rounded-lg border border-[#DFD3C0] dark:border-[#3A3227] bg-[#F3ECE0] dark:bg-[#211C16] p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <p className="font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
                {mysterySet.name} · Misterio {currentMystery.number} de 5
              </p>
              <span className="font-semibold text-[#1E3A5F] dark:text-[#93C5FD]">
                {currentMystery.scriptureRef}
              </span>
            </div>
            <p className="font-display text-xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
              {currentMystery.title}
            </p>
            <p className="font-prayer text-[14.5px] leading-relaxed text-[#2C241E] dark:text-[#EAE3D5]">
              {currentMystery.gospelText}{' '}
              <span className="italic text-[#8B5A0B] dark:text-[#E2A94C]">
                {currentMystery.pauseNote}
              </span>
            </p>
          </div>
        )}

        {/* Contenido de la oración */}
        <div className="space-y-4 max-w-[65ch]">
          {section.prayerType === 'opening' && (
            <>
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                  {PRAYERS.senalDeLaCruz.title}
                </h4>
                <p className="font-prayer text-[16px] leading-[1.75] text-[#1F1A17] dark:text-[#EAE3D5]">
                  {PRAYERS.senalDeLaCruz.text}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                    Oración inicial
                  </span>
                  <div
                    className="inline-flex p-0.5 bg-[#EFE7D8] dark:bg-[#222732] rounded-lg"
                    role="group"
                    aria-label="Elegir entre Credo o Acto de Contrición"
                  >
                    <button
                      type="button"
                      onClick={() => onChangeOpeningChoice('credo')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        openingChoice === 'credo'
                          ? 'bg-[#FBF8F1] dark:bg-[#161A21] text-[#1F1A17] dark:text-[#F2ECE1] shadow-xs'
                          : 'text-[#5C5248] dark:text-[#A9A29A] hover:text-[#1F1A17] dark:hover:text-[#F2ECE1]'
                      }`}
                    >
                      Credo
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeOpeningChoice('contricion')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        openingChoice === 'contricion'
                          ? 'bg-[#FBF8F1] dark:bg-[#161A21] text-[#1F1A17] dark:text-[#F2ECE1] shadow-xs'
                          : 'text-[#5C5248] dark:text-[#A9A29A] hover:text-[#1F1A17] dark:hover:text-[#F2ECE1]'
                      }`}
                    >
                      Acto de Contrición
                    </button>
                  </div>
                </div>

                <p className="font-prayer text-[16px] leading-[1.75] text-[#1F1A17] dark:text-[#EAE3D5]">
                  {openingChoice === 'credo'
                    ? PRAYERS.credo.text
                    : PRAYERS.actoDeContricion.text}
                </p>
              </div>
            </>
          )}

          {(section.prayerType === 'intro-padrenuestro' ||
            section.prayerType === 'mystery-padrenuestro') && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                {PRAYERS.padreNuestro.title}
              </h4>
              <p className="font-prayer text-[16px] leading-[1.75] text-[#1F1A17] dark:text-[#EAE3D5]">
                {PRAYERS.padreNuestro.text}
              </p>
            </div>
          )}

          {section.prayerType === 'intro-gloria' && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                {PRAYERS.gloria.title}
              </h4>
              <p className="font-prayer text-[16px] leading-[1.75] text-[#1F1A17] dark:text-[#EAE3D5]">
                {PRAYERS.gloria.text}
              </p>
            </div>
          )}

          {(section.prayerType === 'intro-avemarias' ||
            section.prayerType === 'decade-avemarias') && (
            <>
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                  {PRAYERS.aveMaria.title}{' '}
                  {activeBead.aveMariaIndex
                    ? `(${activeBead.aveMariaIndex} de ${section.prayerType === 'intro-avemarias' ? 3 : 10})`
                    : ''}
                </h4>
                <p className="font-prayer text-[16px] leading-[1.75] text-[#1F1A17] dark:text-[#EAE3D5]">
                  {PRAYERS.aveMaria.text}
                </p>
              </div>

              {(!isMarian || section.prayerType === 'decade-avemarias') && (
                <div
                  className={`pt-3 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-3 transition-opacity ${
                    activeBead.isEndOfDecade ? 'opacity-100' : 'opacity-80'
                  }`}
                >
                  <p className="text-xs font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
                    {activeBead.isEndOfDecade
                      ? 'Al concluir esta última Avemaría, reza a continuación:'
                      : 'Al finalizar esta serie de Avemarías se reza:'}
                  </p>

                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                      {PRAYERS.gloria.title}
                    </h4>
                    <p className="font-prayer text-[15px] leading-[1.7] text-[#2C241E] dark:text-[#D5CEC2]">
                      {PRAYERS.gloria.text}
                    </p>
                  </div>

                  {!isMarian && section.prayerType === 'decade-avemarias' && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                        {PRAYERS.oracionDeFatima.title}
                      </h4>
                      <p className="font-prayer text-[15px] leading-[1.7] text-[#2C241E] dark:text-[#D5CEC2]">
                        {PRAYERS.oracionDeFatima.text}
                      </p>
                    </div>
                  )}

                  {isMarian && isLastBead && (
                    <div className="pt-2 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-1">
                      <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                        Cierre opcional · {PRAYERS.salve.title}
                      </h4>
                      <p className="font-prayer text-[15px] leading-[1.7] text-[#2C241E] dark:text-[#D5CEC2]">
                        {PRAYERS.salve.text}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {section.prayerType === 'closing-salve' && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
                {PRAYERS.salve.title}
              </h4>
              <p className="font-prayer text-[16px] leading-[1.75] text-[#1F1A17] dark:text-[#EAE3D5]">
                {PRAYERS.salve.text}
              </p>
            </div>
          )}
        </div>

        {/* Rezos o elementos incorporados por el usuario a esta sección */}
        <div className="pt-4 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-semibold tracking-wide text-[#5C5248] dark:text-[#A9A29A] uppercase">
              Elementos agregados a esta sección ({sectionCustomElements.length})
            </h4>
            <button
              type="button"
              onClick={() => onOpenAddModal(section.id)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] hover:underline cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Agregar aquí</span>
            </button>
          </div>

          {sectionCustomElements.length === 0 ? (
            <p className="text-xs text-[#6E6256] dark:text-[#9CA3AF] leading-relaxed">
              Esta sección mantiene el rezo establecido normalmente. Puedes incorporar un rezo,
              meditación o intención adicional cuando lo desees.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {sectionCustomElements.map((el) => {
                const done = completedCustomElementIds.has(el.id);
                return (
                  <li
                    key={el.id}
                    className="rounded-lg border border-[#DFD3C0] dark:border-[#2C303A] bg-[#F5EFE2] dark:bg-[#1E232D] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleCustomElementDone(el.id)}
                        className="flex items-start gap-2.5 text-left cursor-pointer group"
                      >
                        <span
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            done
                              ? 'bg-[#B7791F] border-[#8B5A0B] text-white'
                              : 'bg-[#FBF8F1] dark:bg-[#161A21] border-[#B8A894] dark:border-[#4B5563]'
                          }`}
                        >
                          {done && <Check className="w-3 h-3" aria-hidden="true" />}
                        </span>
                        <span>
                          <span className="block text-[11px] font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
                            {KIND_LABELS[el.kind]}
                          </span>
                          <span
                            className={`font-display text-lg font-semibold ${
                              done
                                ? 'line-through text-[#6E6256] dark:text-[#8E877D]'
                                : 'text-[#1F1A17] dark:text-[#F2ECE1]'
                            }`}
                          >
                            {el.title}
                          </span>
                        </span>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onEditCustomElement(el)}
                          aria-label={`Editar ${el.title}`}
                          className="p-1.5 text-[#5C5248] dark:text-[#A9A29A] hover:text-[#1F1A17] dark:hover:text-[#F2ECE1] rounded-md hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCustomElement(el.id)}
                          aria-label={`Eliminar ${el.title}`}
                          className="p-1.5 text-[#5C5248] dark:text-[#A9A29A] hover:text-[#9A3412] dark:hover:text-[#F87171] rounded-md hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="font-prayer text-[15px] leading-[1.65] text-[#2C241E] dark:text-[#D5CEC2] pl-6 whitespace-pre-line">
                      {el.content}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Controles de avance y navegación paso a paso */}
      <div className="pt-4 border-t border-[#E4DACB] dark:border-[#2C303A] flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPreviousBead}
          disabled={isFirstBead}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-[#F3ECE0] dark:bg-[#232833] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={onMarkAndAdvance}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162C49] transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          <span>
            {isLastBead ? 'Marcar última cuenta' : 'Marcar rezada y avanzar'}
          </span>
        </button>

        <button
          type="button"
          onClick={onNextBead}
          disabled={isLastBead}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-[#F3ECE0] dark:bg-[#232833] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
