import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaPlay, FaPause, FaEye } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';

// Skeleton loader for AllDonations table
const AllDonationsSkeleton = () => (
  <div className="overflow-x-auto">
    <table className="table table-zebra min-w-max w-full">
      <thead>
        <tr className="bg-primary/10">
          <th>#</th>
          <th>Campaign Image</th>
          <th>Campaign Name</th>
          <th>Creator</th>
          <th>Goal</th>
          <th>Raised</th>
          <th>Progress</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            <td><Skeleton width={20} /></td>
            <td><Skeleton circle width={48} height={48} /></td>
            <td>
              <Skeleton width={120} height={18} className="mb-1" />
              <Skeleton width={100} height={14} />
            </td>
            <td>
              <Skeleton width={80} height={14} className="mb-1" />
              <Skeleton width={100} height={12} />
            </td>
            <td><Skeleton width={60} height={18} /></td>
            <td><Skeleton width={60} height={18} /></td>
            <td>
              <div className="w-full bg-base-300 rounded-full h-2 mb-1">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <Skeleton width={40} height={12} />
            </td>
            <td><Skeleton width={60} height={24} className="rounded-full" /></td>
            <td>
              <div className="flex gap-2">
                <Skeleton width={32} height={32} circle />
                <Skeleton width={32} height={32} circle />
                <Skeleton width={32} height={32} circle />
                <Skeleton width={32} height={32} circle />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { loading } = useAuth();
  const navigate = useNavigate();
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const limit = 10; // Show 10 campaigns per page

  // Fetch all donation campaigns with pagination
  const { data: campaignsData, isLoading, error } = useQuery({
    queryKey: ['all-donations', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/all?page=${page}&limit=${limit}`);
      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Update pagination info when data changes
  useEffect(() => {
    if (campaignsData) {
      setTotalPages(campaignsData.totalPages || 1);
      setTotalCampaigns(campaignsData.totalCount || 0);
    }
  }, [campaignsData]);

  // Get campaigns array safely
  const campaigns = campaignsData?.campaigns || [];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Handle delete campaign
  const handleDeleteCampaign = async (campaignId, campaignName) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${campaignName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/donations/${campaignId}/admin`);
        
        queryClient.invalidateQueries(['all-donations', page]);
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Campaign has been deleted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete campaign',
          icon: 'error',
        });
      }
    }
  };

  // Handle update campaign status
  const handleUpdateStatus = async (campaignId, campaignName, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'pause';
    
    const confirm = await Swal.fire({
      title: 'Update Campaign Status',
      text: `Do you want to ${action} "${campaignName}"? ${newStatus === 'paused' ? 'Campaign will be visible but donations will be disabled.' : 'Campaign will be active and accept donations.'}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.put(`/donations/${campaignId}/admin-status`, { status: newStatus });
        
        queryClient.invalidateQueries(['all-donations', page]);
        
        Swal.fire({
          title: 'Success!',
          text: `Campaign has been ${action}d successfully`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update campaign status',
          icon: 'error',
        });
      }
    }
  };

  // Handle edit campaign
  const handleEditCampaign = (campaignId) => {
    navigate(`/dashboard/edit-campaign/${campaignId}`);
  };

  // Handle view campaign
  const handleViewCampaign = (campaignId) => {
    navigate(`/campaign-details/${campaignId}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate progress percentage
  const calculateProgress = (current, max) => {
    return (current / max) * 100;
  };

  return (
    <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
          All Donation Campaigns
        </h2>
        <div className="text-sm text-secondary/60">
          Total Campaigns: {totalCampaigns}
        </div>
      </div>

      {(isLoading || loading) ? (
        <AllDonationsSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Error loading campaigns
          </h3>
          <p className="text-secondary/60 mb-4">
            {error.message || 'Failed to load campaigns'}
          </p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            No campaigns found
          </h3>
          <p className="text-secondary/60">
            No donation campaigns have been created yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra min-w-max w-full">
            <thead>
              <tr className="bg-primary/10">
                <th>#</th>
                <th>Campaign Image</th>
                <th>Campaign Name</th>
                <th>Creator</th>
                <th>Goal</th>
                <th>Raised</th>
                <th>Progress</th>
                <th>Status</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, idx) => (
                <tr key={campaign._id || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {campaign.petImage ? (
                      <img 
                        src={campaign.petImage} 
                        alt={campaign.petName} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-secondary font-bold">
                        🐾
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="font-medium text-secondary">
                      {campaign.petName}
                    </div>
                    <div className="text-sm text-secondary/60">
                      {campaign.shortDescription}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-secondary/70">
                      {campaign.userName}
                    </div>
                    <div className="text-xs text-secondary/50">
                      {campaign.userEmail}
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-secondary">
                      {formatCurrency(campaign.maxAmount)}
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-primary">
                      {formatCurrency(campaign.totalDonations || 0)}
                    </div>
                  </td>
                  <td>
                    <div className="w-full bg-base-300 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(campaign.totalDonations || 0, campaign.maxAmount)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-secondary/60 mt-1">
                      {calculateProgress(campaign.totalDonations || 0, campaign.maxAmount).toFixed(1)}%
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      campaign.status === 'active' ? 'badge-success' : 
                      campaign.status === 'paused' ? 'badge-warning' : 
                      campaign.status === 'completed' ? 'badge-info' : 'badge-error'
                    }`}>
                      {campaign.status === 'active' ? 'Active' : 
                       campaign.status === 'paused' ? 'Paused' : 
                       campaign.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewCampaign(campaign._id)}
                        className="btn btn-sm btn-info text-base-100"
                        title="View Campaign"
                      >
                        <FaEye />
                      </button>
                      
                      <button
                        onClick={() => handleUpdateStatus(campaign._id, campaign.petName, campaign.status)}
                        className={`btn btn-sm ${campaign.status === 'active' ? 'btn-warning' : 'btn-success'} text-base-100`}
                        title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                        disabled={campaign.status === 'completed' || campaign.status === 'cancelled'}
                      >
                        {campaign.status === 'active' ? <FaPause /> : <FaPlay />}
                        {campaign.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => handleEditCampaign(campaign._id)}
                        className="btn btn-sm btn-primary text-base-100"
                        title="Edit Campaign"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCampaign(campaign._id, campaign.petName)}
                        className="btn btn-sm btn-error text-base-100"
                        title="Delete Campaign"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Component */}
      {campaigns.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 mt-6">
          {/* Page Info */}
          <div className="text-sm text-secondary/60">
            Showing page {page} of {totalPages} 
            {totalCampaigns > 0 && (
              <span className="ml-2">
                ({totalCampaigns} total campaigns)
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
  );
};

export default AllDonations;