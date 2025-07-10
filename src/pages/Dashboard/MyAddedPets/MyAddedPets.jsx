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

const MyAddedPets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  console.log('User:', user);
  console.log('User email:', user?.email);

  // Test without React Query first
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setIsLoading(true);
      setError(null);

      axiosSecure.get(`/pets?email=${user.email}`)
        .then(res => {
          console.log('API response:', res.data);
          setPets(res.data);
        })
        .catch(err => {
          console.error('API error:', err);
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user?.email, axiosSecure]);

  console.log('Pets data:', pets);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

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
          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
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
      cell: () => (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-primary">Update</button>
          <button className="btn btn-sm btn-error">Delete</button>
          <button className="btn btn-sm btn-warning">Adopt</button>
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
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
        <h2 className="text-3xl font-extrabold text-secondary border-b-2 pb-2 inline-block border-primary">
          My Added Pets
        </h2>
        <button
          onClick={() => navigate('/dashboard/add-pet')}
          className="btn btn-primary"
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
                <tr key={headerGroup.id}>
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