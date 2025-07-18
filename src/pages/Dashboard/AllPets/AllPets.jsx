import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';

const AllPets = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { loading } = useAuth();
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPets, setTotalPets] = useState(0);
  const limit = 10; // Show 10 pets per page

  // Fetch all pets with pagination
  const { data: petsData = {}, isLoading, error } = useQuery({
    queryKey: ['all-pets', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/all?page=${page}&limit=${limit}`);
      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Update pagination info when data changes
  useEffect(() => {
    if (petsData) {
      setTotalPages(petsData.totalPages || 1);
      setTotalPets(petsData.totalCount || 0);
    }
  }, [petsData]);

  // Get pets array safely
  const pets = petsData.pets || [];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  // Handle delete pet
  const handleDeletePet = async (petId, petName) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${petName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/pets/${petId}/admin`);
        
        queryClient.invalidateQueries(['all-pets']);
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Pet has been deleted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete pet',
          icon: 'error',
        });
      }
    }
  };

  // Handle update adoption status
  const handleUpdateAdoptionStatus = async (petId, petName, currentStatus) => {
    const newStatus = !currentStatus;
    
    const confirm = await Swal.fire({
      title: 'Update Adoption Status',
      text: `Do you want to mark "${petName}" as ${newStatus ? 'adopted' : 'available'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, mark as ${newStatus ? 'adopted' : 'available'}`,
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.put(`/pets/${petId}/adoption-status`, { adopted: newStatus });
        
        queryClient.invalidateQueries(['all-pets']);
        
        Swal.fire({
          title: 'Success!',
          text: `Pet has been marked as ${newStatus ? 'adopted' : 'available'}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update adoption status',
          icon: 'error',
        });
      }
    }
  };

  // Handle edit pet
  const handleEditPet = (petId) => {
    navigate(`/dashboard/update-pet/${petId}`);
  };

  return (
    <div className="w-full bg-base-100 rounded shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
          All Pets
        </h2>
        <div className="text-sm text-secondary/60">
          Total Pets: {totalPets}
        </div>
      </div>

      {isLoading || loading ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra min-w-max w-full">
            <thead>
              <tr className="bg-primary/10">
                <th>#</th>
                <th>Pet Image</th>
                <th>Pet Name</th>
                <th>Category</th>
                <th>Age</th>
                <th>Location</th>
                <th>Owner</th>
                <th>Status</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td><Skeleton width={20} /></td>
                  <td><Skeleton circle width={48} height={48} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={60} /></td>
                  <td><Skeleton width={50} /></td>
                  <td><Skeleton width={80} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={70} /></td>
                  <td>
                    <div className="flex gap-2">
                      <Skeleton width={90} height={32} />
                      <Skeleton width={40} height={32} />
                      <Skeleton width={40} height={32} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Error loading pets
          </h3>
          <p className="text-secondary/60 mb-4">
            {error.message || 'Failed to load pets'}
          </p>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            No pets found
          </h3>
          <p className="text-secondary/60">
            No pets have been added yet.
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="table table-zebra min-w-max w-full">
              <thead>
                <tr className="bg-primary/10">
                  <th>#</th>
                  <th>Pet Image</th>
                  <th>Pet Name</th>
                  <th>Category</th>
                  <th>Age</th>
                  <th>Location</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet, idx) => (
                  <tr key={pet._id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      {pet.petImage ? (
                        <img 
                          src={pet.petImage} 
                          alt={pet.petName} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-secondary font-bold">
                          🐾
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="font-medium text-secondary">
                        {pet.petName}
                      </div>
                    </td>
                    <td>
                      <span className="">
                        {pet.petCategory?.label || pet.petCategory?.value || pet.petCategory || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm text-secondary/70">
                        {pet.petAge} {pet.petAge === 1 ? 'month' : 'months'}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-secondary/70">
                        {pet.petLocation}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-secondary/70">
                        {pet.userEmail}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${pet.adopted ? 'badge-success' : 'badge-warning'}`}>
                        {pet.adopted ? 'Adopted' : 'Available'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateAdoptionStatus(pet._id, pet.petName, pet.adopted)}
                          className={`btn btn-sm ${pet.adopted ? 'btn-warning' : 'btn-success'} text-base-100`}
                          title={pet.adopted ? 'Mark as Available' : 'Mark as Adopted'}
                        >
                          {pet.adopted ? <FaTimes /> : <FaCheck />}
                          {pet.adopted ? 'Make Available' : 'Mark Adopted'}
                        </button>
                        
                        <button
                          onClick={() => handleEditPet(pet._id)}
                          className="btn btn-sm btn-primary text-base-100"
                          title="Edit Pet"
                        >
                          <FaEdit />
                          
                        </button>
                        
                        <button
                          onClick={() => handleDeletePet(pet._id, pet.petName)}
                          className="btn btn-sm btn-error text-base-100"
                          title="Delete Pet"
                        >
                          <FaTrash />
                          
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPets > limit && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 mt-6">
              {/* Page Info */}
              <div className="text-sm text-secondary/60">
                Showing page {page} of {totalPages}
                {totalPets > 0 && (
                  <span className="ml-2">
                    ({totalPets} total pets)
                  </span>
                )}
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isLoading}
                  className="btn btn-sm btn-outline btn-primary disabled:btn-disabled"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`btn btn-sm ${
                        pageNum === page 
                          ? 'btn-primary' 
                          : 'btn-outline btn-primary'
                      } disabled:btn-disabled min-w-[40px]`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isLoading}
                  className="btn btn-sm btn-outline btn-primary disabled:btn-disabled"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllPets;