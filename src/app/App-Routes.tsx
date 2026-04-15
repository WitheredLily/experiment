import { Routes, Route } from "react-router-dom";
import Student from "./pages/Student/student";
import Login from "./pages/Login/login";
import Teacher from "./pages/Teacher/teacher";
import RequireAuth from "./auth/RequireAuth";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

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
