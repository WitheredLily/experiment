import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {useEffect} from "react";

const studentDirect = true;

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (studentDirect && !user) {
            // Auto-login a default student **only if no user is logged in**
            login("studentUser", "student");

            // Redirect immediately
            navigate("/student/page0", { replace: true });
        }

    }, []);

    if (studentDirect && !user) return null;

    const handleLogin = (username: string, role: "student" | "teacher") => {
        login(username, role);

        if (role === "student") {
            navigate("/student/page0", { replace: true });
        } else {
            navigate("/teacher/dashboard", { replace: true });
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={() => handleLogin("studentUser", "student")}>
                Login as Student
            </button>
            <button onClick={() => handleLogin("teacherUser", "teacher")}>
                Login as Teacher
            </button>
        </div>
    );
}