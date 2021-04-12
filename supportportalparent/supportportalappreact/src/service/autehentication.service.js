import axios from "axios";
import jwt_decode from "jwt-decode";

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL ? process.env.REACT_APP_BACKEND_BASE_URL : window.location.origin;

//request interceptor to add the auth token header to requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
//response interceptor to refresh token on receiving token expired error
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        const originalRequest = error.config;
        let refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return axios
                .get(`${baseUrl}/token/refresh`)
                .then((res) => {
                    if (res.status === 200) {
                        localStorage.setItem("token", res.data.token);
                        console.log("Access token refreshed!");
                        return axios(originalRequest);
                    }
                });
        }
        return Promise.reject(error);
    }
);
//functions to make api calls
const authenticationService = {
    register: (body) => {
        return axios.post(`${baseUrl}/user/register`, body);
    },
    login: (body) => {
        return axios.post(`${baseUrl}/user/login`, body);
    },
    refreshToken: (body) => {
        return axios.get(`${baseUrl}/token/refresh`);
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('users');
        localStorage.removeItem('roles');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    saveToken(token) {
        localStorage.setItem('token', token);
    },

    addUserToLocalCache(body) {
        localStorage.setItem('user', JSON.stringify(body));
    },

    getUserFromLocalCache() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {};
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isLoggedIn() {
        let token = this.getToken();
        if (token != null && token !== '') {
            const decodedToken = jwt_decode(token);
            const subject = decodedToken.sub;
            if ((subject != null || '') && !decodedToken.exp * 1000 < new Date().getTime()) {
                return true;
            }
        }
        this.logout();
        return false;
    },

    getUsername() {
        const user = this.getUserFromLocalCache();
        return user && user.username;
    },

    hasPrivilege(privilege) {
        const user = this.getUserFromLocalCache();
        if (!user) {
            return false;
        }
        const role = user.role;
        if (!role) {
            return false;
        }
        let hasPrivilege = false;
        role.privileges.forEach(p => {
            if(p.name === privilege) {
                hasPrivilege = true;
            }
        })
        return hasPrivilege;
    }
};
export default authenticationService;
