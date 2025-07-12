import React from 'react';
import { Link } from 'react-router';
import { FaShieldAlt, FaHome, FaArrowLeft } from 'react-icons/fa';

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto text-center px-4">
        {/* Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FaShieldAlt className="text-6xl text-error" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">403</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-4">
            Access Forbidden
          </h1>
          
          <div className="space-y-4">
            <p className="text-lg text-secondary/70 leading-relaxed">
              Sorry, you don't have permission to access this page.
            </p>
            
            <p className="text-sm text-secondary/60">
              This area is restricted to authorized users only. If you believe this is an error, please contact your administrator.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/dashboard"
              className="btn btn-primary text-base-100 flex items-center gap-2"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            
            <Link
              to="/"
              className="btn btn-outline btn-primary flex items-center gap-2"
            >
              <FaHome />
              Go Home
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-4 bg-base-200 rounded-lg">
            <h3 className="text-sm font-semibold text-secondary mb-2">
              Need Help?
            </h3>
            <p className="text-xs text-secondary/60">
              If you need access to this page, please contact your administrator or check your user permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden; 