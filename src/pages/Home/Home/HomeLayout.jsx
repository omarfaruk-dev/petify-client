import CallToAction from "../../Shared/CallToAction";
import About from "../About";
import Banner from "../Banner";
import PetsCategory from "../PetsCategory";
// import HeroSlider from "../HeroSlider";

const HomeLayout = () => {
    return (
        <div className="min-h-screen">
            {/* <HeroSlider/> */}
            <Banner/>
            <PetsCategory/>
            <CallToAction/>
            <About/>
        </div>
    );
};

export default HomeLayout;