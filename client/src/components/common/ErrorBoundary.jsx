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
        <div className="p-8 my-6 bg-amber-50 border border-amber-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl w-fit mx-auto border border-amber-200">
            <AlertTriangle className="h-8 w-8 text-amber-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900">Something went wrong rendering this component</h3>
            <p className="text-xs text-stone-600 font-medium">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
          </div>
          <Button
            onClick={this.handleReload}
            className="bg-[#8C4B3E] hover:bg-[#783E33] text-white font-extrabold text-xs h-10 px-5 rounded-xl flex items-center gap-2 mx-auto cursor-pointer"
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
