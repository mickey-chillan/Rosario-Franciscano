import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getSectionsForRosary } from '../data/rosaryCatalog';
import {
  CustomElementKind,
  CustomPrayerElement,
  RosaryId,
  SectionId,
} from '../types/rosary';

interface AddElementModalProps {
  isOpen: boolean;
  rosaryId: RosaryId;
  initialSectionId: SectionId;
  editingElement: CustomPrayerElement | null;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    rosaryId: RosaryId;
    sectionId: SectionId;
    kind: CustomElementKind;
    title: string;
    content: string;
  }) => void;
}

export const AddElementModal: React.FC<AddElementModalProps> = ({
  isOpen,
  rosaryId,
  initialSectionId,
  editingElement,
  onClose,
  onSave,
}) => {
  const sections = getSectionsForRosary(rosaryId);
  const [sectionId, setSectionId] = useState<SectionId>(initialSectionId);
  const [kind, setKind] = useState<CustomElementKind>('rezo');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingElement) {
      setSectionId(editingElement.sectionId);
      setKind(editingElement.kind);
      setTitle(editingElement.title);
      setContent(editingElement.content);
    } else {
      setSectionId(initialSectionId);
      setKind('rezo');
      setTitle('');
      setContent('');
    }
    setError(null);
  }, [isOpen, initialSectionId, editingElement]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Por favor ingresa un título y el texto del rezo o elemento.');
      return;
    }
    onSave({
      id: editingElement?.id,
      rosaryId: editingElement?.rosaryId ?? rosaryId,
      sectionId,
      kind,
      title: title.trim(),
      content: content.trim(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1A17]/55 dark:bg-black/70 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-element-title"
    >
      <div className="w-full max-w-lg bg-[#FBF8F1] dark:bg-[#161A21] border border-[#D8CBB8] dark:border-[#2C303A] rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4DACB] dark:border-[#2C303A] bg-[#F5EFE2] dark:bg-[#1E232D]">
          <h3
            id="modal-element-title"
            className="font-display text-2xl font-semibold text-[#1F1A17] dark:text-[#F2ECE1]"
          >
            {editingElement
              ? 'Editar elemento del rosario'
              : 'Incorporar nuevo rezo o elemento'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1.5 rounded-lg text-[#5C5248] dark:text-[#A9A29A] hover:text-[#1F1A17] dark:hover:text-[#F2ECE1] hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="element-section"
                className="block text-xs font-semibold text-[#3B312B] dark:text-[#D5CEC2] mb-1.5"
              >
                Sección correspondiente
              </label>
              <select
                id="element-section"
                value={sectionId}
                onChange={(e) => setSectionId(Number(e.target.value) as SectionId)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-white dark:bg-[#111317] text-[#1F1A17] dark:text-[#F2ECE1] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="element-kind"
                className="block text-xs font-semibold text-[#3B312B] dark:text-[#D5CEC2] mb-1.5"
              >
                Tipo de elemento
              </label>
              <select
                id="element-kind"
                value={kind}
                onChange={(e) => setKind(e.target.value as CustomElementKind)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-white dark:bg-[#111317] text-[#1F1A17] dark:text-[#F2ECE1] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              >
                <option value="rezo">Rezo adicional</option>
                <option value="meditacion">Meditación o reflexión</option>
                <option value="intencion">Intención particular</option>
                <option value="elemento">Otro elemento / jaculatoria</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="element-title"
              className="block text-xs font-semibold text-[#3B312B] dark:text-[#D5CEC2] mb-1.5"
            >
              Título del rezo o elemento
            </label>
            <input
              id="element-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Oración del Mes de María o Jaculatoria mariana"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-white dark:bg-[#111317] text-[#1F1A17] dark:text-[#F2ECE1] placeholder:text-[#9A8E80] dark:placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            />
          </div>

          <div>
            <label
              htmlFor="element-content"
              className="block text-xs font-semibold text-[#3B312B] dark:text-[#D5CEC2] mb-1.5"
            >
              Texto completo
            </label>
            <textarea
              id="element-content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe aquí la oración, meditación o elemento que deseas rezar en esta sección..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-white dark:bg-[#111317] text-[#1F1A17] dark:text-[#F2ECE1] placeholder:text-[#9A8E80] dark:placeholder:text-[#6B7280] font-prayer leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-[#9A3412] dark:text-[#F87171]">
              {error}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#D8CBB8] dark:border-[#363C49] bg-[#F3ECE0] dark:bg-[#232833] text-[#3B312B] dark:text-[#E5DEC9] hover:bg-[#EAE0CF] dark:hover:bg-[#2D3340] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1E3A5F] text-white hover:bg-[#162C49] cursor-pointer"
            >
              {editingElement ? 'Guardar cambios' : 'Incorporar a la sección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
