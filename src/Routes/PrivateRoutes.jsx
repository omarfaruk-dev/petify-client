

import React from 'react';
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
// import Spinner from '../pages/Shared/Spinner';

const PrivateRoutes = ({children}) => {

    const { user, loading } = useAuth();
    const location = useLocation();

    // if(loading){
    //     return <Spinner/>
    // }

    // Redirect to login if no user or no user.email (only after loading is complete)
    if (!loading && (!user || !user.email)) {
       return <Navigate state={{from: location?.pathname}} to='/login' />
    }

    return children
};

export default PrivateRoutes;