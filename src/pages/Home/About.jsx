
import SectionTitle from '../Shared/Component/SectionTitle';
import {  FaUsers, FaDog, FaHandHoldingHeart } from 'react-icons/fa';
import aboutLottie from '../../assets/lotties/about.json';
import Lottie from 'lottie-react';

const About = () => {
    return (
        <section className="w-full py-8 px-4 max-w-7xl mx-auto mb-8 md:mb-12 lg:mb-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
                {/* Left: About Details */}
                <div 
                    className="flex-1 flex flex-col justify-center items-start text-left"
                    data-aos="fade-right"
                    data-aos-delay="200"
                    data-aos-duration="800"
                >
                    <div
                        data-aos="fade-up"
                        data-aos-delay="300"
                        data-aos-duration="800"
                    >
                        <SectionTitle label="Who We Are" labelPosition="left" title="About Petify" titlePosition="left" />
                    </div>
                    <p 
                        className="text-base md:text-lg text-base-content/80 max-w-xl mt-2 mb-4"
                        data-aos="fade-up"
                        data-aos-delay="400"
                        data-aos-duration="800"
                    >
                        <span className="font-semibold text-primary">Petify</span> is dedicated to giving every pet a second chance at happiness. Our mission is to make pet adoption easy, transparent, and joyful for everyone. We believe every animal deserves a loving home, and every person deserves the unconditional love of a companion.
                    </p>
                    <p 
                        className="text-base md:text-lg text-base-content/70 max-w-xl mb-6"
                        data-aos="fade-up"
                        data-aos-delay="500"
                        data-aos-duration="800"
                    >
                        Join our caring community—whether you're looking to adopt, foster, or support animal welfare. Together, we can create a world where every pet finds their forever family.
                    </p>
                    {/* Stats */}
                    <div 
                        className="flex gap-6 mt-4"
                        data-aos="fade-up"
                        data-aos-delay="600"
                        data-aos-duration="800"
                    >
                        <div className="flex flex-col items-center bg-primary/10 rounded-xl px-5 py-3">
                            <FaUsers className="text-2xl text-primary mb-1" />
                            <span className="text-xl font-bold text-primary">10K+</span>
                            <span className="text-xs text-base-content/70">Happy Members</span>
                        </div>
                        <div className="flex flex-col items-center bg-secondary/10 rounded-xl px-5 py-3">
                            <FaDog className="text-2xl text-secondary mb-1" />
                            <span className="text-xl font-bold text-secondary">5K+</span>
                            <span className="text-xs text-base-content/70">Pets Adopted</span>
                        </div>
                        <div className="flex flex-col items-center bg-accent/10 rounded-xl px-5 py-3">
                            <FaHandHoldingHeart className="text-2xl text-accent mb-1" />
                            <span className="text-xl font-bold text-accent">2K+</span>
                            <span className="text-xs text-base-content/70">Donations</span>
                        </div>
                    </div>
                </div>
                {/* Right: Lottie Animation */}
                <div 
                    className="flex-1 flex justify-center items-center"
                    data-aos="fade-left"
                    data-aos-delay="400"
                    data-aos-duration="800"
                >
                    <div className="relative w-[360px] md:w-[420px] px-4 h-[360px] flex items-center justify-center overflow-visible">
                        <Lottie
                            animationData={aboutLottie}
                            loop
                            autoplay
                            style={{ width: 380, height: 400 }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;