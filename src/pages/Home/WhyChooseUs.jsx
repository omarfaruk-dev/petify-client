// WhyChooseUs.jsx
import { FaPaw, FaShieldAlt, FaSmile, FaHandsHelping } from 'react-icons/fa';

const features = [
  {
    id: 1,
    icon: FaPaw,
    bgColor: 'bg-gradient-to-br from-primary to-secondary',
    title: 'Compassionate Mission',
    description: 'Petify is dedicated to rescuing, rehabilitating, and rehoming pets. Every adoption supports our mission to give every animal a loving home.',
  },
  {
    id: 2,
    icon: FaShieldAlt,
    bgColor: 'bg-gradient-to-br from-primary to-secondary',
    title: 'Safe & Verified',
    description: 'All pets and adopters are carefully screened. We partner with trusted shelters and provide health checks, vaccinations, and ongoing support.',
  },
  {
    id: 3,
    icon: FaSmile,
    bgColor: 'bg-gradient-to-br from-primary to-secondary',
    title: 'Joyful Experience',
    description: 'Our platform is easy to use, transparent, and supportive—making adoption a joyful journey for both pets and people.',
  },
  {
    id: 4,
    icon: FaHandsHelping,
    bgColor: 'bg-gradient-to-br from-primary to-secondary',
    title: 'Community Support',
    description: 'Join a caring community of adopters, fosters, and donors. Petify empowers you to make a difference through adoption, volunteering, or giving.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-primary/20 py-12 lg:py-26 sm:py-20 px-4 mb-8 md:mb-12 lg:mb-16 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-4 lg:px-8 flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-8">
        
        <div className="w-full lg:w-5/12 xl:w-/12 flex-shrink-0 flex justify-center lg:justify-end">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[360px] md:h-[360px] lg:w-[380px] lg:h-[380px]">
            <div className="absolute inset-0 bg-primary/10 rounded-full shadow-lg">
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 
                          w-[70%] sm:w-[60%] 
                          translate-x-[-30%] sm:translate-x-[-25%] md:translate-x-[-20%] lg:translate-x-[-15%]
                          text-secondary text-[12px] leading-snug 
                          sm:text-xs sm:leading-normal 
                          md:text-sm md:leading-relaxed">
                <p>Petify is your trusted partner for pet adoption, rescue & donate. We make it easy to find, adopt, and support pets in need—safely and joyfully.</p>
              </div>
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/3 w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 bg-primary text-base-100 rounded-full flex items-center justify-center text-center shadow-xl z-10">
              <div className="font-bold text-lg sm:text-xl md:text-2xl leading-tight">
                WHY<br />CHOOSE<br />PETIFY?
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-7/12 xl:w-8/12 lg:pl-10 xl:pl-16 flex flex-col justify-center">
            {features.map((feature, index) => {
                let itemSpecificClasses = "";
                let marginTopClass = "";

                if (features.length === 4) {
                    switch (index) {
                        case 0: 
                            itemSpecificClasses = "lg:translate-x-0";
                            marginTopClass = "lg:mt-0"; 
                            break;
                        case 1:
                            itemSpecificClasses = "lg:translate-x-6 xl:translate-x-10";
                            marginTopClass = "mt-8 md:mt-8 lg:mt-6"; 
                            break;
                        case 2: 
                            itemSpecificClasses = "lg:translate-x-6 xl:translate-x-10";
                            marginTopClass = "mt-6 md:mt-6 lg:mt-4"; 
                            break;
                        case 3: 
                            itemSpecificClasses = "lg:translate-x-0";
                            marginTopClass = "mt-8 md:mt-8 lg:mt-6"; 
                            break;
                        default:
                            marginTopClass = "mt-8 md:mt-10"; 
                    }
                } else { 
                    marginTopClass = index === 0 ? "lg:mt-0" : "mt-8 md:mt-10";
                }

                return (
                    <div key={feature.id} className={`flex items-start gap-3 sm:gap-4 relative ${itemSpecificClasses} ${marginTopClass}`}>
                        
                        <div className={`hidden lg:block absolute top-[18px] sm:top-[22px] 
                                         left-[-2rem] xl:left-[-3.5rem]
                                         w-6 xl:w-12 h-px bg-primary z-0`}></div>
                        
                       
                        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base-100 shadow-md z-10 ${feature.bgColor}`}>
                            <feature.icon className="text-xl sm:text-2xl" />
                        </div>
                        
                       
                        <div className="flex-grow pt-px sm:pt-0.5">
                            <h4 className="font-semibold text-secondary text-base sm:text-lg md:text-xl">
                                {feature.title}
                            </h4>
                            <p className="text-sm sm:text-base text-accent mt-1">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;