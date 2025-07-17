import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const LoginWithGoogle = () => {
  const { googleSignIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();

  const handleGoogleSignIn = () => {
    setLoading(true);
    googleSignIn()
      .then(async (result) => {
        const user = result.user;
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
        // Save user info to database
        const userInfo = {
          name: user.displayName || user.name || '',
          email: email,
          role: 'user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
          photo: user.photoURL || '',
        };
        try {
          await axiosInstance.post('/users', userInfo);
        } catch (err) {
          if (
            err.response &&
            err.response.status === 400 &&
            err.response.data?.message === 'User already exists'
          ) {
            // Ignore, user already exists
          } else {
            console.error('User creation error:', err.response?.data || err.message);
            throw err;
          }
        }
        // Show success message then redirect
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have successfully signed in with Google!',
          timer: 1500,
          showConfirmButton: false
        });
        window.location.href = '/';
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