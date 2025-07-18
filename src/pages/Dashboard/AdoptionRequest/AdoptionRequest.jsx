import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdoptionRequest = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Add state to track which request is being processed
    const [processingId, setProcessingId] = React.useState(null);

    // Fetch all adoption requests
    const { data: adoptions = [], isLoading } = useQuery({
        queryKey: ['adoptions'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/adoptions');
            return res.data;
        }
    });

    // Filter: Only requests for pets added by the current user
    const myAdoptions = adoptions.filter(req => req.petOwnerEmail === user?.email);

    // Accept/Reject mutation
    const mutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return axiosSecure.put(`/adoptions/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['adoptions']);
        }
    });

    const handleStatusChange = async (id, status) => {
        setProcessingId(id); // Set processing state
        try {
            await mutation.mutateAsync({ id, status });
            Swal.fire({
                icon: 'success',
                title: `Request ${status === 'approved' ? 'Accepted' : 'Rejected'}`,
                showConfirmButton: false,
                timer: 1500
            });
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not update request status',
                showConfirmButton: true
            });
        } finally {
            setProcessingId(null); // Reset processing state
        }
    };

    // New: Confirmation handler
    const confirmStatusChange = (id, status) => {
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${status === 'approved' ? 'accept' : 'reject'} this adoption request?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: status === 'approved' ? 'Accept' : 'Reject',
            cancelButtonText: 'Cancel',
            confirmButtonColor: status === 'approved' ? '#22c55e' : '#ef4444',
            cancelButtonColor: '#d1d5db',
        }).then((result) => {
            if (result.isConfirmed) {
                handleStatusChange(id, status);
            }
        });
    };

    // Skeleton loading
    if (loading || isLoading) {
        return (
            <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
                <div className="mb-3">
                    <Skeleton height={48} width={400} className="mb-6" />
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra min-w-max w-full">
                        <thead>
                            <tr className="bg-primary/10">
                                {[...Array(7)].map((_, idx) => (
                                    <th key={idx}>
                                        <Skeleton height={24} width={100} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(3)].map((_, rowIdx) => (
                                <tr key={rowIdx}>
                                    {[...Array(7)].map((_, colIdx) => (
                                        <td key={colIdx}>
                                            <Skeleton height={32} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h1 className="md:text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
                    Adoption Requests for Your Pets
                </h1>
            </div>
            {myAdoptions.length === 0 ? (
                <div className="text-center text-secondary py-12 flex flex-col items-center gap-2">
                  <span className="text-5xl mb-2">🐾</span>
                  <span className="font-semibold text-lg">No adoption requests yet</span>
                  <span className="text-sm text-secondary/60 max-w-md">Once someone falls in love with your pet, their adoption request will appear here. Share your pet's profile to reach more loving families!</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra min-w-max w-full">
                        <thead>
                            <tr className="bg-primary/10">
                                <th>Pet Name</th>
                                <th>Adopter Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAdoptions.map(req => (
                                <tr key={req._id}>
                                    <td className="font-medium text-secondary">{req.petName}</td>
                                    <td>{req.userName}</td>
                                    <td>{req.adopterEmail || req.userEmail}</td>
                                    <td>{req.phoneNumber}</td>
                                    <td>{req.address}</td>
                                    <td>
                                        <span className={`badge ${req.status === 'approved' ? 'badge-success' : req.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-xs btn-success"
                                                onClick={() => confirmStatusChange(req._id, 'approved')}
                                                disabled={req.status !== 'pending' || processingId === req._id}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={() => confirmStatusChange(req._id, 'rejected')}
                                                disabled={req.status !== 'pending' || processingId === req._id}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdoptionRequest;