

import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Spinner from "../pages/Shared/Spinner";

const PrivateRoutes = ({children}) => {

    const { user, loading } = useAuth();
     const location = useLocation();

    if (!user) {
       return <Navigate state={location?.pathname} to='/login' />
    }

    if (loading) {
        return <Spinner />
    }


    return children
};

export default PrivateRoutes;