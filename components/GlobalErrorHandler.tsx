'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Capture unhandled errors
    window.onerror = function (message, source, lineno, colno, error) {
      console.error('[Global Error]', {
        message,
        source,
        line: lineno,
        column: colno,
        error: error?.stack || error,
      });
      return false; // Let default error handling continue
    };

    // Capture unhandled promise rejections
    window.onunhandledrejection = function (event) {
      console.error('[Global Promise Rejection]', {
        reason: event.reason,
        promise: event.promise,
      });
    };

    console.log('[GlobalErrorHandler] Initialized');

    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  return null; // This component doesn't render anything
}
