import { useNavigate } from 'react-router';
import Marquee from 'react-fast-marquee';
import { FaCat, FaDog, FaFish } from 'react-icons/fa';
import { LuBird } from "react-icons/lu";
import { GiRabbit } from 'react-icons/gi';
import SectionTitle from '../Shared/Component/SectionTitle';
import SectionSubtitle from '../Shared/Component/SectionSubtitle';

const categories = [
  { name: 'Cats', icon: <FaCat className="text-4xl text-primary" /> },
  { name: 'Dogs', icon: <FaDog className="text-4xl text-secondary" /> },
  { name: 'Birds', icon: <LuBird  className="text-4xl text-warning" /> },
  { name: 'Rabbits', icon: <GiRabbit className="text-4xl text-accent" /> },
  { name: 'Fish', icon: <FaFish className="text-4xl text-info" /> },
];

const PetsCategory = () => {
  const navigate = useNavigate();
  return (
    <section className="py-5 mb-8 md:mb-16 lg:mb-20 relative w-full max-w-7xl mx-auto px-4 overflow-hidden">
      {/* Decorative paw prints */}
      <svg className="absolute left-8 top-8 opacity-10 z-0" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <ellipse cx="15" cy="15" rx="7" ry="10" fill="#fbbf24"/>
        <ellipse cx="45" cy="15" rx="7" ry="10" fill="#fbbf24"/>
        <ellipse cx="22" cy="38" rx="8" ry="5" fill="#fbbf24"/>
        <ellipse cx="38" cy="38" rx="8" ry="5" fill="#fbbf24"/>
        <ellipse cx="30" cy="48" rx="10" ry="6" fill="#f59e42"/>
      </svg>
      <svg className="absolute right-8 bottom-8 opacity-10 z-0" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <ellipse cx="15" cy="15" rx="7" ry="10" fill="#6ee7b7"/>
        <ellipse cx="45" cy="15" rx="7" ry="10" fill="#6ee7b7"/>
        <ellipse cx="22" cy="38" rx="8" ry="5" fill="#6ee7b7"/>
        <ellipse cx="38" cy="38" rx="8" ry="5" fill="#6ee7b7"/>
        <ellipse cx="30" cy="48" rx="10" ry="6" fill="#34d399"/>
      </svg>
      {/* Section Heading */}
      <SectionTitle title='Browse by Pet Category' labelPosition='center' label='Pets Category' titlePosition='center'/>
      {/* Category Cards Marquee */}
      <div className="relative z-10 w-full py-4">
        <Marquee gradient={false} speed={40} direction="left" pauseOnHover={true} className="flex">
          {Array(3).fill(categories).flat().map((cat, idx) => (
            <button
              key={cat.name + '-' + idx}
              className="group cursor-pointer bg-base-200/60 backdrop-blur-md border border-base-content/10 rounded flex flex-col items-center justify-center p-7 w-32 h-36 min-w-[8rem] mx-8 transition-all duration-300 hover:-translate-y-3 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 card-fade-in"
              style={{ animationDelay: `${(idx % categories.length) * 80}ms` }}
              type="button"
              onClick={() => navigate('/pet-listing')}
            >
              <span className="mb-4 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">
                {cat.icon}
              </span>
              <span className="text-lg font-bold text-base-content group-hover:text-primary tracking-wide">
                {cat.name}
              </span>
            </button>
          ))}
        </Marquee>
      </div>
      {/* Fade-in, glassmorphism, and hide scrollbar styles */}
      <style>{`
        .card-fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default PetsCategory;