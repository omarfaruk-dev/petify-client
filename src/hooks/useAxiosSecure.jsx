import axios from 'axios';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    // axiosSecure.interceptors.request.use(async config => {
    //     if (user) {
    //         try {
    //             // const token = await user.getIdToken();
    //             const token = await user.accessToken;
    //             config.headers.Authorization = `Bearer ${token}`;
    //             // console.log('[AxiosSecure] Sending request:', config.method, config.url, 'user.email:', user.email, 'token:', token.slice(0, 10) + '...');
    //         } catch (error) {
    //             console.error('[AxiosSecure] Error getting ID token:', error);
    //         }
    //     } 
    //     // else {
    //     //     // console.log('[AxiosSecure] No user found when making request:', config.method, config.url);
    //     // }
    //     return config;
    // }, error => {
    //     return Promise.reject(error);
    // })

    axiosSecure.interceptors.request.use(config => {
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`
        }
        return config;
    }, error => {
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(response => {
        return response;
    }, error => {
        console.error('[AxiosSecure] Response error', error.response?.status, error.response?.data, 'for request:', error.config?.url);
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Logout the user');
        }
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        const status = error.response?.status;
        if (status === 403) {
            navigate('/forbidden');
        }
        else if (status === 401) {
            logOut()
                .then(() => {
                    navigate('/login')
                })
                .catch(() => { })
        }

        return Promise.reject(error);
    })

    return axiosSecure;
};

export default useAxiosSecure;