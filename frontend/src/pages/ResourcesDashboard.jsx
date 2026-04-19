import React, { useState, useEffect } from 'react';
import { getResources } from '../api';
import BookingModal from '../components/BookingModal';

const TYPE_ICONS = {
  Room: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Equipment: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

const TYPE_COLORS = {
  Room: 'text-emerald-300 bg-emerald-300/10 border-emerald-300/30',
  Equipment: 'text-lime-300 bg-lime-300/10 border-lime-300/30',
};

export default function ResourcesDashboard() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data.data);
    } catch {
      setError('Failed to load resources. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleBookingSuccess = () => {
    setSelectedResource(null);
    setSuccessMsg(`✓ Booking confirmed for ${selectedResource?.name}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-space-50 mb-2">
          Available Resources
        </h1>
        <p className="text-space-100/75">
          Browse and book university spaces and equipment with a green, calm workspace experience.
        </p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 text-green-300 text-sm animate-fade-in flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
              <div className="h-3 bg-white/5 rounded w-1/3 mb-6" />
              <div className="h-8 bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Resources Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource, i) => (
            <div
              key={resource.id}
              className="card p-6 hover:border-space-400/45 transition-all duration-300 hover:bg-space-100/[0.08] group animate-fade-in"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }}
            >
              {/* Type badge */}
              <div className="flex items-start justify-between mb-4">
                <span className={`badge border ${TYPE_COLORS[resource.type] || 'text-white/50 bg-white/5 border-white/10'} gap-1.5`}>
                  {TYPE_ICONS[resource.type] || null}
                  {resource.type}
                </span>
                <span className="text-space-100/45 text-xs">#{resource.id}</span>
              </div>

              {/* Name */}
              <h3 className="font-display text-lg font-semibold text-space-50 mb-1 group-hover:text-space-200 transition-colors">
                {resource.name}
              </h3>

              {/* Capacity */}
              <div className="flex items-center gap-1.5 text-space-100/55 text-sm mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capacity: {resource.capacity}
              </div>

              {/* Book button */}
              <button
                onClick={() => setSelectedResource(resource)}
                className="w-full btn-primary text-sm"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <p className="text-lg">No resources found.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
