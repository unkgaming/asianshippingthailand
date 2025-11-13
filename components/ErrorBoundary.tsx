"use client";
import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<{ children?: React.ReactNode }, State> {
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console — you can extend to remote logging
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-800 rounded">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="mt-2">An unexpected error occurred in this section.</p>
          <pre className="mt-2 text-sm whitespace-pre-wrap">{this.state.error?.message}</pre>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactNode;
  }
}
