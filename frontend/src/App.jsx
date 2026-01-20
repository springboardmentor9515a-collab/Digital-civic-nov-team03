import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./pages/AuthLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePetition from "./pages/CreatePetition";
import PetitionDetail from "./pages/PetitionDetail";
import PetitionList from "./pages/PetitionList";
import CreatePoll from "./pages/CreatePoll";
import Polls from "./pages/Polls";
import PollDetail from "./pages/PollDetail";
import OfficialsDashboard from "./pages/OfficialsDashboard";
import ReportsDashboard from "./pages/ReportsDashboard";


export default function App() {
  return (
    <Routes>
           <Route path="/" element={<Home />} />
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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


      <Route
        path="/create-poll"
        element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        }
      />


      <Route
        path="/polls"
        element={
          <ProtectedRoute>
            <Polls />
          </ProtectedRoute>
        }
      />

      <Route
        path="/polls/:id"
        element={
          <ProtectedRoute>
            <PollDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/officials"
        element={
          <ProtectedRoute>
            <OfficialsDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsDashboard />
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
