import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaFacebookF, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const Login = () => {
    const { loginUser, googleSignIn } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const location = useLocation();
    const from = location.state?.from || "/";
    const navigate = useNavigate();

    const onSubmit = (data) => {
        loginUser(data.email, data.password)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Logged In Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(from);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.message || 'Invalid credentials',
                });
            });
    };

    //signin with google
    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Logged In Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(from);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.message || 'Google sign-in failed',
                });
            });
    };

    return (
        <div className="w-full max-w-md bg-base-100 rounded shadow-lg p-8 flex flex-col gap-4 z-10">
            <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 inline-block border-primary mx-auto">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Email Input */}
                <div className="mb-1">
                    <label className="label">
                        <span className="label-text text-primary font-medium">Email</span>
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Email"
                            className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
                        />
                        <FaEnvelope className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/60" />
                    </div>
                    {errors.email?.type === "required" && <p className="text-red-500 text-sm mt-1">Email is required</p>}
                </div>
                {/* Password Input */}
                <div className="mb-1">
                    <label className="label">
                        <span className="label-text text-primary font-medium">Password</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register("password", { required: true, minLength: 6 })}
                            placeholder="Type your password"
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
                    {errors.password?.type === "required" && <p className="text-red-500 text-sm mt-1">Password is required</p>}
                    {errors.password?.type === "minLength" && <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters or longer</p>}
                </div>
                <Link to="/forget-password" className="text-sm text-accent mb-4 cursor-pointer hover:underline">
                    Forget Password?
                </Link>
                <button className="btn btn-secondary w-full rounded-md text-primary font-semibold mb-4">
                    Continue
                </button>
                <div className="text-sm text-accent text-center">
                    Don't have any account? <Link to="/register" className="text-secondary hover:underline cursor-pointer">Register</Link>
                </div>
                <div className="divider my-4">Or</div>
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="btn w-full bg-base-200 hover:bg-base-300 flex items-center justify-center gap-2 rounded"
                >
                    <FcGoogle className="text-xl mr-2" /> Login with Google
                </button>
            </form>
        </div>
    );
};

export default Login;