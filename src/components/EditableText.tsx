import React from 'react';
import { Edit3 } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { getContentDefinition } from '../data/defaultContent';

interface EditableTextProps {
  id: string;
  defaultText?: string;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  htmlId?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  defaultText,
  as: Component = 'span',
  className = '',
  multiline = false,
  children,
  style,
  htmlId,
  dir,
}) => {
  const { getText, isEditorMode, activeEditId, setActiveEditId, setHoveredEditId } = useSiteContent();

  const fallback = typeof children === 'string' ? children : defaultText;
  const rawText = getText(id, fallback);
  const def = getContentDefinition(id);
  const fieldLabel = def?.label || 'متن وب‌سایت';

  // In standard public mode: zero overhead, no edit badges, pristine design
  if (!isEditorMode) {
    if (multiline && rawText.includes('\n')) {
      return (
        <Component
          id={htmlId}
          className={className}
          style={style}
          dir={dir}
        >
          {rawText.split('\n').map((line, idx, arr) => (
            <React.Fragment key={idx}>
              {line}
              {idx < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </Component>
      );
    }

    return (
      <Component id={htmlId} className={className} style={style} dir={dir}>
        {rawText}
      </Component>
    );
  }

  // In Admin Visual Editor Mode: Interactive Click-to-Edit with clean outline
  const isActive = activeEditId === id;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveEditId(id);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setActiveEditId(id);
  };

  const handleMouseEnter = () => {
    setHoveredEditId(id);
  };

  const handleMouseLeave = () => {
    setHoveredEditId(null);
  };

  const editorActiveStyles = isActive
    ? 'outline outline-2 outline-[#C9A24B] bg-[#C9A24B]/20 rounded-xs ring-1 ring-[#C9A24B]/60'
    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-[#C9A24B]/70 hover:bg-[#C9A24B]/10 rounded-xs';

  return (
    <Component
      id={htmlId}
      data-content-id={id}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group/editable cursor-pointer select-none transition-colors duration-150 ${editorActiveStyles} ${className}`}
      style={style}
      title={`کلیک برای ویرایش: ${fieldLabel}`}
      dir={dir}
    >
      {/* Floating "ویرایش" badge ONLY on active element to prevent layout jumping on hover */}
      {isActive && (
        <span
          className="absolute -top-5 right-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1E4B57] text-[#C9A24B] border border-[#C9A24B]/70 shadow-lg pointer-events-none z-30 whitespace-nowrap font-vazir"
        >
          <Edit3 className="w-2.5 h-2.5 shrink-0" />
          <span>ویرایش: {fieldLabel}</span>
        </span>
      )}

      {multiline && rawText.includes('\n') ? (
        rawText.split('\n').map((line, idx, arr) => (
          <React.Fragment key={idx}>
            {line}
            {idx < arr.length - 1 && <br />}
          </React.Fragment>
        ))
      ) : (
        rawText
      )}
    </Component>
  );
};
