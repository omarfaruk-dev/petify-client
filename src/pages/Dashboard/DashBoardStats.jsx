
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CountUp from 'react-countup';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaPaw, FaRibbon, FaHeart, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DashBoardStats = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch pets using React Query
  const { data = {}, error, isLoading } = useQuery({
    queryKey: ['my-pets', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets?email=${user.email}`);
      return res.data;
    }
  });
  const { pets = [], totalPets = 0 } = data;

  // Fetch campaigns using React Query (reference: MyCampaign.jsx)
  const { data: campaignsData = { campaigns: [] }, isLoading: isCampaignsLoading, error: campaignsError } = useQuery({
    queryKey: ['my-campaigns', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/user/${user.email}`);
      if (Array.isArray(res.data)) {
        return { campaigns: res.data };
      }
      return res.data;
    }
  });
  const campaigns = campaignsData.campaigns;

  // Fetch donations using React Query (reference: MyDonations.jsx)
  const { data: donations = [], isLoading: isDonationsLoading, error: donationsError } = useQuery({
    queryKey: ['my-donations', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch all adoption requests (reference: AdoptionRequest.jsx)
  const { data: adoptions = [], isLoading: isAdoptionsLoading, error: adoptionsError } = useQuery({
    queryKey: ['adoptions'],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/adoptions');
      return res.data;
    }
  });
  // Filter: Only requests for pets added by the current user
  const myAdoptions = adoptions.filter(req => req.petOwnerEmail === user?.email);

  // Calculate total donated amount
  const totalDonatedAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);

  if (isLoading || isCampaignsLoading || isDonationsLoading || isAdoptionsLoading) {
    // Skeleton loader for dashboard stats (with card color match)
    return (
      <div className="flex flex-col gap-6 w-full">
        {/* Welcome Message Skeleton */}
        <div className="mb-2">
          <Skeleton width={220} height={36} className="mb-2" />
          <Skeleton width={320} height={20} />
        </div>
        {/* First row: 3 cards skeleton (match card colors) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div className="bg-cyan-50 shadow rounded p-7 flex flex-col items-center border border-cyan-100">
            <Skeleton circle width={56} height={56} className="mb-3" />
            <Skeleton width={120} height={24} className="mb-2" />
            <Skeleton width={80} height={36} />
          </div>
          <div className="bg-yellow-50 shadow rounded p-7 flex flex-col items-center border border-yellow-100">
            <Skeleton circle width={56} height={56} className="mb-3" />
            <Skeleton width={120} height={24} className="mb-2" />
            <Skeleton width={80} height={36} />
          </div>
          <div className="bg-pink-50 shadow rounded p-7 flex flex-col items-center border border-pink-100">
            <Skeleton circle width={56} height={56} className="mb-3" />
            <Skeleton width={120} height={24} className="mb-2" />
            <Skeleton width={80} height={36} />
          </div>
        </div>
        {/* Second row: 2 cards skeleton (match card colors) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-blue-50 shadow rounded p-7 flex flex-col items-center border border-blue-100">
            <Skeleton circle width={56} height={56} className="mb-3" />
            <Skeleton width={160} height={24} className="mb-2" />
            <Skeleton width={100} height={36} />
          </div>
          <div className="bg-green-50 shadow rounded p-7 flex flex-col items-center border border-green-100">
            <Skeleton circle width={56} height={56} className="mb-3" />
            <Skeleton width={160} height={24} className="mb-2" />
            <Skeleton width={100} height={36} />
          </div>
        </div>
        {/* Chart skeleton */}
        <div className="w-full bg-primary/5 rounded shadow p-6 mt-2">
          <Skeleton width={220} height={28} className="mb-4" />
          <div className="flex justify-center items-center w-full" style={{ minHeight: 340 }}>
            <Skeleton circle width={220} height={220} />
          </div>
        </div>
      </div>
    );
  }
  if (error || campaignsError || donationsError || adoptionsError) return <div>Error loading stats.</div>;

  // Chart data (without donation amount)
  const chartData = [
    { name: 'Added Pets', value: pets.length },
    { name: 'Campaigns', value: campaigns.length },
    { name: 'Donations', value: donations.length },
    { name: 'Adoption Requests', value: myAdoptions.length },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Welcome Message */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}!
        </h1>
        <div className="w-30 md:w-80 ">
          {/* <Lottie animationData={welcomeLottie} loop={true} /> */}
        </div>
        <p className="text-secondary/70 text-base md:text-lg">Here's a quick overview of your activity and impact on Petify.</p>
      </div>
      {/* First row: 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* My Added Pets */}
        <div className="bg-cyan-50 hover:bg-cyan-100 shadow rounded p-7 flex flex-col items-center border border-cyan-100 hover:shadow-md transition group">
          <span className="text-5xl mb-3 text-primary group-hover:scale-110 transition-transform"><FaPaw /></span>
          <h2 className="text-lg font-bold text-primary mb-1 tracking-wide">My Added Pets</h2>
          <p className="text-3xl font-extrabold text-primary drop-shadow">
            <CountUp end={totalPets} duration={3} separator="," />
          </p>
        </div>
        {/* My Campaigns */}
        <div className="bg-yellow-50 hover:bg-yellow-100 shadow rounded p-7 flex flex-col items-center border border-yellow-100 hover:shadow-md transition group">
          <span className="text-5xl mb-3 text-yellow-500 group-hover:scale-110 transition-transform"><FaRibbon /></span>
          <h2 className="text-lg font-bold text-primary mb-1 tracking-wide">My Campaigns</h2>
          <p className="text-3xl font-extrabold text-yellow-600 drop-shadow">
            <CountUp end={campaigns.length} duration={3} separator="," />
          </p>
        </div>
        {/* My Donations */}
        <div className="bg-pink-50 hover:bg-pink-100 shadow rounded p-7 flex flex-col items-center border border-pink-100 hover:shadow-md transition group">
          <span className="text-5xl mb-3 text-pink-500 group-hover:scale-110 transition-transform"><FaHeart /></span>
          <h2 className="text-lg font-bold text-primary mb-1 tracking-wide">My Donations</h2>
          <p className="text-3xl font-extrabold text-pink-600 drop-shadow">
            <CountUp end={donations.length} duration={3} separator="," />
          </p>
        </div>
      </div>
      {/* Second row: 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* My Pet Adoption Requests */}
        <div className="bg-blue-50 hover:bg-blue-100 shadow rounded p-7 flex flex-col items-center border border-blue-100 hover:shadow-md transition group">
          <span className="text-5xl mb-3 text-blue-500 group-hover:scale-110 transition-transform"><FaClipboardList /></span>
          <h2 className="text-lg font-bold text-primary mb-1 tracking-wide">My Pet Adoption Requests</h2>
          <p className="text-3xl font-extrabold text-blue-600 drop-shadow">
            <CountUp end={myAdoptions.length} duration={3} separator="," />
          </p>
        </div>
        {/* Total Donated Amount */}
        <div className="bg-green-50 hover:bg-green-100 shadow rounded p-7 flex flex-col items-center border border-green-100 hover:shadow-md transition group">
          <span className="text-5xl mb-3 text-green-500 group-hover:scale-110 transition-transform"><FaMoneyBillWave /></span>
          <h2 className="text-lg font-bold text-primary mb-1 tracking-wide">Total Donated Amount</h2>
          <p className="text-3xl font-extrabold text-green-600 drop-shadow">
            $<CountUp end={totalDonatedAmount} duration={3} separator="," decimals={2} decimal="." />
          </p>
        </div>
      </div>

      {/* Stats Chart */}
      <div className="w-full bg-primary/5 rounded shadow p-6 mt-2">
        <h3 className="text-xl font-bold text-primary mb-4">Your Petify Activity Overview</h3>
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={60}
              fill="#14B8A6"
              label={({ name, value }) => `${name}: ${(Number(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              paddingAngle={2}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={['#14B8A6', '#facc99', '#ec4899', '#3b82f6', '#22c55e'][idx % 5]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashBoardStats;