import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Swal from 'sweetalert2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MyCampaign = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDonatorsModal, setShowDonatorsModal] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const limit = 10; // Show 10 campaigns per page

  // Fetch campaigns using React Query with pagination
  const { data: campaignsData, error, isLoading } = useQuery({
    queryKey: ['my-campaigns', user?.email, page],
    enabled: !!user?.email,
    queryFn: async () => {
      console.log('Fetching campaigns for user:', user.email, 'page:', page);
      try {
        const res = await axiosSecure.get(`/donations/user/${user.email}?page=${page}&limit=${limit}`);
        console.log('Campaigns response:', res.data);
        
        // Handle both old format (array) and new format (object with campaigns property)
        if (Array.isArray(res.data)) {
          // Old format - convert to new format
          return {
            campaigns: res.data,
            totalPages: 1,
            totalCampaigns: res.data.length,
            currentPage: 1,
            hasMore: false
          };
        }
        
        return res.data;
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  // Update pagination info when data changes
  React.useEffect(() => {
    if (campaignsData) {
      setTotalPages(campaignsData.totalPages || 1);
      setTotalCampaigns(campaignsData.totalCampaigns || 0);
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

  // Handle pause/unpause campaign
  const handleTogglePause = async (id, currentStatus) => {
    const action = currentStatus === 'active' ? 'pause' : 'unpause';
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `This will ${action} the donation campaign!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it`,
      cancelButtonText: "Cancel",
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#d33',
    });

    if (confirm.isConfirmed) {
      try {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        
        // Optimistically update the campaign status
        queryClient.setQueryData(['my-campaigns', user?.email, page], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            campaigns: oldData.campaigns.map(campaign => 
              campaign._id === id ? { ...campaign, status: newStatus } : campaign
            )
          };
        });

        const res = await axiosSecure.put(`/donations/${id}/status`, { status: newStatus });

        if (res.status === 200) {
          Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)}d!`,
            text: `Campaign has been ${action}d.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          // Invalidate and refetch to ensure data consistency
          await queryClient.invalidateQueries(['my-campaigns', user?.email]);
        } else {
          // If update failed, refetch to restore the original data
          await queryClient.invalidateQueries(['my-campaigns', user?.email]);
          Swal.fire("Error", "Failed to update campaign status", "error");
        }
      } catch (err) {
        // If there's an error, refetch to restore the original data
        await queryClient.invalidateQueries(['my-campaigns', user?.email]);
        Swal.fire("Error", err.message || "Failed to update campaign status", "error");
      }
    }
  };

  // Handle view donators
  const handleViewDonators = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDonatorsModal(true);
  };

  // Calculate progress percentage
  const calculateProgress = (currentAmount, maxAmount) => {
    if (!maxAmount || maxAmount <= 0) return 0;
    return Math.min((currentAmount / maxAmount) * 100, 100);
  };

  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.display({
      id: 'serial',
      header: () => 'Serial No.',
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
      enableSorting: false,
    }),
    columnHelper.accessor('shortDescription', {
      header: () => 'Campaign Name',
      cell: info => <span className="font-medium text-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('maxAmount', {
      header: () => 'Maximum Amount',
      cell: info => <span className="font-medium">${info.getValue()}</span>,
      sortingFn: 'basic',
    }),
    columnHelper.display({
      id: 'progress',
      header: () => 'Donation Progress',
      cell: ({ row }) => {
        const campaign = row.original;
        const currentAmount = campaign.totalDonations || 0;
        const progress = calculateProgress(currentAmount, campaign.maxAmount);
        return (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>${currentAmount}</span>
              <span>${campaign.maxAmount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{progress.toFixed(1)}%</span>
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: info => (
        <span className={`badge ${info.getValue() === 'active' ? 'badge-success' : 'badge-warning'}`}>
          {info.getValue() === 'active' ? 'Active' : 'Paused'}
        </span>
      ),
      sortingFn: 'basic',
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleTogglePause(row.original._id, row.original.status)}
            className={`btn btn-sm ${row.original.status === 'active' ? 'btn-warning' : 'btn-success'}`}
          >
            {row.original.status === 'active' ? 'Pause' : 'Unpause'}
          </button>
          <button
            onClick={() => navigate(`/dashboard/edit-campaign/${row.original._id}`)}
            className="btn btn-sm btn-primary text-base-100"
          >
            Edit
          </button>
          <button 
            onClick={() => handleViewDonators(row.original)}
            className="btn btn-sm btn-info text-base-100"
          >
            View Donators
          </button>
        </div>
      ),
      enableSorting: false,
    }),
  ];

  const table = useReactTable({
    data: campaigns,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = getPageNumbers();
    
    return (
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
            {pageNumbers.map((pageNum) => (
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
    );
  };

  // Loading skeleton
  if (isLoading || loading) {
    return (
      <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton height={40} width={200} />
          <Skeleton height={40} width={120} />
        </div>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra min-w-max w-full">
            <thead>
              <tr className='bg-primary/10'>
                <th><Skeleton height={20} width={80} /></th>
                <th><Skeleton height={20} width={120} /></th>
                <th><Skeleton height={20} width={120} /></th>
                <th><Skeleton height={20} width={140} /></th>
                <th><Skeleton height={20} width={80} /></th>
                <th><Skeleton height={20} width={200} /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td><Skeleton height={20} width={40} /></td>
                  <td><Skeleton height={20} width={100} /></td>
                  <td><Skeleton height={20} width={80} /></td>
                  <td><Skeleton height={40} width={120} /></td>
                  <td><Skeleton height={20} width={60} /></td>
                  <td>
                    <div className="flex gap-2">
                      <Skeleton height={32} width={60} />
                      <Skeleton height={32} width={60} />
                      <Skeleton height={32} width={80} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary mb-6">
          My Campaigns
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Error loading campaigns
          </h3>
          <p className="text-secondary/60 mb-4">
            {error || 'Failed to load campaigns'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
          My Campaigns
        </h2>
        <button
          onClick={() => navigate('/dashboard/create-campaign')}
          className="btn btn-primary text-base-100"
        >
          Create New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            No campaigns created yet
          </h3>
          <p className="text-secondary/60 mb-4">
            Start by creating your first donation campaign
          </p>
          <button
            onClick={() => navigate('/dashboard/create-campaign')}
            className="btn btn-primary"
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra min-w-max w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className='bg-primary/10'>
                    {headerGroup.headers.map(header => {
                      const isSortable = header.column.getCanSort();
                      const sortDir = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                          className={isSortable ? 'cursor-pointer select-none' : ''}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && (
                            <span className="ml-1">
                              {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕'}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
                          <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="h-8">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            </table>
          </div>

          {/* Show pagination if there are more than 10 campaigns */}
          {totalCampaigns > 10 && <Pagination />}
        </>
      )}

      {/* Donators Modal */}
      {showDonatorsModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-secondary">
                Donators for "{selectedCampaign.shortDescription}"
              </h3>
              <button
                onClick={() => setShowDonatorsModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-secondary/60">
                Total Raised: ${selectedCampaign.totalDonations || 0} / ${selectedCampaign.maxAmount}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress(selectedCampaign.totalDonations || 0, selectedCampaign.maxAmount)}%` }}
                ></div>
              </div>
              <p className="text-xs text-secondary/60">
                Progress: {calculateProgress(selectedCampaign.totalDonations || 0, selectedCampaign.maxAmount).toFixed(1)}%
              </p>
            </div>

            {/* Placeholder for donators list - you can implement this later */}
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎁</div>
              <h4 className="text-lg font-semibold text-secondary mb-2">
                No donators yet
              </h4>
              <p className="text-secondary/60">
                This feature will show the list of donators and their contribution amounts.
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDonatorsModal(false)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCampaign;