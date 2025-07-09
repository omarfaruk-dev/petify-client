

import React from 'react';
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Spinner from "../pages/Shared/Spinner";

const PrivateRoutes = ({children}) => {

    const { user, loading } = useAuth();
    const location = useLocation();

    // Show spinner while loading
    if (loading) {
        return <Spinner />
    }

    // Redirect to login if no user
    if (!user) {
       return <Navigate state={{from: location?.pathname}} to='/login' />
    }

    return children
};

export default PrivateRoutes;