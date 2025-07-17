import React, { useState, useEffect } from 'react';
import { FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import SectionTitle from '../Shared/Component/SectionTitle';
import Spinner from '../Shared/Spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router';

const petCategories = [
    { value: '', label: 'All Categories' },
    { value: 'Cat', label: 'Cat' },
    { value: 'Bird', label: 'Bird' },
    { value: 'Dog', label: 'Dog' },
    { value: 'Rabbit', label: 'Rabbit' },
    { value: 'Fish', label: 'Fish' },
    { value: 'Other', label: 'Other' },
];

const LIMIT = 4;

const PetListing = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ['available-pets'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosSecure.get(`/pets/available?page=${pageParam}&limit=${LIMIT}`);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage?.nextPage) return lastPage.nextPage;
            return undefined;
        }
    });

    const { ref, inView } = useInView();

    // Trigger next page when ref is visible
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const allPets = data?.pages.flatMap(page => page.data) || [];

    // Filter based on search and category
    const filteredPets = allPets.filter(pet => {
        const matchesSearch = pet.petName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || pet.petCategory?.value === selectedCategory || pet.petCategory === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleViewDetails = (id) => navigate(`/pet-details/${id}`);

    return (
        <div className="py-8 md:py-12 lg:py-16 max-w-7xl mx-auto px-4">
            <SectionTitle
                label="Browse Pets"
                title="Available Pets"
                labelPosition="center"
                titlePosition="center"
            />
            <div className="text-center mb-8">
                <p className="text-lg text-secondary/60 max-w-2xl mx-auto">
                    Discover your new best friend! Browse all available pets and find the perfect companion.
                </p>
            </div>

            <div className="mb-8">
                <div className="w-full max-w-1/2 mx-auto flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="label">
                            <span className="label-text text-secondary font-medium">Search Pets</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Search by pet name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="label">
                            <span className="label-text text-secondary font-medium">Filter by Category</span>
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

                <div className="mb-4">
                    <p className="text-secondary/60">
                        Showing {filteredPets.length} pets
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPets.map((pet, i) => (
                    <div
                        key={pet._id || i}
                        className="group relative rounded bg-base-100 shadow hover:shadow-md hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-primary/10 hover:border-primary/30"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <img
                                src={pet.petImage}
                                alt={pet.petName}
                                className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-3 left-3 bg-primary/90 text-base-100 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                {pet.petCategory?.label || pet.petCategory?.value || pet.petCategory}
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
                                <button
                                    onClick={() => handleViewDetails(pet._id)}
                                    className="btn btn-primary btn-sm text-base-100 px-5"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No pets found message and clear filters button */}
            {filteredPets.length === 0 && !isLoading && (
                <div className="text-center my-8">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className="text-xl font-semibold text-secondary mb-2">
                        No pets found
                    </h3>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                        }}
                        className="btn btn-outline btn-primary"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Loading Spinner or Observer */}
            <div ref={ref} className="text-center mt-8">
                {isFetchingNextPage ? <Spinner /> : hasNextPage ? <p className="text-secondary/60">Loading more pets...</p> : <p className="text-secondary/40">No more pets</p>}
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="rounded bg-base-200 shadow hover:shadow-md transition-shadow duration-300 p-4">
                            <div className="mb-4">
                                <Skeleton height={192} className="w-full rounded-xl" />
                            </div>
                            <Skeleton height={24} width={120} className="mb-2" />
                            <Skeleton height={16} width={80} className="mb-1" />
                            <Skeleton height={16} width={100} className="mb-1" />
                            <Skeleton height={16} width={140} className="mb-1" />
                            <Skeleton height={16} width={160} className="mb-3" />
                            <Skeleton height={32} width={100} borderRadius={8} />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 py-10">
                    <p>Error loading pets: {error.message}</p>
                </div>
            )}
        </div>
    );
};

export default PetListing;
