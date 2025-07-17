import React, { useState, useEffect } from 'react';
import SectionTitle from '../../pages/Shared/Component/SectionTitle';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DonationCampaigns = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const limit = 9; // 3x3 grid per page
  

  // Fetch campaigns with pagination
  const { data: campaignsData, error, isLoading, isFetching } = useQuery({
    queryKey: ['donation-campaigns', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  // Update campaigns and pagination info when new data is fetched
  useEffect(() => {
    if (campaignsData) {
      setTotalPages(campaignsData.totalPages || 1);
      setTotalCampaigns(campaignsData.totalCampaigns || 0);
    }
  }, [campaignsData]);

  // Calculate progress percentage
  const calculateProgress = (totalDonations, maxAmount) => {
    return (totalDonations / maxAmount) * 100;
  };

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

  // Campaign Card Component
  const CampaignCard = ({ campaign }) => {
    const progress = calculateProgress(campaign.totalDonations || 0, campaign.maxAmount);
    
    return (
      <div className="bg-base-100 rounded shadow overflow-hidden hover:shadow-md hover:-translate-y-2 transition-all duration-300 h-[500px] flex flex-col border border-primary/20 hover:border-primary/30">
        {/* Pet Image */}
        <div className="relative h-48 overflow-hidden group">
          <img
            src={campaign.petImage}
            alt={campaign.shortDescription}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <span className={`badge badge-sm ${campaign.status === 'active' ? 'badge-success' : 'badge-warning'} shadow-lg`}>
              {campaign.status === 'active' ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Campaign Name */}
          <h3 className="text-lg font-semibold text-secondary mb-2">
            { campaign.shortDescription}
          </h3>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-secondary/60 mb-2">
              <span className="font-medium">${campaign.totalDonations || 0} raised</span>
              <span className="font-medium">${campaign.maxAmount} goal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs text-secondary/60 font-medium">{progress.toFixed(1)}% complete</span>
          </div>

          {/* Campaign Details */}
          <div className="space-y-2 mb-4 flex-1">
            <p className="text-sm text-secondary/60 line-clamp-3">
              {campaign.longDescription && campaign.longDescription.length > 100 
                ? `${campaign.longDescription.slice(0, 90)}...` 
                : campaign.longDescription || 'No description available'
              }
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary/60">
                Created by: {campaign.userName}
              </span>
              <span className="text-secondary/60">
                {(() => {
                  const lastDate = new Date(campaign.lastDate);
                  const today = new Date();
                  // Zero out the time for accurate day difference
                  lastDate.setHours(0,0,0,0);
                  today.setHours(0,0,0,0);
                  const timeDiff = lastDate - today;
                  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                  return daysLeft > 0 ? `${daysLeft} Days left` : "Ended";
                })()}
              </span>
            </div>
          </div>

          {/* View Details Button */}
          <button
            onClick={() => navigate(`/campaign-details/${campaign._id}`)}
            className="btn btn-primary w-full text-base-100 mt-auto transition-all duration-300 shadow hover:shadow-md"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  // Loading skeleton for cards
  const CampaignCardSkeleton = () => (
    <div className="bg-base-100 rounded shadow-lg overflow-hidden h-[500px] flex flex-col">
      <Skeleton height={192} /> {/* Image */}
      <div className="p-4">
        <Skeleton height={24} className="mb-2" /> {/* Title */}
        <Skeleton height={16} className="mb-1" /> {/* Progress text */}
        <Skeleton height={8} className="mb-1" /> {/* Progress bar */}
        <Skeleton height={12} className="mb-3" /> {/* Progress percentage */}
        <Skeleton height={16} count={3} className="mb-2" /> {/* Description */}
        <Skeleton height={16} className="mb-4" /> {/* Date */}
        <Skeleton height={40} /> {/* Button */}
      </div>
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = getPageNumbers();
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              Error loading campaigns
            </h3>
            <p className="text-secondary/60 mb-4">
              {error.message || 'Failed to load donation campaigns'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-8 md:py-12 lg:py-16 max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <SectionTitle
          label="Support a Cause"
          labelPosition="center"
          title="Donation Campaigns"
          titlePosition="center"
        />
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lg text-secondary/60 max-w-2xl mx-auto">
            Support pets in need by contributing to these donation campaigns. 
            Every contribution makes a difference in their lives.
          </p>
        </div>

        {/* Campaigns Grid */}
        {campaignsData?.campaigns?.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              No campaigns available
            </h3>
            <p className="text-secondary/60 mb-4">
              Check back later for new donation campaigns
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Existing Campaigns */}
            {campaignsData?.campaigns?.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}

            {/* Loading Skeletons */}
            {isLoading && (
              <>
                {[...Array(6)].map((_, index) => (
                  <CampaignCardSkeleton key={index} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}

        {/* Loading Indicator */}
        {isFetching && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-secondary/60">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading campaigns...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCampaigns;