
import { Link } from 'react-router';
import { FaPaw } from 'react-icons/fa';
import dogImg from '../../assets/images/dog-cta.PNG'; // Replace with a more inspirational image if available

const CallToAction = () => {
    return (
        <section className="relative w-full mx-auto my-20 px-4 py-20 overflow-hidden bg-gradient-to-br from-primary/20  to-accent/10">
            {/* Soft, relevant background pattern overlay */}
            <div className="absolute inset-0 z-0 bg-repeat opacity-10 pointer-events-none select-none" style={{backgroundSize: '120px 120px'}} />
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                {/* Decorative Paw Print SVGs */}
                <svg className="absolute left-8 top-8 opacity-10 z-0" width="70" height="70" viewBox="0 0 70 70" fill="none">
                    <ellipse cx="15" cy="15" rx="8" ry="12" fill="#fbbf24"/>
                    <ellipse cx="55" cy="15" rx="8" ry="12" fill="#fbbf24"/>
                    <ellipse cx="25" cy="40" rx="10" ry="7" fill="#fbbf24"/>
                    <ellipse cx="45" cy="40" rx="10" ry="7" fill="#fbbf24"/>
                    <ellipse cx="35" cy="55" rx="13" ry="8" fill="#f59e42"/>
                </svg>
                <svg className="absolute right-8 bottom-8 opacity-10 z-0" width="70" height="70" viewBox="0 0 70 70" fill="none">
                    <ellipse cx="15" cy="15" rx="8" ry="12" fill="#6ee7b7"/>
                    <ellipse cx="55" cy="15" rx="8" ry="12" fill="#6ee7b7"/>
                    <ellipse cx="25" cy="40" rx="10" ry="7" fill="#6ee7b7"/>
                    <ellipse cx="45" cy="40" rx="10" ry="7" fill="#6ee7b7"/>
                    <ellipse cx="35" cy="55" rx="13" ry="8" fill="#34d399"/>
                </svg>
                {/* Inspirational Image */}
                <div className="flex-1 flex justify-center items-center relative z-10">
                <div className="relative rounded p-0 shadow border border-primary/20 overflow-hidden md:w-[480px] md:h-[320px] flex items-center justify-center">
                    {/* Help Me Badge */}
                    <span className="absolute top-4 left-4 z-20 bg-error text-white text-xs md:text-sm font-bold px-4 py-1 rounded-full shadow-lg tracking-wide animate-pulse select-none">
                        Help Me
                    </span>
                    <img
                        src={dogImg}
                        alt="Adopt a Pet Inspiration"
                        className="lg:w-full h-full object-cover border-0 hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>
                </div>
                {/* Motivational Text & CTA */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-secondary mb-5 drop-shadow-lg">
                        Give a Pet a <span className="text-primary">Second Chance</span>
                    </h2>
                    <p className="text-base md:text-lg text-base-content/80 mb-8 max-w-lg">
                        Every adoption is a new beginning. <span className="text-primary font-semibold">Open your heart</span> and home to a loving companion—adopt a pet and change two lives: theirs and yours. <span className="text-accent font-semibold">Together, we can give every animal the life they deserve.</span>
                    </p>
                    <Link to="/pet-listing" className="btn btn-primary btn-lg text-base-100 shadow px-10 py-3 rounded-full text-lg font-bold tracking-wide flex items-center gap-2 transition-transform duration-200">
                        <FaPaw className="text-xl mb-0.5" />
                        Adopt & Change a Life
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;