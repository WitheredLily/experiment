import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Role = "student" | "teacher";

interface RequireAuthProps {
    children: React.ReactNode;
    role: Role;
}

export default function RequireAuth({
                                        children,
                                        role,
                                    }: RequireAuthProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }


    // Not logged in
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Logged in but wrong role
    if (user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}