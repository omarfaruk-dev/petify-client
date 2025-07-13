import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const stripePromise = loadStripe(import.meta.env.VITE_payment_Key);

// Stripe donation form component
const DonationForm = ({ campaign, amount, setAmount, onSuccess, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!stripe || !elements) return;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }
    setProcessing(true);
    try {
      // 1. Create payment intent
      const { data } = await axiosSecure.post('/create-payment-intent', {
        amountInCents: Math.round(Number(amount) * 100),
      });
      const clientSecret = data.clientSecret;
      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || user?.email || 'Anonymous',
            email: user?.email,
          },
        },
      });
      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setProcessing(false);
        return;
      }
      if (paymentResult.paymentIntent.status === 'succeeded') {
        // 3. Record payment in DB
        await axiosSecure.post('/payments', {
          campaignId: campaign._id,
          email: user?.email,
          donorName: user?.displayName || '',
          amount: Number(amount),
          paymentMethod: ['card'],
          transactionId: paymentResult.paymentIntent.id,
        });
        setProcessing(false);
        // Show Swal confirmation
        Swal.fire({
          title: 'Thank you for your donation!',
          html: `<div style='margin-bottom:8px;'>Your transaction ID:</div><div class='swal2-code' style='font-size:1rem;word-break:break-all;background:#f3f4f6;padding:8px 12px;border-radius:4px;margin-bottom:12px;'>${paymentResult.paymentIntent.id}</div>`,
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'My Donations',
          confirmButtonColor: '#14B8A6',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard/my-donations');
          }
        });
        onSuccess();
      } else {
        setError('Payment was not successful.');
        setProcessing(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Payment failed.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2 text-secondary font-semibold">Donation Amount ($)</label>
      <input
        type="number"
        min="1"
        step="1"
        className="input input-bordered border-primary/30 w-full mb-4 focus:outline-none"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        disabled={processing}
      />
      <label className="block mb-2 text-secondary font-semibold">Card Details</label>
      <div className="border border-primary/30 rounded p-3 mb-4 bg-base-200">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <div className="text-error mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary text-base-100 w-full" disabled={processing}>
        {processing ? 'Processing...' : 'Donate'}
      </button>
      <button type="button" className="btn btn-primary btn-outline text-primary hover:text-base-100 w-full mt-2" onClick={onClose} disabled={processing}>
        Cancel
      </button>
    </form>
  );
};

const CampaignDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [showModal, setShowModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [success, setSuccess] = useState(false);

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
  const { data: recommendedData = [], isLoading: recLoading } = useQuery({
    queryKey: ['recommended-campaigns', id],
    queryFn: async () => {
      const res = await axiosSecure.get('/donations?status=active&limit=6');
      const campaigns = res.data.campaigns || res.data || [];
      const filtered = campaigns.filter(c => c._id !== id);
      return filtered.slice(0, 3);
    },
    enabled: !!id,
    retry: 1,
    retryDelay: 1000,
  });

  // Get recommended campaigns safely
  const recommended = recommendedData || [];

  // Progress calculation
  const getProgress = (total, max) => Math.min((total / max) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Campaign Details */}
      <div className="bg-base-100 rounded shadow-md p-6 mb-10">
        {loading ? (
          <Skeleton height={400} />
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
              <img src={campaign.petImage} alt={campaign.shortDescription} className="hover:scale-102 transition-transform duration-500 rounded w-full h-64 object-cover" />
            </div>
            {/* Info */}
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-secondary mb-2">{campaign.shortDescription}</h2>
              <p className="text-secondary/70 mb-2">{campaign.longDescription}</p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary/60">
                <span>Created by: <b>{campaign.userName}</b></span>
                <span>Deadline: {new Date(campaign.lastDate).toLocaleDateString()}</span>
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
              <button className="btn btn-primary text-base-100 w-full md:w-auto mt-4" onClick={() => { setShowModal(true); setSuccess(false); }} disabled={campaign.status !== 'active'}>
                Donate Now
              </button>
              {campaign.status === 'paused' && (
                <div className="alert alert-warning mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  <span>This campaign is currently paused. Donations are temporarily disabled.</span>
                </div>
              )}
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
          <div className="bg-base-100 rounded p-6 w-full max-w-md mx-4 relative">
            <button className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            <h3 className="text-xl font-bold mb-4 text-secondary">Donate to "{campaign?.shortDescription}"</h3>
            {success ? (
              <div className="text-success text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-lg font-semibold mb-2">Thank you for your donation!</div>
                <button className="btn btn-primary mt-4 w-full" onClick={() => setShowModal(false)}>Close</button>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <DonationForm
                  campaign={campaign}
                  amount={donationAmount}
                  setAmount={setDonationAmount}
                  onSuccess={() => { setSuccess(true); setDonationAmount(''); }}
                  onClose={() => setShowModal(false)}
                />
              </Elements>
            )}
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
              <div key={rec._id} className="bg-base-100 rounded shadow p-4 flex flex-col border border-primary/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-300">
                <img src={rec.petImage} alt={rec.shortDescription} className="w-full h-32 object-cover rounded mb-3 hover:scale-105 transition-transform duration-500" />
                <h4 className="text-lg font-semibold text-secondary mb-1 line-clamp-1">{rec.shortDescription}</h4>
                <p className="text-xs text-secondary/60 mb-2 line-clamp-2">{rec.longDescription?.slice(0, 60) || 'No description'}</p>
                <div className="flex justify-between text-xs text-secondary/60 mb-2">
                  <span>${rec.totalDonations || 0} raised</span>
                  <span>${rec.maxAmount} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${getProgress(rec.totalDonations || 0, rec.maxAmount)}%` }}></div>
                </div>
                <button className="btn btn-sm btn-primary text-base-100 mt-auto" onClick={() => window.location.href = `/campaign-details/${rec._id}`}>View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;