import { AuthProvider } from "./auth/AuthContext";
import AppRoutes from "./App-Routes";

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}