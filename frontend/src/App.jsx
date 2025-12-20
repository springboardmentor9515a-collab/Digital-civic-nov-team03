import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./pages/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePetition from "./pages/CreatePetition";

export default function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Dashboard (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Create Petition (Protected) */}
      
<Route
  path="/petitions/create"
  element={
    <ProtectedRoute>
      <CreatePetition />
    </ProtectedRoute>
  }
/>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
