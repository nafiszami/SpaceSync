import React, { useState, useEffect } from 'react';
import { getBookings, deleteBooking } from '../api';

export default function ScheduleViewer() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data.data);
    } catch {
      setError('Failed to load bookings. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch {
      setError('Failed to cancel booking.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = bookings.filter(b =>
    !filter ||
    b.requested_by.toLowerCase().includes(filter.toLowerCase()) ||
    b.Resource?.name.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isUpcoming = (dateStr) => new Date(dateStr + 'T00:00:00') >= new Date(new Date().toDateString());

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold text-space-50 mb-2">
            Booking Schedule
          </h1>
          <p className="text-space-100/75">
            All current and upcoming resource reservations.
          </p>
        </div>
        {/* Search filter */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Filter by name or resource..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input pl-9 w-64 text-sm"
          />
        </div>
      </div>

      {/* Stats row */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length },
            { label: 'Upcoming', value: bookings.filter(b => isUpcoming(b.booking_date)).length },
            { label: 'Past', value: bookings.filter(b => !isUpcoming(b.booking_date)).length },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center hover:border-space-300/30 transition-colors">
              <div className="font-display text-3xl font-bold text-space-300">{stat.value}</div>
              <div className="text-space-100/55 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-1/4" />
              </div>
              <div className="w-20 h-8 bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Bookings table */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-white/40">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">No bookings found.</p>
              <p className="text-sm mt-1">Go to Resources to make a booking.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((booking, i) => {
                const upcoming = isUpcoming(booking.booking_date);
                return (
                  <div
                    key={booking.id}
                    className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-space-300/35 transition-all animate-slide-in"
                    style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'both', opacity: 0 }}
                  >
                    {/* Date block */}
                    <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center ${upcoming ? 'bg-space-500/20 border border-space-400/35' : 'bg-space-900/40 border border-space-200/15'}`}>
                      <span className="text-xs text-space-100/55 leading-none">
                        {new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className={`text-xl font-display font-bold leading-none ${upcoming ? 'text-space-200' : 'text-space-100/65'}`}>
                        {new Date(booking.booking_date + 'T00:00:00').getDate()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white truncate">
                          {booking.Resource?.name || `Resource #${booking.resource_id}`}
                        </span>
                        <span className={`badge text-xs ${upcoming ? 'text-green-400 bg-green-400/10' : 'text-white/30 bg-white/5'}`}>
                          {upcoming ? 'Upcoming' : 'Past'}
                        </span>
                        <span className="badge text-xs text-space-200 bg-space-200/10 border border-space-200/20">
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-space-100/55 text-sm mt-0.5">
                        <span className="font-medium text-space-100/80">{booking.requested_by}</span>
                        {' · '}
                        {formatDate(booking.booking_date)}
                      </div>
                    </div>

                    {/* Cancel button */}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      disabled={deletingId === booking.id}
                      className="btn-danger shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {deletingId === booking.id ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
