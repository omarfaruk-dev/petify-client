import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const LoginWithGoogle = () => {
  const { googleSignIn } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    googleSignIn()
      .then(async (result) => {
        // console.log('Full Google sign-in result:', result);
        const user = result.user;
        // console.log('Google user object:', user);
        // Log all keys in user object for debugging
        if (user) {
          Object.keys(user).forEach(key => {
            // console.log(`user.${key}:`, user[key]);
          });
        }
        // Try to get email from providerData if not present in user.email
        let email = user.email;
        if (!email && user.providerData && user.providerData.length > 0) {
          email = user.providerData[0].email;
        }
        if (!email) {
          Swal.fire({
            icon: 'error',
            title: 'Google sign-in failed',
            text: 'No email found in Google account. Please use an account with a public email.',
          });
          setLoading(false);
          return;
        }
        // update user info in the database
        const userInfo = {
          name: user.displayName || user.name || '',
          email: email,
          role: 'user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
          photo: user.photoURL || '', // Added photo field
        };
        // console.log('Sending userInfo to server:', userInfo);
        try {
          const res = await axiosInstance.post('/users', userInfo);
          // console.log('User created:', res.data);
        } catch (err) {
          // If user already exists, treat as success
          if (
            err.response &&
            err.response.status === 400 &&
            err.response.data?.message === 'User already exists'
          ) {
            // console.log('User already exists:', err.response.data);
            // Optionally show a different message or just proceed
          } else {
            console.error('User creation error:', err.response?.data || err.message);
            throw err;
          }
        }
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'You are now logged in.',
          showConfirmButton: false,
          timer: 1500
        });
        navigate(from);
      })
      .catch(error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Google sign-in failed',
          text: error.message || 'Google sign-in failed',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="btn w-full bg-base-200 hover:bg-base-100 flex items-center justify-center gap-2 rounded border border-primary/30"
      disabled={loading}
    >
      <FcGoogle className="text-xl" />
      {loading ? 'Loading...' : 'Continue with Google'}
    </button>
  );
};

export default LoginWithGoogle;