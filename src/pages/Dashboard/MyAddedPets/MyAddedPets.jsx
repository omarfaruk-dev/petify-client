import React, { useState } from 'react';
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

  // Fetch pets using React Query
  const { data: pets = [], error, isLoading } = useQuery({
    queryKey: ['my-pets', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets?email=${user.email}`);
      return res.data;
    }
  });

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
      cell: ({ row }) => row.index + 1,
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

  // if (loading) {
  //   return <Spinner />;
  // }

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
      )}
    </div>
  );
};

export default MyAddedPets;