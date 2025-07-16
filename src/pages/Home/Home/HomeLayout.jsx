import CallToAction from "../../Shared/CallToAction";
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
        </div>
    );
};

export default HomeLayout;