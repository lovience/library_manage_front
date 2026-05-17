import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import Loans from "./pages/Loans";
import Login from "./pages/Login";
import Users from "./pages/Users";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="loans" element={<Loans />} />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
