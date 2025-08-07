import React, { useState } from 'react';
import { FaStar, FaQuoteLeft, FaPaw, FaHeart, FaCheckCircle } from 'react-icons/fa';
import SectionTitle from '../Shared/Component/SectionTitle';

const ClientReview = () => {
    const [activeReview, setActiveReview] = useState(0);

    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Pet Adopter",
            avatar: "https://i.pravatar.cc/100?img=15",
            rating: 5,
            review: "Petify made our adoption journey so smooth! We found our perfect companion, Luna, and the process was transparent and caring. The team really cares about matching pets with the right families.",
            pet: "Luna (Golden Retriever)",
            location: "New York, NY",
            verified: true
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Pet Owner",
            avatar: "https://i.pravatar.cc/100?img=25",
            rating: 5,
            review: "I had to rehome my cat due to allergies, and Petify helped me find the perfect family. The screening process gave me peace of mind knowing she'd be well taken care of.",
            pet: "Whiskers (Persian Cat)",
            location: "Los Angeles, CA",
            verified: true
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Donor & Volunteer",
            avatar: "https://i.pravatar.cc/100?img=35",
            rating: 5,
            review: "I love supporting Petify's donation campaigns! The transparency and impact reports show exactly how my contributions help animals in need. It's a trustworthy platform.",
            pet: "Supports Multiple Campaigns",
            location: "Chicago, IL",
            verified: true
        },
        {
            id: 4,
            name: "David Thompson",
            role: "Foster Parent",
            avatar: "https://i.pravatar.cc/100?img=45",
            rating: 5,
            review: "Fostering through Petify has been incredibly rewarding. The support system is amazing, and seeing pets find their forever homes brings so much joy to our family.",
            pet: "Fostered 12+ Pets",
            location: "Austin, TX",
            verified: true
        },
        {
            id: 5,
            name: "Lisa Wang",
            role: "First-time Adopter",
            avatar: "https://i.pravatar.cc/100?img=55",
            rating: 5,
            review: "As a first-time pet owner, I was nervous about adoption. Petify's guidance and resources made everything so easy. Now I can't imagine life without my little buddy!",
            pet: "Buddy (Mixed Breed)",
            location: "Seattle, WA",
            verified: true
        }
    ];

    const stats = [
        { number: "2,500+", label: "Happy Adoptions", icon: FaHeart },
        { number: "4.9/5", label: "User Rating", icon: FaStar },
        { number: "15,000+", label: "Pets Helped", icon: FaPaw },
        { number: "98%", label: "Success Rate", icon: FaCheckCircle }
    ];

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`text-lg ${
                    index < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
            />
        ));
    };

    return (
        <section className="bg-gradient-to-br from-base-100 via-primary/5 to-secondary/5 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div 
                    className="text-center mb-16"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="800"
                >
                    <SectionTitle
                        title="What Our Community Says"
                        label="Testimonials"
                        labelPosition="center"
                        titlePosition="center"
                    />
                    <p className="text-secondary/80 text-lg max-w-3xl mx-auto mt-6">
                        Hear from pet adopters, donors, and volunteers who have experienced the joy of connecting through Petify
                    </p>
                </div>

                {/* Stats Section */}
                <div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="800"
                >
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="text-center"
                            data-aos="zoom-in"
                            data-aos-delay={300 + (index * 100)}
                            data-aos-duration="800"
                        >
                            <div className="flex justify-center mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-base-100 shadow-lg">
                                    <stat.icon className="text-2xl" />
                                </div>
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                {stat.number}
                            </div>
                            <div className="text-secondary/70 text-sm font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reviews Section */}
                <div 
                    className="grid lg:grid-cols-2 gap-12 items-center"
                    data-aos="fade-up"
                    data-aos-delay="400"
                    data-aos-duration="800"
                >
                    {/* Featured Review */}
                    <div 
                        className="order-2 lg:order-1"
                        data-aos="fade-right"
                        data-aos-delay="500"
                        data-aos-duration="800"
                    >
                        <div className="bg-base-100 rounded shadow p-8 relative">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-base-100 shadow-lg">
                                <FaQuoteLeft className="text-xl" />
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <img
                                    src={reviews[activeReview].avatar}
                                    alt={reviews[activeReview].name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
                                />
                                <div className="ml-4">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-bold text-secondary">
                                            {reviews[activeReview].name}
                                        </h4>
                                        {reviews[activeReview].verified && (
                                            <FaCheckCircle className="text-primary text-sm" />
                                        )}
                                    </div>
                                    <p className="text-primary font-medium text-sm">
                                        {reviews[activeReview].role}
                                    </p>
                                    <p className="text-secondary/60 text-sm">
                                        {reviews[activeReview].location}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                {renderStars(reviews[activeReview].rating)}
                                <span className="ml-2 text-secondary/60 text-sm">
                                    {reviews[activeReview].rating}.0 rating
                                </span>
                            </div>

                            <blockquote className="text-secondary/80 text-lg leading-relaxed mb-4 italic">
                                "{reviews[activeReview].review}"
                            </blockquote>

                            <div className="flex items-center gap-2 text-primary font-medium">
                                <FaPaw className="text-sm" />
                                <span className="text-sm">{reviews[activeReview].pet}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Navigation */}
                    <div 
                        className="order-1 lg:order-2"
                        data-aos="fade-left"
                        data-aos-delay="600"
                        data-aos-duration="800"
                    >
                        <h3 
                            className="text-2xl font-bold text-secondary mb-8"
                            data-aos="fade-up"
                            data-aos-delay="700"
                            data-aos-duration="800"
                        >
                            Real Stories from Real People
                        </h3>
                        
                        <div className="space-y-4">
                            {reviews.map((review, index) => (
                                <div
                                    key={review.id}
                                    className={`p-4 rounded cursor-pointer transition-all duration-300 ${
                                        activeReview === index
                                            ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 shadow-md'
                                            : 'bg-base-100/50 hover:bg-base-100/80 border-2 border-transparent hover:border-primary/20'
                                    }`}
                                    onClick={() => setActiveReview(index)}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-secondary">
                                                    {review.name}
                                                </h4>
                                                {review.verified && (
                                                    <FaCheckCircle className="text-primary text-xs" />
                                                )}
                                            </div>
                                            <p className="text-primary text-sm font-medium">
                                                {review.role}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div 
                    className="mt-16 text-center"
                    data-aos="fade-up"
                    data-aos-delay="900"
                    data-aos-duration="800"
                >
                    <div className="bg-base-100/50 rounded-2xl p-8 border border-primary/10">
                        <h3 
                            className="text-xl font-bold text-secondary mb-6"
                            data-aos="fade-up"
                            data-aos-delay="1000"
                            data-aos-duration="800"
                        >
                            Trusted by Pet Lovers Everywhere
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div 
                                className="text-center"
                                data-aos="zoom-in"
                                data-aos-delay="1100"
                                data-aos-duration="800"
                            >
                                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                                <div className="text-secondary/70 text-sm">Partner Shelters</div>
                            </div>
                            <div 
                                className="text-center"
                                data-aos="zoom-in"
                                data-aos-delay="1200"
                                data-aos-duration="800"
                            >
                                <div className="text-3xl font-bold text-primary mb-2">$500K+</div>
                                <div className="text-secondary/70 text-sm">Raised for Pets</div>
                            </div>
                            <div 
                                className="text-center"
                                data-aos="zoom-in"
                                data-aos-delay="1300"
                                data-aos-duration="800"
                            >
                                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                                <div className="text-secondary/70 text-sm">Support Available</div>
                            </div>
                            <div 
                                className="text-center"
                                data-aos="zoom-in"
                                data-aos-delay="1400"
                                data-aos-duration="800"
                            >
                                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                                <div className="text-secondary/70 text-sm">Secure & Safe</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClientReview;