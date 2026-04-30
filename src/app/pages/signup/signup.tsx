import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [teacherCode, setTeacherCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedTeacherCode = teacherCode.trim();

    if (!trimmedUsername || !password) {
      setError("Username and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (role === "student" && !trimmedTeacherCode) {
      setError("Teacher code is required for students");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password,
          role,
          teacherCode: role === "student" ? trimmedTeacherCode : undefined,
        }),
      });

      if (!response.ok) {
        let message = "Signup failed";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          message = await response.text();
        }

        setError(message);
        return;
      }

      navigate("/login", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h1 className="signup-title">Signup</h1>

        {error && <div className="signup-error">{error}</div>}

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
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
        </div>

        {role === "student" && (
          <div className="input-group">
            <label>Teacher Code</label>
            <input
              type="text"
              value={teacherCode}
              onChange={(e) => setTeacherCode(e.target.value)}
              placeholder="Enter teacher code"
            />
          </div>
        )}

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
          className="signup-button"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        <button
          type="button"
          className="login-button"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}