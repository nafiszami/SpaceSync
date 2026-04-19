import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResourcesDashboard from './pages/ResourcesDashboard';
import ScheduleViewer from './pages/ScheduleViewer';

export default function App() {
  return (
    <div className="min-h-screen bg-grid">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-space-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-space-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-space-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<ResourcesDashboard />} />
            <Route path="/bookings" element={<ScheduleViewer />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
