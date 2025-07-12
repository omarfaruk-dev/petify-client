

import React from 'react';
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = ({children}) => {

    const { user, loading } = useAuth();
    const location = useLocation();

    // Redirect to login if no user (only after loading is complete)
    if (!loading && !user) {
       return <Navigate state={{from: location?.pathname}} to='/login' />
    }

    return children
};

export default PrivateRoutes;