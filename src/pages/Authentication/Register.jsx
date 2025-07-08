import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import Swal from 'sweetalert2';
import axios from 'axios';

const Register = () => {
  const { createUser, googleSignIn, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    createUser(data.email, data.password)
      .then(async (result) => {
        const user = result.user;
        // update user info in the database
        const userInfo = {
          name: data.name,
          email: user.email,
          role: 'user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        // update user profile info in the database
        await axiosInstance.post('/users', userInfo);
        updateUserProfile({ displayName: data.name, photoURL: profilePic })
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Registration Successful!',
              text: 'Your account has been created.',
              showConfirmButton: false,
              timer: 1500
            });
            navigate(from);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  };

  // signin with google
  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(async (result) => {
        const user = result.user;
        // update user info in the database
        const userInfo = {
          name: user.name,
          email: user.email,
          role: 'user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        await axiosInstance.post('/users', userInfo);
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your account has been created.',
          showConfirmButton: false,
          timer: 1500
        });
        navigate(from);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    const response = await axios.post(imageUploadUrl, formData);
    setProfilePic(response.data.data.url);
    console.log('Image uploaded:', response.data.data.url);
  };

  return (
    <div className="w-full max-w-md bg-base-100 rounded shadow-lg p-8 flex flex-col gap-4 z-10">
      <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 inline-block border-primary mx-auto">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name field */}
        <div className="mb-1">
          <label className="label">
            <span className="label-text text-primary font-medium">Your Name</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('name', { required: true })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Your Name"
            />
            <FaUser className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/60" />
          </div>
          {errors.name?.type === 'required' && <p className="text-red-500 text-sm mt-1">Name is required</p>}
        </div>
        {/* Image upload field */}
        <div className="mb-1">
          <label className="label">
            <span className="label-text text-primary font-medium">Profile Picture</span>
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary/60 rounded file:bg-secondary/10 file:border-none file:rounded file:px-3 file:py-1"
              accept="image/*"
            />
            <FaImage className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/60" />
          </div>
        </div>
        {/* Email Input */}
        <div className="mb-1">
          <label className="label">
            <span className="label-text text-primary font-medium">Email</span>
          </label>
          <div className="relative">
            <input
              type="email"
              {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Email"
            />
            <FaEnvelope className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/60" />
          </div>
          {errors.email?.type === 'required' && <p className="text-red-500 text-sm mt-1">Email is required</p>}
          {errors.email?.type === 'pattern' && <p className="text-red-500 text-sm mt-1">Please, enter a valid email address</p>}
        </div>
        {/* Password Input */}
        <div className="mb-1">
          <label className="label">
            <span className="label-text text-primary font-medium">Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: true, minLength: 6 })}
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
              placeholder="Type your password"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/60 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password?.type === 'required' && <p className="text-red-500 text-sm mt-1">Password is required</p>}
          {errors.password?.type === 'minLength' && <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters or longer</p>}
        </div>
        {/* Register button */}
        <button className="btn btn-primary w-full rounded text-secondary font-semibold mb-2 mt-2">Register</button>
        {/* Login link */}
        <div className="text-center text-secondary text-sm mt-2">
          Already have an account?
          <Link to="/login" className="text-primary font-semibold ml-1 hover:underline">Login Here</Link>
        </div>
        {/* Divider */}
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-secondary/20" />
        </div>
        {/* Social login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn w-full bg-base-200 hover:bg-base-300 flex items-center justify-center gap-2 rounded"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </button>
      </form>
    </div>
  );
};

export default Register;