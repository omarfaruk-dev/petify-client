import React, { useState, useEffect } from 'react';
import { FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import SectionTitle from '../Shared/Component/SectionTitle';

const RecentPets = () => {
  const [latestPets, setLatestPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchLatestPets = async () => {
      try {
        console.log('Fetching latest pets...');
        const response = await axiosInstance.get('/pets/available?page=1&limit=8');
        console.log('API Response:', response);
        console.log('Pets data:', response.data);
        console.log('Pets array:', response.data.data);
        
        if (response.data && response.data.data) {
          setLatestPets(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setLatestPets(response.data);
        } else {
          console.warn('Unexpected data structure:', response.data);
          setLatestPets([]);
        }
      } catch (error) {
        console.error('Error fetching latest pets:', error);
        setError(error.message);
        setLatestPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPets();
  }, [axiosInstance]);

  console.log('Current state - loading:', loading, 'pets:', latestPets, 'error:', error);

  if (loading) {
    return (
      <section className="py-5 md:mb-16 lg:mb-20 relative w-full max-w-7xl mx-auto px-4 overflow-hidden">
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <SectionTitle title='Latest Pets Available' labelPosition='center' label='Available Pets' titlePosition='center'/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="rounded bg-base-200 shadow hover:shadow-md transition-shadow duration-300 p-4">
              <div className="mb-4">
                <div className="h-48 w-full rounded-xl bg-base-300 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-base-300 rounded animate-pulse"></div>
                <div className="h-4 bg-base-300 rounded animate-pulse"></div>
                <div className="h-4 bg-base-300 rounded animate-pulse"></div>
                <div className="h-8 bg-base-300 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5 md:mb-16 lg:mb-20 relative w-full max-w-7xl mx-auto px-4 overflow-hidden text-center">
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <SectionTitle title='Latest Pets Available' labelPosition='center' label='Available Pets' titlePosition='center'/>
        </div>
        <div className="mt-8">
          <p className="text-lg text-red-500 mb-4">Error loading pets: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!latestPets || latestPets.length === 0) {
    return (
      <section className="py-5 md:mb-16 lg:mb-20 relative w-full max-w-7xl mx-auto px-4 overflow-hidden text-center">
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <SectionTitle title='Latest Pets Available' labelPosition='center' label='Available Pets' titlePosition='center'/>
        </div>
        <div className="mt-8">
          <p className="text-lg text-secondary/60 mb-8">
            No pets available at the moment
          </p>
          <p className="text-sm text-secondary/40">
            Debug info: latestPets = {JSON.stringify(latestPets)}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 md:mb-16 lg:mb-20 relative w-full max-w-7xl mx-auto px-4 overflow-hidden">
      {/* Section Heading */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
      >
        <SectionTitle title='Recently Added Pets' labelPosition='center' label='Recent Pets' titlePosition='center'/>
      </div>

      {/* Debug Info */}
      <div className="text-center mb-4 text-sm text-secondary/60">
        Showing {latestPets.length} pets
      </div>

      {/* Pets Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-duration="800"
      >
        {latestPets.map((pet) => (
          <div
            key={pet._id}
            className="group relative rounded bg-base-100 shadow hover:shadow-md hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-primary/10 hover:border-primary/30"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={pet.petImage}
                alt={pet.petName}
                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-primary/90 text-base-100 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {(() => {
                  let categoryText = pet.petCategory;
                  if (categoryText && typeof categoryText === 'object') {
                    categoryText = categoryText.label || categoryText.name || categoryText.value || categoryText.category || Object.values(categoryText)[0];
                  }
                  return categoryText || 'Pet';
                })()}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 via-base-100/10 to-transparent opacity-80 pointer-events-none"></div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors duration-200 truncate">
                {pet.petName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-secondary/80">
                <span className="inline-flex items-center gap-1">
                  <FaBirthdayCake className="w-4 h-4 text-primary" />
                  {pet.petAge} Months
                </span>
                <span className="inline-flex items-center gap-1">
                  <FaMapMarkerAlt className="w-4 h-4 text-primary" />
                  {pet.petLocation}
                </span>
              </div>
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/pet-details/${pet._id}`}
                  className="btn btn-primary btn-sm text-base-100 px-5"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link
          to="/pet-listing"
          className="btn btn-outline btn-primary text-lg px-8 py-3 font-semibold hover:btn-primary hover:text-base-100 transition-all duration-300"
        >
          View All Available Pets
        </Link>
      </div>
    </section>
  );
};

export default RecentPets;