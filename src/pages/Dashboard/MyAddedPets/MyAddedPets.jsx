import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import Swal from 'sweetalert2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MyAddedPets = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPets, setTotalPets] = useState(0);
  const limit = 10;

  // Fetch pets using React Query with pagination (robust, MyCampaigns style)
  const { data: petsData = {}, error, isLoading } = useQuery({
    queryKey: ['my-pets', user?.email, page],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/pets?email=${user.email}&page=${page}&limit=${limit}`);
        // Handle both old format (array) and new format (object with pets property)
        if (Array.isArray(res.data)) {
          return {
            pets: res.data,
            totalPages: 1,
            totalPets: res.data.length,
            currentPage: 1,
            hasMore: false
          };
        }
        return res.data;
      } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  useEffect(() => {
    if (petsData) {
      setTotalPages(petsData.totalPages || 1);
      setTotalPets(petsData.totalPets || 0);
    }
  }, [petsData]);

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
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end - start + 1 < maxVisiblePages) start = Math.max(1, end - maxVisiblePages + 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  //handle delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This pet will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#d33',
    });

    if (confirm.isConfirmed) {
      try {
        // Optimistically remove the pet from the cache
        queryClient.setQueryData(['my-pets', user?.email], (oldData) => {
          return oldData ? oldData.filter(pet => pet._id !== id) : [];
        });

        const res = await axiosSecure.delete(`/pets/${id}`);

        if (res.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Pet has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          // Invalidate and refetch to ensure data consistency
          await queryClient.invalidateQueries(['my-pets', user?.email]);
        } else {
          // If deletion failed, refetch to restore the original data
          await queryClient.invalidateQueries(['my-pets', user?.email]);
          Swal.fire("Error", "Failed to delete pet", "error");
        }
      } catch (err) {
        // If there's an error, refetch to restore the original data
        await queryClient.invalidateQueries(['my-pets', user?.email]);
        Swal.fire("Error", err.message || "Failed to delete pet", "error");
      }
    }
  };

  //handle adopt
  const handleAdopt = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This pet will be marked as adopted!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, adopt it",
      cancelButtonText: "Cancel",
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#d33',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.put(`/pets/${id}/adopt`);
        if (res.status === 200 || res.data?.message) {
          Swal.fire({
            title: "Adopted!",
            text: "Pet has been marked as adopted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          await queryClient.invalidateQueries(['my-pets', user?.email]);
        } else {
          Swal.fire("Error", "Failed to mark as adopted", "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to mark as adopted", "error");
      }
    }
  };

  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.display({
      id: 'serial',
      header: () => 'Serial No.',
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
      enableSorting: false,
    }),
    columnHelper.accessor('petName', {
      header: () => 'Pet Name',
      cell: info => <span className="font-medium text-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor(row => row.petCategory?.label || row.petCategory?.value || 'N/A', {
      id: 'petCategory',
      header: () => 'Category',
      cell: info => <span>{info.getValue()}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('petImage', {
      header: () => 'Pet Image',
      cell: info => (
        <img
          src={info.getValue()}
          alt="Pet"
          className="w-12 h-12 rounded object-cover border-2 border-primary/30"
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('adopted', {
      header: () => 'Adoption Status',
      cell: info => (
        <span className={`badge ${info.getValue() ? 'badge-success' : 'badge-warning'}`}>
          {info.getValue() ? 'Adopted' : 'Not Adopted'}
        </span>
      ),
      sortingFn: 'basic',
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/update-pet/${row.original._id}`)}
            className="btn btn-sm btn-primary text-base-100"
          >
            Update
          </button>
          <button onClick={() => handleDelete(row.original._id)} className="btn btn-sm btn-error">Delete</button>
          {/* <button onClick={() => handleAdopt(row.original._id)} className="btn btn-sm btn-warning">Adopt</button> */}
          <button
            onClick={() => handleAdopt(row.original._id)}
            title={row.original.adopted ? 'Already adopted' : 'Mark as adopted'}
            className="btn btn-sm btn-warning"
            disabled={row.original.adopted}
          >
            {row.original.adopted ? 'Adopted' : 'Adopt'}
            
          </button>

        </div>
      ),
      enableSorting: false,
    }),
  ];
  const table = useReactTable({
    data: pets,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  // Loading skeleton
  if (isLoading || loading) {
    return (
      <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton height={40} width={200} />
          <Skeleton height={40} width={120} />
        </div>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra min-w-max w-full">
            <thead>
              <tr className='bg-primary/10'>
                <th><Skeleton height={20} width={80} /></th>
                <th><Skeleton height={20} width={100} /></th>
                <th><Skeleton height={20} width={80} /></th>
                <th><Skeleton height={20} width={80} /></th>
                <th><Skeleton height={20} width={120} /></th>
                <th><Skeleton height={20} width={100} /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td><Skeleton height={20} width={40} /></td>
                  <td><Skeleton height={20} width={100} /></td>
                  <td><Skeleton height={20} width={80} /></td>
                  <td><Skeleton height={48} width={48} /></td>
                  <td><Skeleton height={20} width={80} /></td>
                  <td>
                    <div className="flex gap-2">
                      <Skeleton height={32} width={60} />
                      <Skeleton height={32} width={60} />
                      <Skeleton height={32} width={60} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary mb-6">
          My Added Pets
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Error loading pets
          </h3>
          <p className="text-secondary/60 mb-4">
            {error || 'Failed to load pets'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
      <title>My Added Pets - Petify</title>
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
          My Added Pets
        </h2>
        <button
          onClick={() => navigate('/dashboard/add-pet')}
          className="btn btn-primary text-base-100"
        >
          Add New Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            No pets added yet
          </h3>
          <p className="text-secondary/60 mb-4">
            Start by adding your first pet to the platform
          </p>
          <button
            onClick={() => navigate('/dashboard/add-pet')}
            className="btn btn-primary"
          >
            Add Your First Pet
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra min-w-max w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className='bg-primary/10'>
                    {headerGroup.headers.map(header => {
                      const isSortable = header.column.getCanSort();
                      const sortDir = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                          className={isSortable ? 'cursor-pointer select-none' : ''}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && (
                            <span className="ml-1">
                              {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕'}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
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
              {/* Pagination Buttons */}
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
        </>
      )}
    </div>
  );
};

export default MyAddedPets;