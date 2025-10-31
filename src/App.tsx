import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AppSidebar } from './components/AppSidebar';
import { TopBar } from './components/TopBar';
import Login from './pages/Login';
import Register from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Stocks } from './pages/Stocks';
import { Portfolio } from './pages/Portfolio';

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <AppSidebar activePage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated - original white shell */}
          <Route path="/" element={<ProtectedRoute><Shell /></ProtectedRoute>} />
          {/* Redirect all to shell */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
