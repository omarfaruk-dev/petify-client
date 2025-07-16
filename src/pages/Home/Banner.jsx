
import { FaPaw } from 'react-icons/fa';
import bannerImg from '../../assets/images/banner.png';
import { Link } from 'react-router';

const Banner = () => {
    return (
        <section
            className="mb-20 md:mb-30 py-50 relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden rounded-b-md  border border-base-content/10 my-6"
        >
            {/* Petify themed single banner image */}
            <img
                src={bannerImg}
                alt="Petify Banner"
                className="absolute inset-0 w-full h-full object-cover object-center z-10 pointer-events-none select-none opacity-90 transition-all duration-500"
                loading="lazy"
            />
            {/* Primary color overlay */}
            <div className="absolute inset-0 z-20 bg-primary/30 opacity-40 pointer-events-none select-none mix-blend-multiply" />
            {/* Animated pet-themed background icons */}
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                {/* Animated Paw Icon */}
                <FaPaw className="absolute left-10 top-10 text-5xl text-primary animate-bounce-slow opacity-30" />
                {/* Animated SVG Paw Prints */}
                <svg className="absolute right-16 bottom-10 animate-bounce-slower opacity-30" width="70" height="70" viewBox="0 0 70 70" fill="none">
                    <ellipse cx="15" cy="15" rx="8" ry="12" fill="#fbbf24"/>
                    <ellipse cx="55" cy="15" rx="8" ry="12" fill="#fbbf24"/>
                    <ellipse cx="25" cy="40" rx="10" ry="7" fill="#fbbf24"/>
                    <ellipse cx="45" cy="40" rx="10" ry="7" fill="#fbbf24"/>
                    <ellipse cx="35" cy="55" rx="13" ry="8" fill="#f59e42"/>
                </svg>
                {/* Floating Cat Silhouette */}
                <svg className="absolute left-0 bottom-0 animate-float opacity-10" width="120" height="90" viewBox="0 0 120 90" fill="none">
                    <ellipse cx="60" cy="70" rx="40" ry="15" fill="#a5b4fc"/>
                    <ellipse cx="40" cy="40" rx="18" ry="25" fill="#818cf8"/>
                    <ellipse cx="80" cy="40" rx="18" ry="25" fill="#818cf8"/>
                    <polygon points="32,20 38,5 44,20" fill="#818cf8"/>
                    <polygon points="76,20 82,5 88,20" fill="#818cf8"/>
                </svg>
                {/* Spinning Dog Bone */}
                <svg className="absolute right-10 top-10 animate-spin-slow opacity-20" width="80" height="40" viewBox="0 0 80 40" fill="none">
                    <rect x="20" y="15" width="40" height="8" rx="4" fill="#fca5a5"/>
                    <circle cx="20" cy="19" r="8" fill="#fca5a5"/>
                    <circle cx="60" cy="19" r="8" fill="#fca5a9"/>
                </svg>
            </div>
            {/* Content */}
            <div className="relative z-30 max-w-2xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
                    Find, Adopt, Donate & Care for Pets with Petify
                </h1>
                <p className="text-base md:text-lg text-accent mb-6">
                    Discover loving pets, connect with caring owners, and make a difference—adopt, donate, or support animal welfare, all in one place.
                </p>
                <Link to='/pet-listing' className='btn btn-primary text-base-100 btn-lg shadow'>
                    Explore Pets Now
                </Link>
            </div>
            {/* Animation styles */}
            <style>{`
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
            `}</style>
        </section>
    );
};

export default Banner;