import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import AppLoader from "./components/ui/AppLoader";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLoader />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;