import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./pages/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePetition from "./pages/CreatePetition";
import PetitionDetail from "./pages/PetitionDetail";
import PetitionList from "./pages/PetitionList";

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


      {/* Create Petition (Protected) */}

      <Route
        path="/petitions/create"
        element={
          <ProtectedRoute>
            <CreatePetition />
          </ProtectedRoute>
        }
      />

      <Route
        path="/petitions/:id"
        element={
          <ProtectedRoute>
            <PetitionDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/petitions"
        element={
          <ProtectedRoute>
            <PetitionList />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
