import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AppSidebar } from './components/AppSidebar';
import { TopBar } from './components/TopBar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Stocks } from './pages/Stocks';
import { Portfolio } from './pages/Portfolio';
import { SmartMoney } from './pages/SmartMoney';
import { Markets } from './pages/Markets';
import { Analysis } from './pages/Analysis';
import { Intelligence } from './pages/Intelligence';

function Shell() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'stocks':
        return <Stocks />;
      case 'portfolio':
        return <Portfolio />;
      case 'smart-money':
        return <SmartMoney />;
      case 'markets':
        return <Markets />;
      case 'analysis':
        return <Analysis />;
      case 'intelligence':
        return <Intelligence />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AppSidebar activePage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1 flex flex-col w-full min-w-0">
          <TopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Route - Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect to appropriate page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
