import { useState, useCallback, useEffect } from 'react';
import type { CursorState } from '@/types';

interface CursorContext {
  cursorState: CursorState;
  cursorText: string;
  setCursorState: (state: CursorState) => void;
  setCursorText: (text: string) => void;
  resetCursor: () => void;
}

export function useCursorState(): CursorContext {
  const [cursorState, setCursorStateInternal] = useState<CursorState>('default');
  const [cursorText, setCursorText] = useState('');

  const setCursorState = useCallback((state: CursorState) => {
    setCursorStateInternal(state);
  }, []);

  const resetCursor = useCallback(() => {
    setCursorStateInternal('default');
    setCursorText('');
  }, []);

  useEffect(() => {
    const body = document.body;
    body.className = body.className
      .replace(/cursor-\w+/g, '')
      .trim();
    if (cursorState !== 'default') {
      body.classList.add(`cursor-${cursorState}`);
    }
    return () => {
      body.className = body.className
        .replace(/cursor-\w+/g, '')
        .trim();
    };
  }, [cursorState]);

  return { cursorState, cursorText, setCursorState, setCursorText, resetCursor };
}
