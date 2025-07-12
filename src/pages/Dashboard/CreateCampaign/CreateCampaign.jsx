import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const CreateCampaign = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

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
      console.log(formData);
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

    // Validate that last date is in the future
    const lastDate = new Date(data.lastDate);
    const now = new Date();
    if (lastDate <= now) {
      setSubmitError('Last date must be in the future.');
      return;
    }

    const campaignData = {
      ...data,
      petImage: imageUrl,
      userEmail: user?.email,
      userName: user?.displayName || user?.email,
      createdAt: new Date().toISOString(),
      status: 'active', // active, completed, cancelled
      totalDonations: 0,
      currentAmount: 0,
    };
      
    try {
      console.log('Creating campaign with data:', campaignData);
      const res = await axiosSecure.post('/donations', campaignData);
      console.log('Campaign creation response:', res.data);
      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Campaign created successfully!',
          showConfirmButton: false,
          timer: 1500
        });

        reset();
        setImageUrl('');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setSubmitError(error.response?.data?.message || 'Failed to create campaign');
    }
  };

  return (
    <div className="w-full max-w-2xl bg-base-100 rounded shadow-lg p-8 flex flex-col gap-4 z-10 mx-auto">
      <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 border-primary inline-block mr-auto">Create Donation Campaign</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Responsive grid for form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pet Image Upload */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Pet Picture</span>
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

          {/* Maximum Donation Amount */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Maximum Donation Amount</span>
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              {...register('maxAmount', { 
                required: 'Maximum donation amount is required',
                min: { value: 1, message: 'Amount must be at least 1' }
              })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Enter maximum amount"
            />
            {errors.maxAmount && <p className="text-red-500 text-sm mt-1">{errors.maxAmount.message}</p>}
          </div>

          {/* Last Date of Donation */}
          <div className="mb-1">
            <label className="label">
              <span className="label-text text-primary font-medium">Last Date of Donation</span>
            </label>
            <input
              type="datetime-local"
              {...register('lastDate', { required: 'Last date is required' })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
            />
            {errors.lastDate && <p className="text-red-500 text-sm mt-1">{errors.lastDate.message}</p>}
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
              placeholder="Brief description of the campaign"
            />
            {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
          </div>
        </div>

        {/* Long Description - Full Width */}
        <div className="mb-1">
          <label className="label">
            <span className="label-text text-primary font-medium">Long Description</span>
          </label>
          <textarea
            {...register('longDescription', { required: 'Long description is required' })}
            className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded min-h-[120px]"
            placeholder="Detailed information about the donation campaign, why it's needed, and how the funds will be used"
          />
          {errors.longDescription && <p className="text-red-500 text-sm mt-1">{errors.longDescription.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full rounded text-secondary font-semibold mb-2 mt-2"
          disabled={imageUploading}
        >
          {imageUploading ? 'Uploading Image...' : 'Create Campaign'}
        </button>
        {submitError && <p className="text-red-500 text-sm mt-1 text-center">{submitError}</p>}
      </form>
    </div>
  );
};

export default CreateCampaign;