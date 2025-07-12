import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useQuery } from '@tanstack/react-query';

const CampaignDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [showModal, setShowModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(true);

  // Fetch campaign details using TanStack Query
  const { data: campaign, isLoading: loading, error } = useQuery({
    queryKey: ['campaign-details', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch recommended campaigns (3 active, not current)
  useEffect(() => {
    setRecLoading(true);
    axiosSecure.get('/donations?status=active&limit=6')
      .then(res => {
        const filtered = (res.data.campaigns || res.data || []).filter(c => c._id !== id);
        setRecommended(filtered.slice(0, 3));
      })
      .catch(() => setRecommended([]))
      .finally(() => setRecLoading(false));
  }, [id, axiosSecure]);

  // Progress calculation
  const getProgress = (total, max) => Math.min((total / max) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Campaign Details */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-10">
        {loading ? (
          <Skeleton height={300} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">Error loading campaign</h3>
            <p className="text-secondary/60 mb-4">{error.message || 'Failed to load campaign details.'}</p>
          </div>
        ) : campaign ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="md:w-1/2 w-full flex-shrink-0">
              <img src={campaign.petImage} alt={campaign.shortDescription} className="rounded-lg w-full h-64 object-cover" />
            </div>
            {/* Info */}
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-secondary mb-2">{campaign.shortDescription}</h2>
              <p className="text-secondary/70 mb-2">{campaign.longDescription}</p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary/60">
                <span>Created by: <b>{campaign.userName}</b></span>
                <span>Date: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                <span>Status: <span className={`badge ${campaign.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{campaign.status}</span></span>
              </div>
              {/* Progress */}
              <div className="my-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>${campaign.totalDonations || 0} raised</span>
                  <span>${campaign.maxAmount} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500" style={{ width: `${getProgress(campaign.totalDonations || 0, campaign.maxAmount)}%` }}></div>
                </div>
                <span className="text-xs text-secondary/60 font-medium">{getProgress(campaign.totalDonations || 0, campaign.maxAmount).toFixed(1)}% complete</span>
              </div>
              {/* Donate Now Button */}
              <button className="btn btn-primary w-full md:w-auto mt-4" onClick={() => setShowModal(true)} disabled={campaign.status !== 'active'}>
                Donate Now
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">Campaign not found</h3>
            <p className="text-secondary/60 mb-4">This donation campaign does not exist or was removed.</p>
          </div>
        )}
      </div>

      {/* Donate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-secondary/20 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-md mx-4 relative">
            <button className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            <h3 className="text-xl font-bold mb-4 text-secondary">Donate to "{campaign?.shortDescription}"</h3>
            <form onSubmit={e => { e.preventDefault(); /* Payment logic will go here */ }}>
              <label className="block mb-2 text-secondary font-semibold">Donation Amount ($)</label>
              <input
                type="number"
                min="1"
                step="1"
                className="input input-bordered w-full mb-4"
                placeholder="Enter amount"
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
                required
              />
              <label className="block mb-2 text-secondary font-semibold">Card Details</label>
              <div className="border border-primary/30 rounded p-3 mb-4 bg-base-200 text-center">
                {/* Stripe CardElement will go here */}
                <span className="text-secondary/60">[Stripe Card Element Placeholder]</span>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={!donationAmount}>
                Donate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Recommended Donations */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-secondary mb-6">Recommended Donations</h3>
        {recLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} height={220} />)}
          </div>
        ) : recommended.length === 0 ? (
          <div className="text-secondary/60">No recommended campaigns found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map(rec => (
              <div key={rec._id} className="bg-base-100 rounded shadow p-4 flex flex-col border border-primary/10 hover:border-primary/30 transition-all duration-300">
                <img src={rec.petImage} alt={rec.shortDescription} className="w-full h-32 object-cover rounded mb-3" />
                <h4 className="text-lg font-semibold text-secondary mb-1 line-clamp-1">{rec.shortDescription}</h4>
                <p className="text-xs text-secondary/60 mb-2 line-clamp-2">{rec.longDescription?.slice(0, 60) || 'No description'}</p>
                <div className="flex justify-between text-xs text-secondary/60 mb-2">
                  <span>${rec.totalDonations || 0} raised</span>
                  <span>${rec.maxAmount} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${getProgress(rec.totalDonations || 0, rec.maxAmount)}%` }}></div>
                </div>
                <button className="btn btn-sm btn-primary mt-auto" onClick={() => window.location.href = `/campaign-details/${rec._id}`}>View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;