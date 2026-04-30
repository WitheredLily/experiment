import {Routes, Route, Navigate} from "react-router-dom";
import Student from "./pages/Student/student";
import Login from "./pages/Login/login";
import Teacher from "./pages/Teacher/teacher";
import RequireAuth from "./auth/RequireAuth";
import Signup from "./pages/signup/signup";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/student/*"
        element={(
          <RequireAuth role="student">
            <Student />
          </RequireAuth>
        )}
      />
      <Route
        path="/teacher/*"
        element={(
          <RequireAuth role="teacher">
            <Teacher />
          </RequireAuth>
        )}
      />
    </Routes>
  );
}
