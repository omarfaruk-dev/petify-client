import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaFacebookF, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md bg-base-100 rounded shadow-lg p-8 flex flex-col gap-4 z-10">
      <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 inline-block border-primary mx-auto">Login</h2>
      <form className="flex flex-col gap-4">
        {/* Email */}
        <div className="mb-1">
          <label className="label">
            <span className="label-text text-primary font-medium">Email</span>
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
            />
            <FaEnvelope className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/60" />
          </div>
        </div>
        {/* Password */}
        <div className="mb-1">
          <label className="label">
            <span className="label-text text-primary font-medium">Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
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
        </div>
        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-sm mt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="accent-primary rounded" />
            <span className="text-secondary">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">Forgot Password?</Link>
        </div>
        {/* Sign in button */}
        <button
          type="submit"
          className="w-full btn btn-primary text-secondary font-semibold rounded py-2 mt-2 transition-colors duration-200"
        >
          Sign in
        </button>
      </form>
      {/* Register link */}
      <div className="text-center text-secondary text-sm mt-2">
        Don't have an account
        <Link to="/register" className="text-primary font-semibold ml-1 hover:underline">Register here</Link>
      </div>
      {/* Divider */}
      <div className="flex items-center gap-2 my-2">
        <div className="flex-1 h-px bg-secondary/20" />
      </div>
      {/* Social login */}
      <div className="flex justify-center gap-6 mt-2">
        <button className="text-2xl" title="Sign in with Google">
          <FcGoogle />
        </button>
        <button className="text-2xl text-secondary hover:text-primary transition-colors duration-200" title="Sign in with Apple">
          <FaApple />
        </button>
        <button className="text-2xl text-[#1877f3] hover:text-primary transition-colors duration-200" title="Sign in with Facebook">
          <FaFacebookF />
        </button>
      </div>
    </div>
  );
};

export default Login;