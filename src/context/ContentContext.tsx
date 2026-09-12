import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_SITE_CONTENT, getContentDefinition } from '../data/defaultContent';
import { contentRepository } from '../services/contentRepository';

interface ContentContextType {
  content: Record<string, string>;
  draftContent: Record<string, string>;
  isEditorMode: boolean;
  setIsEditorMode: (val: boolean) => void;
  activeEditId: string | null;
  setActiveEditId: (id: string | null) => void;
  hoveredEditId: string | null;
  setHoveredEditId: (id: string | null) => void;
  updateDraftValue: (id: string, value: string) => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveAllChanges: () => Promise<boolean>;
  resetField: (id: string) => void;
  resetSection: (sectionKey: string) => void;
  resetAll: () => Promise<void>;
  getText: (id: string, fallback?: string) => string;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Record<string, string>>(DEFAULT_SITE_CONTENT);
  const [draftContent, setDraftContent] = useState<Record<string, string>>(DEFAULT_SITE_CONTENT);
  const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [hoveredEditId, setHoveredEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load content on startup
  useEffect(() => {
    let isMounted = true;
    contentRepository.getSiteContent().then((loaded) => {
      if (isMounted) {
        setContent(loaded);
        setDraftContent(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const draftKeys = Object.keys(draftContent);
    for (const key of draftKeys) {
      if ((draftContent[key] ?? '') !== (content[key] ?? '')) {
        return true;
      }
    }
    return false;
  }, [draftContent, content]);

  // Update a single draft value in real-time
  const updateDraftValue = useCallback((id: string, value: string) => {
    setDraftContent((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  // Save all drafted changes to persistence
  const saveAllChanges = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      await contentRepository.saveSiteContent(draftContent);
      setContent(draftContent);
      return true;
    } catch (e) {
      console.error('Failed to save content changes:', e);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [draftContent]);

  // Reset a specific field to factory default
  const resetField = useCallback((id: string) => {
    const def = getContentDefinition(id);
    const defVal = def ? def.defaultValue : '';
    setDraftContent((prev) => ({
      ...prev,
      [id]: defVal,
    }));
  }, []);

  // Reset an entire section to factory defaults
  const resetSection = useCallback(async (sectionKey: string) => {
    const { CONTENT_DEFINITIONS } = await import('../data/defaultContent');
    const items = CONTENT_DEFINITIONS.filter((item) => item.sectionKey === sectionKey);
    setDraftContent((prev) => {
      const updated = { ...prev };
      items.forEach((item) => {
        updated[item.id] = item.defaultValue;
      });
      return updated;
    });
  }, []);

  // Reset everything to factory defaults
  const resetAll = useCallback(async () => {
    const res = await contentRepository.resetAll();
    setContent(res);
    setDraftContent(res);
    setActiveEditId(null);
  }, []);

  // Read current display text (draft in editor mode, saved in public mode)
  const getText = useCallback(
    (id: string, fallback?: string): string => {
      const source = isEditorMode ? draftContent : content;
      if (source[id] !== undefined && source[id] !== '') {
        return source[id];
      }
      if (fallback !== undefined) {
        return fallback;
      }
      const def = getContentDefinition(id);
      return def ? def.defaultValue : '';
    },
    [isEditorMode, draftContent, content]
  );

  const value = useMemo(
    () => ({
      content,
      draftContent,
      isEditorMode,
      setIsEditorMode,
      activeEditId,
      setActiveEditId,
      hoveredEditId,
      setHoveredEditId,
      updateDraftValue,
      hasUnsavedChanges,
      isSaving,
      saveAllChanges,
      resetField,
      resetSection,
      resetAll,
      getText,
    }),
    [
      content,
      draftContent,
      isEditorMode,
      activeEditId,
      hoveredEditId,
      updateDraftValue,
      hasUnsavedChanges,
      isSaving,
      saveAllChanges,
      resetField,
      resetSection,
      resetAll,
      getText,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useSiteContent = (): ContentContextType => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within a ContentProvider');
  }
  return ctx;
};
