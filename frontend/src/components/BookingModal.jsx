import React, { useState } from 'react';
import { createBooking } from '../api';

export default function BookingModal({ resource, onClose, onSuccess }) {
  const [form, setForm] = useState({ requested_by: '', booking_date: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.requested_by.trim() || !form.booking_date) {
      setError('Both fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createBooking({
        resource_id: resource.id,
        requested_by: form.requested_by,
        booking_date: form.booking_date,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 glow-blue animate-fade-in">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-space-50">Book Resource</h3>
            <p className="text-space-100/70 text-sm mt-1">{resource.name}</p>
          </div>
          <button onClick={onClose} className="text-space-100/55 hover:text-space-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-space-100/75 text-sm mb-1.5">Requested By</label>
            <input
              type="text"
              placeholder="e.g. Dr. Ali"
              value={form.requested_by}
              onChange={e => setForm(p => ({ ...p, requested_by: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-space-100/75 text-sm mb-1.5">Booking Date</label>
            <input
              type="date"
              value={form.booking_date}
              onChange={e => setForm(p => ({ ...p, booking_date: e.target.value }))}
              className="input"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm animate-slide-in">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-space-200/15 text-space-100/75 hover:text-space-50 hover:border-space-200/30 transition-all text-sm bg-space-900/35">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Booking...
                </>
              ) : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
