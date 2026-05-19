import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import Patient from "./components/patient.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoutes.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <App />
            <Routes>
              <Route path="/patient" element={<Patient />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>,
);
