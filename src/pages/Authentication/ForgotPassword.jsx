import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await resetPassword(data.email);
            Swal.fire({
                icon: 'success',
                title: 'Password Reset Email Sent!',
                text: 'Check your inbox for a reset link.',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Send Email',
                text: error.message || 'Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-base-100 rounded shadow-lg p-8 flex flex-col gap-4 z-10">
            <h2 className="text-3xl font-extrabold text-secondary mb-2 border-b-2 pb-2 inline-block border-primary mx-auto">Reset Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Email Input */}
                <div className="mb-1">
                    <label className="label">
                        <span className="label-text text-secondary font-medium">Email</span>
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="Enter your email"
                            className="w-full border-b border-secondary/30 focus:border-primary outline-none py-2 pr-10 pl-3 bg-transparent text-secondary placeholder:text-secondary/60 rounded"
                            disabled={loading}
                        />
                        <FaEnvelope className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/60" />
                    </div>
                    {errors.email?.type === "required" && <p className="text-red-500 text-sm mt-1">Email is required</p>}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-full rounded-md text-base-100 font-semibold mb-4"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-sm text-accent text-center">
                    Remember your password?{' '}
                    <Link to="/login" className="link-primary font-semibold ml-1 hover:underline cursor-pointer">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;