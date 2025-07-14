import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { FaUserEdit } from 'react-icons/fa';

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto bg-base-100 rounded shadow-lg p-8 flex flex-col items-center gap-6">
      <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 inline-block border-primary">My Profile</h2>
      <div className="flex flex-col items-center gap-3 w-full">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-24 h-24 rounded-full object-cover border-2 border-primary mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center text-secondary text-4xl font-bold mb-2">
            {user?.displayName?.[0] || 'U'}
          </div>
        )}
        <div className="w-full text-center">
          <div className="font-bold text-xl text-secondary mb-1">{user?.displayName || 'Unknown User'}</div>
          <div className="text-secondary/70 text-sm mb-1">{user?.email || 'No email found'}</div>
          {user?.role && (
            <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'} mb-2`}>{user.role}</span>
          )}
        </div>
        <button
          className="btn btn-primary flex items-center gap-2 mt-2 px-4 py-2 rounded text-base-100 font-semibold"
          title="Edit Profile"
        >
          <FaUserEdit /> Edit Profile
        </button>
      </div>
    </div>
  );
};

export default MyProfile;