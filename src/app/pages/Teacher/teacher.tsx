import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./teacher.css";

interface Student {
  username: string;
  createdAt?: number;
}

const students: Student[] = [{ username: "alice", createdAt: Date.now() - 1000000 }, { username: "bob", createdAt: Date.now() - 2000000 }, { username: "charlie", createdAt: Date.now() - 3000000 },];

export default function Teacher() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [classroomCode, setClassroomCode] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch teacher dashboard data
    const fetchData = async () => {
      const response = await fetch("/api/teacher/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      // setStudents(data.students?.length ? data.students : students);
      // setClassroomCode(data.classroomCode || "65236");
      setStudents(students);
      setClassroomCode("65236");
    };

    fetchData();
    setStudents(students);
    setClassroomCode("65236");
  }, [user, navigate]);

  return (
    <div className="teacher-container">
      <div className="teacher-card">
        <div className="teacher-header">
          <h1>Welcome to your classroom</h1>
          <button className="logout-btn" onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}>
            Logout
          </button>
        </div>

        <div className="classroom-box">
          <h3>Your Classroom Code</h3>
          <p className="classroom-code">{classroomCode}</p>
        </div>

        <div className="students-section">
          <h3>Your Students</h3>
          {students.length === 0 ? (
            <p>No students enrolled yet.</p>
          ) : (
            <ul>
              {students.map((student) => (
                <li key={student.username}>{student.username}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}