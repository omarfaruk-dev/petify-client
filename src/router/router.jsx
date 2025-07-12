import { createBrowserRouter } from "react-router";
import HomeLayout from "../pages/Home/Home/HomeLayout";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import PrivateRoutes from "../Routes/PrivateRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import MyProfile from "../pages/Dashboard/MyProfile";
import AddAPet from "../pages/Dashboard/AddAPet/AddAPet";
import MyAddedPets from "../pages/Dashboard/MyAddedPets/MyAddedPets";
import UpdatePet from "../pages/Dashboard/UpdatePet/UpdatePet";
import PetListing from "../pages/PetListing/PetListing";
import PetDetails from "../pages/PetDetails/PetDetails";
import AdoptionRequest from "../pages/Dashboard/AdoptionRequest/AdoptionRequest";
import CreateCampaign from "../pages/Dashboard/CreateCampaign/CreateCampaign";
import MyCampaign from "../pages/Dashboard/MyCampaign/MyCampaign";
import EditCampaign from "../pages/Dashboard/EditCampaign/EditCampaign";
import DonationCampaigns from "../pages/DonationCampaign/DonationCampaigns";


const router = createBrowserRouter([
    {
        path: '/',
        Component:MainLayout,
        children: [
            {
                path: '/',
                Component: HomeLayout,
            },
            {
                path: 'pet-listing',
                Component: PetListing,
            },
            {
                path: 'pet-details/:id',
                Component: PetDetails,
            },
            {
                path: 'donation-campaigns',
                Component: DonationCampaigns,
            },
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: '/login',
                Component: Login,
            },
            {
                path: '/register',
                Component: Register,
            },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoutes><DashboardLayout/></PrivateRoutes>,
        children: [
            {
                index: true,
                element: <div className="p-8"><h1 className="text-2xl font-bold">Dashboard Home</h1></div>
            },
            {
                path: 'my-profile',
                Component: MyProfile,
            },
            {
                path: 'add-pet',
                Component: AddAPet,
            },
            {
                path: 'my-added-pets',
                Component: MyAddedPets,
            },
            {
                path: 'update-pet/:id',
                Component: UpdatePet,
            },
            {
                path: 'adoption-requests',
                Component: AdoptionRequest,
            },
            {
                path: 'create-campaign',
                Component: CreateCampaign,
            },
            {
                path: 'my-campaigns',
                Component: MyCampaign,
            },
            {
                path: 'edit-campaign/:id',
                Component: EditCampaign,
            },
        ]
    },
   
])


export default router;