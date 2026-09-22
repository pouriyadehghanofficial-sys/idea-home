import React, { useRef } from 'react';
import { EyeOff } from 'lucide-react';
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

export const EditableText: React.FC<EditableTextProps> = React.memo(({
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
  const { 
    getText, 
    isEditorMode, 
    activeEditId, 
    setActiveEditId, 
    setHoveredEditId,
    getTextSize,
    isFieldDeleted,
  } = useSiteContent();

  const elementRef = useRef<HTMLElement | null>(null);

  const isDeleted = isFieldDeleted(id);
  const sizeScale = getTextSize(id);
  const isActive = activeEditId === id;

  // Compute proportional fontSize multiplier in em so containers, margins & typography adapt seamlessly
  const sizeMultiplier = sizeScale === 0 ? 1 : Math.max(0.65, 1 + sizeScale * 0.15);
  const mergedStyle: React.CSSProperties | undefined = sizeScale !== 0
    ? { ...style, fontSize: `${sizeMultiplier}em` }
    : style;

  // In public mode: if deleted, do not render element at all
  if (!isEditorMode) {
    if (isDeleted) {
      return null;
    }

    const fallback = typeof children === 'string' ? children : defaultText;
    const rawText = getText(id, fallback);

    if (multiline && rawText.includes('\n')) {
      return (
        <Component
          id={htmlId}
          className={className}
          style={mergedStyle}
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
      <Component id={htmlId} className={className} style={mergedStyle} dir={dir}>
        {rawText}
      </Component>
    );
  }

  // In Admin Visual Editor Mode:
  const def = getContentDefinition(id);
  const fieldLabel = def?.label || (id.startsWith('cta.') ? 'بخش فراخوان پایانی' : 'متن وب‌سایت');

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

  const fallback = typeof children === 'string' ? children : defaultText;
  const rawText = getText(id, fallback);

  // If deleted in editor mode, display distinct, clickable deleted indicator so admin can restore it via the editor panel
  if (isDeleted) {
    return (
      <Component
        id={htmlId}
        ref={elementRef}
        data-content-id={id}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border border-dashed border-red-400/80 bg-red-950/50 text-red-200 cursor-pointer select-none transition-all ${
          isActive ? 'ring-2 ring-red-400 bg-red-950/70' : 'hover:border-red-300'
        } ${className}`}
        style={mergedStyle}
        title={`بخش حذف شده: ${fieldLabel} (برای ویرایش یا بازیابی کلیک کنید)`}
        dir={dir}
      >
        <EyeOff className="w-3 h-3 text-red-400 shrink-0" />
        <span className="font-vazir text-[11px] opacity-90">[بخش حذف‌شده: {fieldLabel}]</span>
      </Component>
    );
  }

  const editorActiveStyles = isActive
    ? 'outline outline-2 outline-[#C9A24B] bg-[#C9A24B]/25 rounded-md ring-2 ring-[#C9A24B]/50 shadow-sm'
    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-[#C9A24B]/70 hover:bg-[#C9A24B]/10 rounded-sm';

  return (
    <Component
      id={htmlId}
      ref={elementRef}
      data-content-id={id}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group/editable cursor-pointer select-none transition-all duration-150 inline-block ${editorActiveStyles} ${className}`}
      style={mergedStyle}
      title={`کلیک برای ویرایش: ${fieldLabel}`}
      dir={dir}
    >
      {multiline && rawText.includes('\n') ? (
        rawText.split('\n').map((line, idx, arr) => (
          <React.Fragment key={idx}>
            {line}
            {idx < arr.length - 1 && <br />}
          </React.Fragment>
        ))
      ) : rawText === '' ? (
        <span className="opacity-50 italic text-[11px] font-vazir text-amber-300/80 border border-dashed border-amber-400/50 px-1 rounded">
          [متن خالی - برای نوشتن کلیک کنید]
        </span>
      ) : (
        rawText
      )}
    </Component>
  );
});
