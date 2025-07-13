import React from 'react';
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

  // Fetch all users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

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
          Total Users: {users.length}
        </div>
      </div>

      {isLoading ||loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton circle width={50} height={50} />
              <div className="flex-1">
                <Skeleton height={20} width={150} className="mb-2" />
                <Skeleton height={16} width={200} />
              </div>
              <Skeleton height={32} width={100} />
              <Skeleton height={32} width={80} />
            </div>
          ))}
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
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-secondary font-bold">
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
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
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
      )}
    </div>
  );
};

export default AllUsers;