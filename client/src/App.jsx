import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLoader from "./components/ui/AppLoader";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <AppLoader />
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  className: "card-chai text-foreground font-sans text-sm",
                  style: {
                    background: "var(--card-fill)",
                    color: "var(--foreground)",
                    border: "1px solid var(--card-edge)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "none",
                  },
                }}
              />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;