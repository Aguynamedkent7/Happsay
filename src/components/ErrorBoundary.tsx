import { Component, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload(); // Reloads the current page
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em]">Oops! Something went wrong.</h1>
          <p className="text-muted">Try reloading the page.</p>
          <button
            onClick={this.handleReload}
            className="mt-2 h-11 rounded-xl bg-primary px-5 font-bold text-on-primary hover:bg-primary-hover"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
