import React, { useState, useRef } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import faqLottie from '../../assets/lotties/faq.json';
import Lottie from 'lottie-react';
import SectionTitle from '../Shared/Component/SectionTitle';

const faqData = [
  {
    question: 'How does Petify help me adopt a pet?',
    answer: 'Petify connects you with verified shelters and fosters, making it easy to browse, apply, and adopt pets online. Our team guides you through every step, from application to bringing your new friend home.',
  },
  {
    question: 'What is the adoption process on Petify?',
    answer: 'Simply create an account, browse available pets, and submit an adoption request. Our team reviews your application, arranges a meet-and-greet, and helps finalize the adoption to ensure a perfect match.',
  },
  {
    question: 'Is there a fee to adopt through Petify?',
    answer: 'Yes, Petify charges a small adoption fee that covers vaccinations, microchipping, and health checks. This fee helps us support more rescues and provide ongoing care for animals in need.',
  },
  {
    question: 'Can I donate or volunteer with Petify?',
    answer: 'Absolutely! You can donate directly through our platform or sign up to volunteer at local shelters and events. Your support helps us rescue, rehabilitate, and rehome more pets every year.',
  },
  {
    question: 'How does Petify ensure pet health and safety?',
    answer: 'All pets listed on Petify are vaccinated, health-checked, and cared for by trusted shelters or fosters. We work closely with vets and trainers to ensure every animal is ready for a loving home.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const panelRefs = useRef([]);

  return (
    <section className="py-5 mb-8 md:mb-16 lg:mb-20 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-base-100 rounded-2xl">
      {/* Left: Lottie Animation */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-[420px] h-[420px] flex items-center justify-center">
          <Lottie animationData={faqLottie} loop autoplay style={{ width: 400, height: 400 }} />
        </div>
      </div>
      {/* Right: FAQ Content */}
      <div className="flex-1 flex flex-col items-start justify-center max-w-xl w-full">
      <SectionTitle
          label="FAQ"
          labelPosition="left"
          title={<>Have any question?</>}
          titlePosition="left"
        />
        <div className="flex flex-col gap-3 w-full"> 
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            if (!panelRefs.current[idx]) {
              panelRefs.current[idx] = React.createRef();
            }
            const panelRef = panelRefs.current[idx];
            // Calculate maxHeight for smooth transition
            let maxHeight = 0;
            if (isOpen && panelRef.current) {
              maxHeight = panelRef.current.scrollHeight;
            }
            return (
              <div key={item.question} className="w-full">
                <button
                  className={`flex items-center justify-between w-full px-6 py-4 rounded text-left font-semibold text-base md:text-lg transition-all duration-200 focus:outline-none shadow-sm group border border-base-200 ${isOpen ? 'bg-primary/10 text-secondary border-primary/30' : 'bg-base-100 text-base-content hover:bg-base-200/60'}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className={`flex-1 transition-colors duration-200 ${isOpen ? 'font-bold text-primary' : ''}`}>{item.question}</span>
                  <span className={`ml-4 flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary/30 transition-all duration-300 ${isOpen ? 'bg-primary/90 text-white' : 'bg-base-100 text-primary'}`}>
                    {isOpen ? <FiMinus className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                  </span>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                  style={{ maxHeight: isOpen && panelRef.current ? maxHeight : 0, willChange: 'max-height, opacity' }}
                  ref={panelRef}
                >
                  <div className="px-6 pb-4 pt-2 text-base text-base-content/70">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Optional: Lottie animation for mobile view */}
        <div className="block md:hidden mt-8 w-full justify-center">
          <Lottie animationData={faqLottie} loop autoplay style={{ width: 200, height: 200 }} />
        </div>
      </div>
    </section>
  );
};

export default Faq;