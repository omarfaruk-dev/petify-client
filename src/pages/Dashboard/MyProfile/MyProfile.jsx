import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaPaw } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAuth from '../../../hooks/useAuth';
import useUserRole from '../../../hooks/useUserRole';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ProfileSkeleton = () => (
  <div className="flex justify-center items-center min-h-[70vh] bg-base-100 py-8">
    <div className="relative bg-base-100 dark:bg-base-200  rounded-3xl p-8 max-w-md w-full flex flex-col items-center border border-primary/10">
      {/* Paw icon accent */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary rounded-full p-3 shadow border-4 border-white dark:border-base-200">
        <FaPaw className="text-white text-3xl" />
      </div>
      {/* Avatar skeleton */}
      <div className="relative mb-4 mt-6">
        <Skeleton circle height={112} width={112} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ border: '4px solid var(--tw-color-primary, #14b8a6)' }} />
      </div>
      {/* Name and Role skeleton */}
      <Skeleton height={24} width={128} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-2" />
      <Skeleton height={18} width={80} baseColor="#99f6e4" highlightColor="#f3f4f6" className="mb-2 rounded-full" />
      {/* Email skeleton */}
      <Skeleton height={16} width={160} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-4" />
      <div className="w-full border-t border-dashed border-primary/20 my-4"></div>
      {/* Info grid skeleton */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton height={16} width={80} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            <Skeleton height={16} width={128} baseColor="#f3f4f6" highlightColor="#e5e7eb" />
          </div>
        ))}
      </div>
      <div className="mt-8 w-full flex justify-center">
        <Skeleton height={24} width={128} baseColor="#fbbf24" highlightColor="#f3f4f6" className="rounded-full" />
      </div>
    </div>
  </div>
);

const MyProfile = () => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();

  // Fetch full user info from backend
  const {
    data: userInfo,
    isLoading: userInfoLoading,
    error: userInfoError,
  } = useQuery({
    queryKey: ['userInfo', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${user.email}`);
      return res.data && res.data.length > 0 ? res.data[0] : null;
    },
  });

  if (loading || roleLoading || userInfoLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-error">
        <p className="text-lg font-semibold">No user is logged in.</p>
      </div>
    );
  }

  if (userInfoError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-error">
        <p className="text-lg font-semibold">Failed to load profile info.</p>
        <p className="text-sm">{userInfoError.message}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-base-100 py-8">
      <div className="relative bg-white dark:bg-base-200 shadow rounded p-8 max-w-md w-full flex flex-col items-center border border-primary/10 transition-all duration-300">
        {/* Paw icon accent */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary rounded-full p-3 shadow border-4 border-white dark:border-base-200">
          <FaPaw className="text-white text-3xl" />
        </div>
        {/* Avatar */}
        <div className="relative mb-4 mt-6">
          <img
            src={userInfo?.photo || user.photoURL || '/default-avatar.png'}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-primary object-cover shadow bg-base-200"
          />
        </div>
        {/* Name and Role */}
        <h2 className="text-2xl font-extrabold text-secondary mb-1 tracking-tight text-center">
          {userInfo?.name || user.displayName || 'No Name'}
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary mb-2">
          {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'}
        </span>
        {/* Email */}
        <p className="text-base text-accent mb-4 text-center">
          {userInfo?.email || user.email}
        </p>
        <div className="w-full border-t border-dashed border-primary/20 my-4"></div>
        {/* Info grid */}
        <div className="grid grid-cols-1 gap-3 w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary">Name:</span>
            <span className="truncate">{userInfo?.name || user.displayName || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary">Email:</span>
            <span className="truncate">{userInfo?.email || user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary">Role:</span>
            <span className="capitalize">{role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary">Joined:</span>
            <span>{userInfo?.created_at ? new Date(userInfo.created_at).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary">Last Login:</span>
            <span>{userInfo?.last_log_in ? new Date(userInfo.last_log_in).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
        {/* Petify accent footer */}
        <div className="mt-8 w-full flex justify-center">
          <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide shadow-sm">
            Welcome to Petify!
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile; 