import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const PetDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            phoneNumber: '',
            address: ''
        }
    });
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch pet details
    const { data: pet, isLoading, error } = useQuery({
        queryKey: ['pet-details', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/pets/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const adoptionData = {
                petId: pet._id,
                petName: pet.petName,
                petImage: pet.petImage,
                userName: user?.displayName || user?.name || 'Unknown',
                userEmail: user?.email,
                phoneNumber: data.phoneNumber,
                address: data.address,
                adoptionDate: new Date().toISOString()
            };

            const res = await axiosSecure.post('/adoptions', adoptionData);
            
            if (res.status === 201) {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Adoption Request Submitted!',
                    text: 'Your adoption request has been submitted successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                reset(); // Reset form using React Hook Form
            }
        } catch (error) {
            console.error('Error submitting adoption request:', error);
            const duplicateMsg = 'You have already submitted an adoption request for this pet';
            if (
                error?.response?.data?.message === duplicateMsg ||
                error?.message === duplicateMsg
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Already Requested',
                    text: duplicateMsg,
                    showConfirmButton: true
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Failed to submit adoption request. Please try again.',
                    showConfirmButton: true
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-base-100 rounded shadow-md p-6">
                    <Skeleton height={48} width={300} className="mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Skeleton height={400} className="rounded" />
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
                <div className="bg-base-100 rounded shadow-lg p-6 text-center">
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
                <div className="bg-base-100 rounded shadow-lg p-6 text-center">
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
            <div className="bg-base-100 rounded shadow-lg p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
                        {pet.petName}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pet Image */}
                    <div className="flex flex-col items-center justify-center">
                        <img
                            src={pet.petImage}
                            alt={pet.petName}
                            className="w-full h-96 object-cover rounded shadow-lg border-4 border-primary/20"
                        />
                    </div>

                    {/* Pet Details */}
                    <div className="bg-base-200 rounded p-6 shadow space-y-6">
                        <h2 className="text-2xl font-bold text-primary mb-2">Pet Information</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <span className="block text-secondary/70 text-sm font-semibold">Name</span>
                                <span className="block text-lg font-medium text-secondary">{pet.petName}</span>
                            </div>
                            <div>
                                <span className="block text-secondary/70 text-sm font-semibold">Age</span>
                                <span className="block text-lg font-medium text-secondary">{pet.petAge} <small>Months</small></span>
                            </div>
                            <div>
                                <span className="block text-secondary/70 text-sm font-semibold">Location</span>
                                <span className="block text-lg font-medium text-secondary">{pet.petLocation}</span>
                            </div>
                            <div>
                                <span className="block text-secondary/70 text-sm font-semibold">Category</span>
                                <span className="block text-lg font-medium text-secondary">{pet.petCategory?.label || pet.petCategory?.value}</span>
                            </div>
                            <div>
                                <span className="block text-secondary/70 text-sm font-semibold">Short Description</span>
                                <span className="block text-base text-secondary">{pet.shortDescription}</span>
                            </div>
                            <div>
                                <span className="block text-secondary/70 text-sm font-semibold">Long Description</span>
                                <span className="block text-base text-secondary">{pet.longDescription}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Adopt Button */}
                {!pet.adopted && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => {
                                if (user && user.email === pet.userEmail) {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Not Allowed',
                                        text: 'You cannot adopt your own pet.',
                                        showConfirmButton: true
                                    });
                                } else if (user) {
                                    setIsModalOpen(true);
                                } else {
                                    navigate('/login', { state: { from: location } });
                                }
                            }}
                            className="btn btn-primary text-base-100 w-full lg:w-auto"
                        >
                            Adopt This Pet
                        </button>
                    </div>
                )}
            </div>

            {/* Adoption Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-secondary/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-base-100 rounded shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-secondary">
                                    Adopt {pet.petName}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-sm btn-circle btn-primary text-base-100"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Pet Information (Read-only) */}
                                <div className="bg-base-200 p-4 rounded">
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
                                <div className="bg-base-200 p-4 rounded">
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
                                            {...register('phoneNumber', { 
                                                required: 'Phone number is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Phone number must be at least 10 digits long'
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message: 'Phone number must not exceed 15 digits'
                                                }
                                            })}
                                            className={`input input-bordered w-full border-primary/30 focus:outline-none ${errors.phoneNumber ? 'input-error' : ''}`}
                                            placeholder="Enter your phone number"
                                        />
                                        {errors.phoneNumber && (
                                            <span className="text-error text-sm mt-1">{errors.phoneNumber.message}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text text-primary">Address *</span>
                                        </label>
                                        <textarea
                                            {...register('address', { 
                                                required: 'Address is required',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Address must be at least 10 characters long'
                                                }
                                            })}
                                            className={`textarea textarea-bordered w-full border-primary/30 focus:outline-none ${errors.address ? 'textarea-error' : ''}`}
                                            placeholder="Enter your address"
                                            rows="3"
                                        />
                                        {errors.address && (
                                            <span className="text-error text-sm mt-1">{errors.address.message}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="btn btn-outline btn-primary text-primary hover:text-base-100 flex-1"
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