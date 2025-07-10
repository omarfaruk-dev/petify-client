import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import Spinner from '../Shared/Spinner';

const petCategories = [
  { value: '', label: 'All Categories' },
  { value: 'Cat', label: 'Cat' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Dog', label: 'Dog' },
  { value: 'Rabbit', label: 'Rabbit' },
  { value: 'Fish', label: 'Fish' },
  { value: 'Other', label: 'Other' },
];

const PetListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPets, setFilteredPets] = useState([]);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch all available pets
  const { data: pets = [], error, isLoading } = useQuery({
    queryKey: ['available-pets'],
    queryFn: async () => {
      const res = await axiosSecure.get('/pets/available');
      return res.data;
    }
  });

  // Filter pets based on search term and category
  useEffect(() => {
    let filtered = pets;

    // Filter by search term (pet name)
    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.petName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(pet =>
        pet.petCategory?.value === selectedCategory || 
        pet.petCategory === selectedCategory
      );
    }

    setFilteredPets(filtered);
  }, [pets, searchTerm, selectedCategory]);

  const handleViewDetails = (petId) => {
    navigate(`/pet-details/${petId}`);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Error loading pets
          </h3>
          <p className="text-secondary/60 mb-4">
            {error.message || 'Failed to load available pets'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className=" text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary mb-6">
          Available Pets
        </h2>
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Search Pets</span>
            </label>
            <input
              type="text"
              placeholder="Search by pet name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Filter by Category</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary rounded"
            >
              {petCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-secondary/60">
            Showing {filteredPets.length} of {pets.length} available pets
          </p>
        </div>
      </div>

      {/* Pets Grid */}
      {filteredPets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            {searchTerm || selectedCategory ? 'No pets found' : 'No pets available'}
          </h3>
          <p className="text-secondary/60 mb-4">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria'
              : 'Check back later for new pets'
            }
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet._id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Pet Image */}
              <figure className="px-6 pt-6">
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="rounded-xl w-full h-48 object-cover"
                />
              </figure>
              
              {/* Card Content */}
              <div className="card-body">
                <h3 className="card-title text-secondary font-bold text-lg">
                  {pet.petName}
                </h3>
                
                <div className="space-y-2">
                  {/* Date of Added */}
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium">Added Date:</span>
                    <span className="text-secondary">{pet.createdAt}</span>
                  </div>
                  {/* Age */}
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium">Age:</span>
                    <span className="text-secondary">{pet.petAge} years</span>
                  </div>
                  
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium">Category:</span>
                    <span className="text-secondary">
                      {pet.petCategory?.label || pet.petCategory?.value || pet.petCategory || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium">Location:</span>
                    <span className="text-secondary">{pet.petLocation}</span>
                  </div>
                </div>
                
                {/* View Details Button */}
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => handleViewDetails(pet._id)}
                    className="btn btn-primary btn-sm text-base-100"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetListing;