import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';

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
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Pet Name</th>
                <th>Category</th>
                <th>Pet Image</th>
                <th>Adoption Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet, index) => (
                <tr key={pet._id}>
                  <td>{index + 1}</td>
                  <td className="font-medium text-secondary">{pet.petName}</td>
                  <td>
                    <span className="">
                      {pet.petCategory?.label || pet.petCategory?.value || "N/A"}
                    </span>
                  </td>
                  <td>
                    <img
                      src={pet.petImage}
                      alt="Pet"
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                  </td>
                  <td>
                    <span
                      className={`badge ${pet.adopted ? 'badge-success' : 'badge-warning'
                        }`}
                    >
                      {pet.adopted ? 'Adopted' : 'Not Adopted'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-primary">Update</button>
                      <button className="btn btn-sm btn-error">Delete</button>
                      <button className="btn btn-sm btn-warning">Adopt</button>
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

export default MyAddedPets;