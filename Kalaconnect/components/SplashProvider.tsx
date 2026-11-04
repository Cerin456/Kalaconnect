'use client';

/**
 * SplashProvider
 * Mounts the SplashScreen only on the client, only on the initial
 * browser session (checked via sessionStorage), and only on the
 * root path or when no prior visit key exists for the session.
 *
 * Rules:
 *  – Shows once per browser session (sessionStorage key).
 *  – Never shows again during internal navigation in the same tab.
 *  – Falls back gracefully if sessionStorage is unavailable.
 *  – Does NOT block server rendering or hydration.
 */

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'kc_splash_shown';

// Dynamically import so the heavy SVG is only loaded client-side
const SplashScreen = dynamic(() => import('./SplashScreen'), { ssr: false });

export default function SplashProvider() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    try {
      const already = sessionStorage.getItem(SESSION_KEY);
      if (!already) {
        sessionStorage.setItem(SESSION_KEY, '1');
        setShouldShow(true);
      }
    } catch {
      // sessionStorage blocked (e.g. private browsing edge cases) — skip splash
    }
  }, []);

  if (!shouldShow) return null;
  return <SplashScreen />;
}
