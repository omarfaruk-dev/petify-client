import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Spinner from '../Shared/Spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch pet details
    const { data: pet, isLoading, error } = useQuery({
        queryKey: ['pet-details', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/pets/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const adoptionData = {
                petId: pet._id,
                petName: pet.petName,
                petImage: pet.petImage,
                userName: user?.displayName || user?.name || 'Unknown',
                userEmail: user?.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                adoptionDate: new Date().toISOString()
            };

            const res = await axiosSecure.post('/adoptions', adoptionData);
            
            if (res.status === 201) {
                // Show success message
                alert('Adoption request submitted successfully!');
                setIsModalOpen(false);
                setFormData({ phoneNumber: '', address: '' });
            }
        } catch (error) {
            console.error('Error submitting adoption request:', error);
            alert('Failed to submit adoption request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-base-100 rounded-lg shadow-lg p-6">
                    <Skeleton height={48} width={300} className="mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Skeleton height={400} className="rounded-lg" />
                        <div className="space-y-4">
                            <Skeleton height={24} width={200} />
                            <Skeleton height={20} width={150} />
                            <Skeleton height={20} width={180} />
                            <Skeleton height={20} width={160} />
                            <Skeleton height={20} width={140} />
                            <Skeleton height={20} width={170} />
                            <Skeleton height={48} width={120} className="mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-base-100 rounded-lg shadow-lg p-6 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-secondary mb-2">
                        Error loading pet details
                    </h3>
                    <p className="text-secondary/60">
                        {error.message || 'Failed to load pet information'}
                    </p>
                </div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-base-100 rounded-lg shadow-lg p-6 text-center">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className="text-xl font-semibold text-secondary mb-2">
                        Pet not found
                    </h3>
                    <p className="text-secondary/60">
                        The pet you're looking for doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-base-100 rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
                        {pet.petName}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pet Image */}
                    <div>
                        <img
                            src={pet.petImage}
                            alt={pet.petName}
                            className="w-full h-96 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Pet Details */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-secondary mb-4">Pet Information</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-primary font-medium min-w-[100px]">Name:</span>
                                    <span className="text-secondary">{pet.petName}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-primary font-medium min-w-[100px]">Category:</span>
                                    <span className="text-secondary">
                                        {pet.petCategory?.label || pet.petCategory?.value || pet.petCategory || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-primary font-medium min-w-[100px]">Age:</span>
                                    <span className="text-secondary">{pet.petAge} years</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-primary font-medium min-w-[100px]">Location:</span>
                                    <span className="text-secondary">{pet.petLocation}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-primary font-medium min-w-[100px]">Status:</span>
                                    <span className={`badge ${pet.adopted ? 'badge-success' : 'badge-warning'}`}>
                                        {pet.adopted ? 'Adopted' : 'Available for Adoption'}
                                    </span>
                                </div>
                                {pet.petDescription && (
                                    <div className="mt-4">
                                        <span className="text-primary font-medium block mb-2">Description:</span>
                                        <p className="text-secondary leading-relaxed">{pet.petDescription}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Adopt Button */}
                        {!pet.adopted && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn btn-primary text-base-100 w-full lg:w-auto"
                                disabled={!user}
                            >
                                {user ? 'Adopt This Pet' : 'Login to Adopt'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Adoption Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-secondary">
                                    Adopt {pet.petName}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Pet Information (Read-only) */}
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <h4 className="font-medium text-secondary mb-3">Pet Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-primary">Pet ID:</span>
                                            <span className="text-secondary">{pet._id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-primary">Pet Name:</span>
                                            <span className="text-secondary">{pet.petName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-primary">Pet Image:</span>
                                            <span className="text-secondary truncate max-w-[150px]">{pet.petImage}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* User Information (Read-only) */}
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <h4 className="font-medium text-secondary mb-3">Your Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-primary">Name:</span>
                                            <span className="text-secondary">{user?.displayName || user?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-primary">Email:</span>
                                            <span className="text-secondary">{user?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information (Editable) */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-secondary">Contact Information</h4>
                                    
                                    <div>
                                        <label className="label">
                                            <span className="label-text text-primary">Phone Number *</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                            className="input input-bordered w-full"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text text-primary">Address *</span>
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className="textarea textarea-bordered w-full"
                                            placeholder="Enter your address"
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="btn btn-outline flex-1"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary text-base-100 flex-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetDetails;