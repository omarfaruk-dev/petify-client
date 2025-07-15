import React from 'react';

const bannerImage = 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80'; // Replace with your own image if desired

const HeroSlider = () => {
  return (
    <section className="relative w-full h-[350px] md:h-[480px] lg:h-[600px] flex items-center justify-center overflow-hidden rounded-xl shadow-lg my-6">
      {/* Banner Image */}
      <img
        src={bannerImage}
        alt="Adopt a pet banner"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        draggable="false"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">
          Adopt, Love, Repeat
        </h1>
        <p className="text-lg md:text-2xl text-white/90 font-medium mb-6 max-w-2xl mx-auto drop-shadow">
          Give a loving home to a pet in need. Start your adoption journey with Petify today!
        </p>
        <a
          href="#pet-listing"
          className="inline-block px-8 py-3 rounded-full bg-white/90 hover:bg-white text-primary font-bold text-lg shadow-lg transition-all duration-200 border-2 border-primary/80 hover:scale-105"
        >
          View Pets
        </a>
      </div>
      {/* Decorative Paw Print */}
      <svg className="absolute left-8 bottom-8 w-20 h-20 opacity-30 z-10 hidden md:block" viewBox="0 0 80 80" fill="none">
        <ellipse cx="20" cy="20" rx="10" ry="14" fill="#fbbf24"/>
        <ellipse cx="60" cy="20" rx="10" ry="14" fill="#fbbf24"/>
        <ellipse cx="30" cy="50" rx="12" ry="8" fill="#fbbf24"/>
        <ellipse cx="50" cy="50" rx="12" ry="8" fill="#fbbf24"/>
        <ellipse cx="40" cy="65" rx="16" ry="10" fill="#f59e42"/>
      </svg>
    </section>
  );
};

export default HeroSlider;