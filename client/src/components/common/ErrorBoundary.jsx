import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-chai p-8 my-6 text-center space-y-4 max-w-xl mx-auto">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl w-fit mx-auto border border-red-500/20">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Something went wrong</h3>
            <p className="text-xs text-neutral-400">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
          </div>
          <Button
            onClick={this.handleReload}
            variant="solid"
            className="flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" /> Reload Component
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
