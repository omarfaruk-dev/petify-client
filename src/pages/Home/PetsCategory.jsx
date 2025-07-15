import React from 'react';
import { FaCat, FaDog, FaFish } from 'react-icons/fa';
import { LuBird } from "react-icons/lu";
import { GiRabbit } from 'react-icons/gi';

const categories = [
  { name: 'Cats', icon: <FaCat className="text-4xl text-primary" /> },
  { name: 'Dogs', icon: <FaDog className="text-4xl text-secondary" /> },
  { name: 'Birds', icon: <LuBird  className="text-4xl text-warning" /> },
  { name: 'Rabbits', icon: <GiRabbit className="text-4xl text-accent" /> },
  { name: 'Fish', icon: <FaFish className="text-4xl text-info" /> },
  // Add more categories as needed
];

const PetsCategory = () => {
  return (
    <section className="relative w-full max-w-6xl mx-auto py-14 px-4 rounded-2xl overflow-hidden mt-8 mb-12">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 blur-[2px] z-0" />
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
      <h2 className="relative z-10 text-3xl md:text-4xl font-extrabold text-center text-primary drop-shadow mb-3 tracking-tight">
        <span className="inline-block bg-white/70 px-4 py-1 rounded-xl shadow-sm">🐾 Browse by Pet Category 🐾</span>
      </h2>
      <p className="relative z-10 text-center text-base md:text-lg text-base-content/70 mb-10 max-w-2xl mx-auto">
        Find your favorite type of pet! Click a category to explore adorable companions.
      </p>
      {/* Category Cards */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-7 justify-items-center">
        {categories.map((cat, idx) => (
          <button
            key={cat.name}
            className="group bg-white/60 backdrop-blur-md border border-base-content/10 rounded-2xl shadow-lg flex flex-col items-center justify-center p-7 w-32 h-36 transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 card-fade-in"
            style={{ animationDelay: `${idx * 80}ms` }}
            type="button"
          >
            <span className="mb-4 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">
              {cat.icon}
            </span>
            <span className="text-lg font-bold text-base-content group-hover:text-primary tracking-wide">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
      {/* Fade-in and glassmorphism styles */}
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
      `}</style>
    </section>
  );
};

export default PetsCategory;