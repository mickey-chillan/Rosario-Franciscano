import React from 'react';
import { ArrowRight, Edit3, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { getSectionsForRosary, ROSARY_DEFINITIONS } from '../data/rosaryCatalog';
import { CustomPrayerElement, RosaryId, SectionId } from '../types/rosary';

interface CustomElementsManagerProps {
  rosaryId: RosaryId;
  customElements: CustomPrayerElement[];
  onOpenAddModal: (sectionId: SectionId) => void;
  onEditElement: (element: CustomPrayerElement) => void;
  onDeleteElement: (id: string) => void;
  onGoToSection: (sectionId: SectionId) => void;
  onClearAllCustom: () => void;
}

export const CustomElementsManager: React.FC<CustomElementsManagerProps> = ({
  rosaryId,
  customElements,
  onOpenAddModal,
  onEditElement,
  onDeleteElement,
  onGoToSection,
  onClearAllCustom,
}) => {
  const sections = getSectionsForRosary(rosaryId);
  const definition = ROSARY_DEFINITIONS[rosaryId];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-[#E4DACB] dark:border-[#2C303A]">
        <div>
          <p className="text-xs font-medium text-[#8B5A0B] dark:text-[#E2A94C]">
            {definition.name} · Estructura de 14 secciones
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1] mt-1">
            Personalizar Rezos y Elementos
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5248] dark:text-[#A9A29A] mt-1 max-w-2xl">
            Este rosario parte con todas sus oraciones establecidas normalmente. Aquí
            puedes incorporar nuevos rezos, meditaciones o elementos en la sección exacta
            que corresponda.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {customElements.length > 0 && (
            <button
              type="button"
              onClick={onClearAllCustom}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-[#F3ECE0] dark:bg-[#232833] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dejar solo rezos base</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenAddModal(1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162C49] cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Nuevo rezo o elemento</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => {
          const items = customElements.filter((el) => el.sectionId === sec.id);
          return (
            <div
              key={sec.id}
              className="bg-[#FBF8F1] dark:bg-[#161A21] border border-[#E4DACB] dark:border-[#2C303A] rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-[#5C5248] dark:text-[#A9A29A] mt-0.5">
                      {sec.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenAddModal(sec.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-[#EFE7D8] dark:bg-[#232833] text-[#1F1A17] dark:text-[#E5DEC9] hover:bg-[#E4DACB] dark:hover:bg-[#2D3340] shrink-0 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Agregar</span>
                  </button>
                </div>

                {items.length > 0 && (
                  <ul className="pt-2 border-t border-[#E4DACB] dark:border-[#2C303A] space-y-2">
                    {items.map((el) => (
                      <li
                        key={el.id}
                        className="rounded-lg bg-[#F5EFE2] dark:bg-[#1E232D] border border-[#DFD3C0] dark:border-[#2C303A] p-3 space-y-1"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-display text-base font-semibold text-[#1F1A17] dark:text-[#F2ECE1]">
                            {el.title}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => onEditElement(el)}
                              aria-label={`Editar ${el.title}`}
                              className="p-1 text-[#5C5248] dark:text-[#A9A29A] hover:text-[#1F1A17] dark:hover:text-[#F2ECE1] rounded hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteElement(el.id)}
                              aria-label={`Eliminar ${el.title}`}
                              className="p-1 text-[#5C5248] dark:text-[#A9A29A] hover:text-[#9A3412] dark:hover:text-[#F87171] rounded hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="font-prayer text-sm text-[#3B312B] dark:text-[#D5CEC2] line-clamp-3 whitespace-pre-line">
                          {el.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2 border-t border-[#E4DACB] dark:border-[#2C303A] flex items-center justify-between text-xs">
                <span className="text-[#5C5248] dark:text-[#A9A29A] tabular-nums">
                  {items.length === 0
                    ? 'Solo oración establecida'
                    : `${items.length} ${items.length === 1 ? 'elemento agregado' : 'elementos agregados'}`}
                </span>
                <button
                  type="button"
                  onClick={() => onGoToSection(sec.id)}
                  className="inline-flex items-center gap-1 font-medium text-[#1E3A5F] dark:text-[#93C5FD] hover:underline cursor-pointer"
                >
                  <span>Ir en el rosario</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
