import React, { useState, useEffect } from 'react';
import { FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa';
import SectionTitle from '../Shared/Component/SectionTitle';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import Spinner from '../Shared/Spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
        return (
            <div className="py-8 md:py-12 lg:py-16 max-w-7xl mx-auto px-4">
                <div className="w-full text-center">
                    <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 inline-block border-primary mx-auto">
                        Available Pets
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="rounded bg-base-200 shadow hover:shadow-md transition-shadow duration-300 p-4">
                            {/* Skeleton Image */}
                            <div className="mb-4">
                                <Skeleton height={192} className="w-full rounded-xl" />
                            </div>
                            {/* Skeleton Title */}
                            <Skeleton height={24} width={120} className="mb-2" />
                            {/* Skeleton Info Lines */}
                            <Skeleton height={16} width={80} className="mb-1" />
                            <Skeleton height={16} width={100} className="mb-1" />
                            <Skeleton height={16} width={140} className="mb-1" />
                            <Skeleton height={16} width={160} className="mb-3" />
                            {/* Skeleton Button */}
                            <Skeleton height={32} width={100} borderRadius={8} />
                        </div>
                    ))}
                </div>
            </div>
        );
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
        <div className="py-8 md:py-12 lg:py-16 max-w-7xl mx-auto px-4">
            {/* Section Title */}
            <SectionTitle
                label="Browse Pets"
                labelPosition="center"
                title="Available Pets"
                titlePosition="center"
            />
            {/* Subtitle */}
            <div className="text-center mb-8">
                <p className="text-lg text-secondary/60 max-w-2xl mx-auto">
                    Discover your new best friend! Browse all available pets and find the perfect companion to welcome into your home.
                </p>
            </div>
            <div className="mb-8">
                {/* Search and Filter Section */}
                <div className="w-full max-w-1/2 mx-auto flex flex-col md:flex-row gap-4 mb-6">
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
                            className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-base-100 text-secondary rounded"
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
                            className="btn btn-primary text-base-100"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredPets.map((pet) => (
                        <div
                            key={pet._id}
                            className="group relative rounded bg-base-100 shadow hover:shadow-md hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-primary/10 hover:border-primary/30"
                        >
                            {/* Pet Image with overlay and badge */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={pet.petImage}
                                    alt={pet.petName}
                                    className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Category Badge */}
                                <span className="absolute top-3 left-3 bg-primary/90 text-base-100 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                    {pet.petCategory?.label || pet.petCategory?.value || pet.petCategory || 'N/A'}
                                </span>
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 via-base-100/10 to-transparent opacity-80 pointer-events-none"></div>
                            </div>

                            {/* Card Content */}
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
                                <div className="flex-1"></div>
                                {/* View Details Button */}
                                <div className="pt-2 flex justify-end">
                                    <button
                                        onClick={() => handleViewDetails(pet._id)}
                                        className="btn btn-primary btn-sm text-base-100 px-5 transition-transform duration-200"
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