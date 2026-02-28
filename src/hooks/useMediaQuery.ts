'use client';

import { useState, useEffect } from 'react';

/**
 * SSR-safe media query hook.
 * Returns false during SSR and hydration, then syncs with window.matchMedia.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Convenience: true when viewport >= 768px (Tailwind md breakpoint) */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
