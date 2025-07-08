import { createBrowserRouter } from "react-router";
import HomeLayout from "../pages/Home/Home/HomeLayout";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Authentication/Login";


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
                path: '/login',
                Component: Login
            },
        ]
    },
   
])


export default router;