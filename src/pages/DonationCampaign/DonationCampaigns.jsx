import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DonationCampaigns = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
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

  // Update campaigns when new data is fetched
  useEffect(() => {
    if (campaignsData) {
      if (page === 1) {
        setCampaigns(campaignsData.campaigns || []);
      } else {
        setCampaigns(prev => [...prev, ...(campaignsData.campaigns || [])]);
      }
      setHasMore(campaignsData.hasMore || false);
    }
  }, [campaignsData, page]);

  // Calculate progress percentage
  const calculateProgress = (totalDonations, maxAmount) => {
    return Math.min((totalDonations / maxAmount) * 100, 100);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 &&
      !isFetching &&
      hasMore
    ) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                style={{ width: `${progress}%` }}
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
                {new Date(campaign.createdAt).toLocaleDateString()}
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-4">
            Donation Campaigns
          </h1>
          <p className="text-lg text-secondary/60 max-w-2xl mx-auto">
            Support pets in need by contributing to these donation campaigns. 
            Every contribution makes a difference in their lives.
          </p>
        </div>

        {/* Campaigns Grid */}
        {campaigns.length === 0 && !isLoading ? (
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
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}

            {/* Loading Skeletons */}
            {isLoading && page === 1 && (
              <>
                {[...Array(6)].map((_, index) => (
                  <CampaignCardSkeleton key={index} />
                ))}
              </>
            )}

            {/* Additional Loading Skeletons for Infinite Scroll */}
            {isFetching && page > 1 && (
              <>
                {[...Array(3)].map((_, index) => (
                  <CampaignCardSkeleton key={`loading-${index}`} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Loading More Indicator */}
        {isFetching && page > 1 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-secondary/60">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading more campaigns...</span>
            </div>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && campaigns.length > 0 && (
          <div className="text-center py-8">
            <p className="text-secondary/60">
              You've reached the end of all campaigns
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCampaigns;