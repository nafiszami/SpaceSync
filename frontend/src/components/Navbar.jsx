import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Resources' },
    { to: '/bookings', label: 'Schedule' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-space-200/15 bg-[#082516]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-space-500 rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(46,169,90,0.35)] shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="font-display text-sm md:text-base text-space-50 leading-tight">
              Jahangirnagar University
            </p>
            <p className="text-[11px] md:text-xs text-space-200/80 tracking-wide uppercase leading-tight">
              Resource Allocation System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-space-900/50 border border-space-200/15 rounded-xl p-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.to
                  ? 'bg-space-500 text-white shadow-lg shadow-space-500/30'
                  : 'text-space-100/70 hover:text-space-50 hover:bg-space-100/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
