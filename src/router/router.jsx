import { createBrowserRouter } from "react-router";
import HomeLayout from "../pages/Home/Home/HomeLayout";
import MainLayout from "../layouts/MainLayout";


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
    }
])


export default router;