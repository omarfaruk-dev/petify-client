import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import { useNavigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';

const LoginWithGithub = () => {
  const { githubSignIn } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [loading, setLoading] = useState(false);

  const handleGithubLogin = () => {
    setLoading(true);
    githubSignIn()
      .then(async (result) => {
        const user = result.user;
        // update user info in the database
        const userInfo = {
          name: user.displayName || user.name || '',
          email: user.email,
          role: 'user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        try {
          await axiosInstance.post('/users', userInfo);
        } catch (err) {
          if (
            err.response &&
            err.response.status === 400 &&
            err.response.data?.message === 'User already exists'
          ) {
            // Optionally show a different message or just proceed
          } else {
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
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Github sign-in failed',
          text: error.message || 'Github sign-in failed',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      className="btn w-full bg-base-200 hover:bg-base-100 flex items-center justify-center gap-2 rounded border border-primary/30"
      disabled={loading}
    >
      <FaGithub className="text-xl" />
      {loading ? 'Loading...' : 'Continue with Github'}
    </button>
  );
};

export default LoginWithGithub;