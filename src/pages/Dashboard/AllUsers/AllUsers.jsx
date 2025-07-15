import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import { FaUserShield, FaBan, FaUserCheck } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const {loading} = useAuth();

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10; // Show 10 users per page

  // Fetch all users with pagination
  const { data: usersData = {}, isLoading, error } = useQuery({
    queryKey: ['all-users', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?page=${page}&limit=${limit}`);
      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Update pagination info when data changes
  useEffect(() => {
    if (usersData) {
      setTotalPages(usersData.totalPages || 1);
      setTotalUsers(usersData.totalCount || 0);
    }
  }, [usersData]);

  // Get users array safely
  const users = usersData.users || [];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  // Handle make admin
  const handleMakeAdmin = async (userId, currentRole) => {
    const action = currentRole === 'admin' ? 'remove admin privileges from' : 'make';
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${currentRole === 'admin' ? 'remove admin' : 'make admin'}`,
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        await axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
        
        queryClient.invalidateQueries(['all-users']);
        
        Swal.fire({
          title: 'Success!',
          text: `User role updated to ${newRole}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update user role',
          icon: 'error',
        });
      }
    }
  };

  // Handle ban/unban user
  const handleBanUser = async (userId, isCurrentlyBanned) => {
    const action = isCurrentlyBanned ? 'unban' : 'ban';
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this user? ${isCurrentlyBanned ? 'They will be able to log in again.' : 'They will not be able to log in.'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isCurrentlyBanned ? '#14B8A6' : '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/${userId}/ban`, { isBanned: !isCurrentlyBanned });
        
        queryClient.invalidateQueries(['all-users']);
        
        Swal.fire({
          title: 'Success!',
          text: `User ${action}ed successfully`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: `Failed to ${action} user`,
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
          All Users
        </h2>
        <div className="text-sm text-secondary/60">
          Total Users: {totalUsers}
        </div>
      </div>

      {isLoading ||loading ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra min-w-max w-full">
            <thead>
              <tr className="bg-primary/10">
                <th>#</th>
                <th>Profile Picture</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td><Skeleton width={20} /></td>
                  <td><Skeleton circle width={40} height={40} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={160} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={60} /></td>
                  <td>
                    <div className="flex gap-2">
                      <Skeleton width={100} height={32} />
                      <Skeleton width={80} height={32} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Error loading users
          </h3>
          <p className="text-secondary/60 mb-4">
            {error.message || 'Failed to load users'}
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            No users found
          </h3>
          <p className="text-secondary/60">
            No users have registered yet.
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="table table-zebra min-w-max w-full">
              <thead>
                <tr className="bg-primary/10">
                  <th>#</th>
                  <th>Profile Picture</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      {user.photo ? (
                        <img 
                          src={user.photo} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full border border-primary object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-base-200 border border-primary flex items-center justify-center text-secondary font-bold">
                          {user.name?.[0] || 'U'}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="font-medium text-secondary">
                        {user.name}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-secondary/70">
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary text-base-100' : 'badge-warning'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.isBanned ? 'badge-error' : 'badge-success'}`}>
                        {user.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMakeAdmin(user._id, user.role)}
                          className={`btn btn-sm ${user.role === 'admin' ? 'btn-warning' : 'btn-primary'} text-base-100`}
                          disabled={user.isBanned}
                          title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        >
                          <FaUserShield />
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        
                        <button
                          onClick={() => handleBanUser(user._id, user.isBanned)}
                          className={`btn btn-sm ${user.isBanned ? 'btn-success' : 'btn-error'} text-base-100`}
                          title={user.isBanned ? 'Unban User' : 'Ban User'}
                        >
                          {user.isBanned ? <FaUserCheck /> : <FaBan />}
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {users.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 mt-6">
              {/* Page Info */}
              <div className="text-sm text-secondary/60">
                Showing page {page} of {totalPages}
                {totalUsers > 0 && (
                  <span className="ml-2">
                    ({totalUsers} total users)
                  </span>
                )}
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isLoading}
                  className="btn btn-sm btn-outline btn-primary disabled:btn-disabled"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`btn btn-sm ${
                        pageNum === page 
                          ? 'btn-primary' 
                          : 'btn-outline btn-primary'
                      } disabled:btn-disabled min-w-[40px]`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isLoading}
                  className="btn btn-sm btn-outline btn-primary disabled:btn-disabled"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsers;