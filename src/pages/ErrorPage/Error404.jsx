import React from 'react';
import { Link } from 'react-router';

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-base-100 px-4 py-12">
      <div className="flex flex-col items-center gap-6">
        {/* Cat Illustration */}
        <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="mb-2 animate-float404">
      {/* Floating animation style */}
      <style>{`
        @keyframes float404 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0); }
        }
        .animate-float404 {
          animation: float404 2.5s ease-in-out infinite;
        }
      `}</style>
          <ellipse cx="90" cy="110" rx="70" ry="30" fill="#a5b4fc" />
          <ellipse cx="60" cy="60" rx="30" ry="35" fill="#fbbf24" />
          <ellipse cx="120" cy="60" rx="30" ry="35" fill="#fbbf24" />
          <ellipse cx="90" cy="80" rx="40" ry="45" fill="#fde68a" />
          <ellipse cx="75" cy="55" rx="7" ry="10" fill="#fff" />
          <ellipse cx="105" cy="55" rx="7" ry="10" fill="#fff" />
          <ellipse cx="75" cy="55" rx="3" ry="4" fill="#22223b" />
          <ellipse cx="105" cy="55" rx="3" ry="4" fill="#22223b" />
          <ellipse cx="90" cy="75" rx="8" ry="5" fill="#fbbf24" />
        </svg>
        <h1 className="text-7xl font-extrabold text-primary drop-shadow mb-2">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Oops! Page Not Found</h2>
        <p className="text-secondary/70 text-lg text-center max-w-md mb-4">
          The page you are looking for doesn't exist or has been moved.<br />
          Maybe a cat walked over the keyboard!
        </p>
        <Link to="/" className="btn btn-primary px-6 py-2 rounded text-base-100 font-semibold shadow hover:scale-105 transition-transform">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;