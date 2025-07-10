import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Spinner from '../../Shared/Spinner';

const petCategories = [
  { value: 'Cat', label: 'Cat' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Dog', label: 'Dog' },
  { value: 'Rabbit', label: 'Rabbit' },
  { value: 'Fish', label: 'Fish' },
  { value: 'Other', label: 'Other' },
];

const UpdatePet = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch pet data on component mount
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const res = await axiosSecure.get(`/pets/${id}`);
        setPetData(res.data);
        setImageUrl(res.data.petImage);
        
        // Pre-fill form with existing data
        setValue('petName', res.data.petName);
        setValue('petAge', res.data.petAge);
        setValue('petCategory', res.data.petCategory);
        setValue('petLocation', res.data.petLocation);
        setValue('shortDescription', res.data.shortDescription);
        setValue('longDescription', res.data.longDescription);
        setValue('petImage', res.data.petImage);
      } catch (error) {
        console.error('Error fetching pet data:', error);
        Swal.fire('Error', 'Failed to load pet data', 'error');
        navigate('/dashboard/my-added-pets');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetData();
    }
  }, [id, axiosSecure, setValue, navigate]);

  // Handle image upload to imgbb
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    setSubmitError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
        formData
      );
      setImageUrl(res.data.data.url);
      setValue('petImage', res.data.data.url, { shouldValidate: true });
    } catch {
      setSubmitError('Image upload failed. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    if (!imageUrl) {
      setSubmitError('Please upload a pet image.');
      return;
    }
    
    const updateData = {
      ...data,
      petImage: imageUrl,
      userEmail: user?.email,
      updatedAt: new Date().toISOString(),
    };
      
    try {
      const res = await axiosSecure.put(`/pets/${id}`, updateData);
      
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Pet updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        
        navigate('/dashboard/my-added-pets');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      setSubmitError('Failed to update pet. Please try again.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!petData) {
    return (
      <div className="w-full bg-base-100 rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Pet not found
          </h3>
          <p className="text-secondary/60 mb-4">
            The pet you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/dashboard/my-added-pets')}
            className="btn btn-primary"
          >
            Back to My Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-base-100 rounded shadow-lg p-8 flex flex-col gap-4 z-10 mx-auto">
      <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 inline-block border-primary mx-auto">Update Pet</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Responsive grid for form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pet Image Upload */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Pet Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded file:bg-secondary/10 file:border-none file:rounded file:px-3 file:py-1"
              onChange={handleImageUpload}
            />
            {imageUploading && <p className="text-primary text-sm mt-1">Uploading image...</p>}
            {errors.petImage && <p className="text-red-500 text-sm mt-1">{errors.petImage.message}</p>}
            {imageUrl && (
              <img src={imageUrl} alt="Pet" className="mt-2 rounded w-24 h-24 object-cover border" />
            )}
          </div>
          {/* Pet Name */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Pet Name</span>
            </label>
            <input
              type="text"
              {...register('petName', { required: 'Pet name is required' })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Pet Name"
            />
            {errors.petName && <p className="text-red-500 text-sm mt-1">{errors.petName.message}</p>}
          </div>
          {/* Pet Age */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Pet Age</span>
            </label>
            <input
              type="number"
              min="0"
              {...register('petAge', { required: 'Pet age is required', min: { value: 0, message: 'Age must be positive' } })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Pet Age (years)"
            />
            {errors.petAge && <p className="text-red-500 text-sm mt-1">{errors.petAge.message}</p>}
          </div>
          {/* Pet Category */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Pet Category</span>
            </label>
            <Controller
              name="petCategory"
              control={control}
              rules={{ required: 'Pet category is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={petCategories}
                  classNamePrefix="react-select"
                  placeholder="Select category"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: 'none',
                      borderBottom: '1px solid #64748b44',
                      borderRadius: 0,
                      boxShadow: 'none',
                      background: 'transparent',
                      minHeight: '40px',
                    }),
                  }}
                />
              )}
            />
            {errors.petCategory && <p className="text-red-500 text-sm mt-1">{errors.petCategory.message}</p>}
          </div>
          {/* Pet Location */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Pet Location</span>
            </label>
            <input
              type="text"
              {...register('petLocation', { required: 'Pet location is required' })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Location (e.g. Dhaka, Bangladesh)"
            />
            {errors.petLocation && <p className="text-red-500 text-sm mt-1">{errors.petLocation.message}</p>}
          </div>
          {/* Short Description */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Short Description</span>
            </label>
            <input
              type="text"
              {...register('shortDescription', { required: 'Short description is required' })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Short description or note from owner"
            />
            {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
          </div>
          {/* Long Description */}
          <div className="mb-1 md:col-span-2">
            <label className="label">
              <span className="label-text text-primary font-medium">Long Description</span>
            </label>
            <textarea
              {...register('longDescription', { required: 'Long description is required' })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded min-h-[80px]"
              placeholder="Detailed information about the pet"
            />
            {errors.longDescription && <p className="text-red-500 text-sm mt-1">{errors.longDescription.message}</p>}
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full rounded text-secondary font-semibold mb-2 mt-2"
          disabled={imageUploading}
        >
          {imageUploading ? 'Uploading Image...' : 'Update Pet'}
        </button>
        {submitError && <p className="text-red-500 text-sm mt-1 text-center">{submitError}</p>}
      </form>
    </div>
  );
};

export default UpdatePet;