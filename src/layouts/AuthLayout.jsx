import React from 'react';
import { Outlet } from 'react-router';
import PetifyLogo from '../pages/Shared/PetifyLogo';

const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/30 relative overflow-hidden">
            {/* Optional: Add pet-themed SVGs or background decorations here for extra flair */}
            {/* Petify Logo at the top, clickable to go home */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
                <a href="/">
                    {/* Assume PetifyLogo.jsx exports a default component */}
                    <PetifyLogo className=" cursor-pointer transition-transform hover:scale-105" />
                </a>
            </div>

            {/* Animated pet-themed background */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {/* Paw prints */}
                <svg className="absolute left-8 top-16 animate-bounce-slow opacity-20" width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <ellipse cx="20" cy="20" rx="10" ry="14" fill="#fbbf24"/>
                    <ellipse cx="60" cy="20" rx="10" ry="14" fill="#fbbf24"/>
                    <ellipse cx="30" cy="50" rx="12" ry="8" fill="#fbbf24"/>
                    <ellipse cx="50" cy="50" rx="12" ry="8" fill="#fbbf24"/>
                    <ellipse cx="40" cy="65" rx="16" ry="10" fill="#f59e42"/>
                </svg>
                <svg className="absolute right-10 bottom-24 animate-bounce-slower opacity-20" width="70" height="70" viewBox="0 0 70 70" fill="none">
                    <ellipse cx="15" cy="15" rx="8" ry="12" fill="#6ee7b7"/>
                    <ellipse cx="55" cy="15" rx="8" ry="12" fill="#6ee7b7"/>
                    <ellipse cx="25" cy="40" rx="10" ry="7" fill="#6ee7b7"/>
                    <ellipse cx="45" cy="40" rx="10" ry="7" fill="#6ee7b7"/>
                    <ellipse cx="35" cy="55" rx="13" ry="8" fill="#34d399"/>
                </svg>
                {/* Cat silhouette */}
                <svg className="absolute left-0 bottom-0 animate-float opacity-10" width="180" height="140" viewBox="0 0 180 140" fill="none">
                    <ellipse cx="90" cy="110" rx="70" ry="30" fill="#a5b4fc"/>
                    <ellipse cx="60" cy="60" rx="30" ry="40" fill="#818cf8"/>
                    <ellipse cx="120" cy="60" rx="30" ry="40" fill="#818cf8"/>
                    <polygon points="45,30 55,10 65,30" fill="#818cf8"/>
                    <polygon points="135,30 145,10 155,30" fill="#818cf8"/>
                </svg>
                {/* Dog bone */}
                <svg className="absolute right-0 top-0 animate-spin-slow opacity-10" width="120" height="60" viewBox="0 0 120 60" fill="none">
                    <rect x="30" y="25" width="60" height="10" rx="5" fill="#fca5a5"/>
                    <circle cx="30" cy="30" r="15" fill="#fca5a5"/>
                    <circle cx="90" cy="30" r="15" fill="#fca5a9"/>
                </svg>
            </div>

            {/* Animations */}
            <style>
                {`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-20px);}
                }
                @keyframes bounce-slower {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-12px);}
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-10px);}
                }
                @keyframes spin-slow {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s infinite;
                }
                .animate-bounce-slower {
                    animation: bounce-slower 6s infinite;
                }
                .animate-float {
                    animation: float 7s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 18s linear infinite;
                }
                `}
            </style>
            <div className="w-full flex items-center justify-center py-12 px-2">
                <Outlet/>
            </div>
        </div>
    );
};

export default AuthLayout;