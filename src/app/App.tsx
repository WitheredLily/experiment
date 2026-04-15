import { AuthProvider } from "./auth/AuthContext";
import AppRoutes from "./App-Routes";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
