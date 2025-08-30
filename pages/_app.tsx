import type { AppProps } from 'next/app';
import { SEO } from '../components/SEO';
import "../src/app/globals.css"

// Error Boundary Component
import React from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  // Performance monitoring
  React.useEffect(() => {
    // Report web vitals
    const reportWebVitals = (metric: any) => {
      if (process.env.NODE_ENV === 'production') {
        // Send to analytics service
        console.log(metric);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <SEO />
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
