import CallToAction from "../../Shared/CallToAction";
import About from "../About";
import Banner from "../Banner";
import ClientReview from "../ClientReview";
import Faq from "../Faq";
import PetsCategory from "../PetsCategory";
import RecentPets from "../RecentPets";
import WhyChooseUs from "../WhyChooseUs";
// import HeroSlider from "../HeroSlider";

const HomeLayout = () => {
    return (
        <div className="min-h-screen">
            {/* <HeroSlider/> */}
            <Banner/>
            <PetsCategory/>
            <RecentPets/>
            <CallToAction/>
            <About/>
            <WhyChooseUs/>
            <Faq/>
            <ClientReview/>
        </div>
    );
};

export default HomeLayout;