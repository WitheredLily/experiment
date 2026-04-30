import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useState} from "react";
import "./Login.css";

const studentDirect = true;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    if (studentDirect) {
      login("dev-token", {
        username: username.trim(),
        role,
      });

      if (role === "student") {
        navigate("/student/page0", { replace: true });
      } else {
        navigate("/teacher/dashboard", { replace: true });
      }

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        let message = "Login failed";

        try {
          const err = await response.json();
          message = err.message || message;
        } catch {
          message = await response.text();
        }

        setError(message);
        return;
      }

      const data = await response.json();

      if (!data.token || !data.username || !data.role) {
        setError("Invalid server response");
        return;
      }

      // Store token + user in AuthContext
      login(data.token, {
        username: data.username,
        role: data.role,
      });

      // Navigate based on role
      if (data.role === "student") {
        navigate("/student/page0", { replace: true });
      } else {
        navigate("/teacher/dashboard", { replace: true });
      }

    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>

        {error && <div className="login-error">{error}</div>}

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <div className="input-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "student" | "teacher")
            }
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="login-button"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className="signup-button"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? Sign up
        </button>
      </form>
    </div>
  );
}