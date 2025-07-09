import { createBrowserRouter } from "react-router";
import HomeLayout from "../pages/Home/Home/HomeLayout";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import PrivateRoutes from "../Routes/PrivateRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import MyProfile from "../pages/Dashboard/MyProfile";


const router = createBrowserRouter([
    {
        path: '/',
        Component:MainLayout,
        children: [
            {
                path: '/',
                Component: HomeLayout,
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
        element: <PrivateRoutes><DashboardLayout/> </PrivateRoutes>,
        children: [
            {
                path: 'my-profile',
                Component:MyProfile,
                
            },
        ]
    },
   
])


export default router;