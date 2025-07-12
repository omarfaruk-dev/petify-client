import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all donations for the logged-in user
  const { data: donations = [], isLoading, error } = useQuery({
    queryKey: ['my-donations', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Refund handler
  const handleRefund = async (paymentId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove your donation and ask for a refund.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, refund it',
      cancelButtonText: 'Cancel',
    });
    if (!confirm.isConfirmed) return;
    try {
      await axiosSecure.delete(`/payments/${paymentId}`);
      queryClient.invalidateQueries(['my-donations', user?.email]);
      Swal.fire({
        title: 'Refunded!',
        text: 'Your donation has been refunded and removed.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'Failed to refund donation.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
      <h2 className="md:text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary mb-6">
        My Donations
      </h2>
      {isLoading ? (
        <Skeleton height={40} count={5} className="mb-2" />
      ) : error ? (
        <div className="text-error">Failed to load your donations.</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            You have not donated yet
          </h3>
          <p className="text-secondary/60 mb-4">
            Support a pet in need by making your first donation!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra min-w-max w-full">
            <thead>
              <tr className="bg-primary/10">
                <th>#</th>
                <th>Pet Image</th>
                <th>Pet Name</th>
                <th>Donated Amount</th>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((don, idx) => (
                <tr key={don._id || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {don.petImage ? (
                      <img src={don.petImage} alt={don.petName} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-secondary/60">No image</span>
                    )}
                  </td>
                  <td>{don.petName || 'N/A'}</td>
                  <td>${don.amount}</td>
                  <td>{new Date(don.paid_at).toLocaleString()}</td>
                  <td className="text-xs break-all">{don.transactionId}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleRefund(don._id)}
                    >
                      Ask for a refund
                    </button>
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

export default MyDonations;