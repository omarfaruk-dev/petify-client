import { createBrowserRouter } from "react-router";
import HomeLayout from "../pages/Home/Home/HomeLayout";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";


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
   
])


export default router;