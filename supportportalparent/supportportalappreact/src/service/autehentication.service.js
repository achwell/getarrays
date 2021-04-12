import axios from "axios";
import jwt_decode from "jwt-decode";
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL ? process.env.REACT_APP_BACKEND_BASE_URL : window.location.origin;

// Use interceptor to inject the token to requests
axios.interceptors.request.use(request => {
    request.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    return request;
});

// Function that will be called to refresh authorization
const refreshAuthLogic = failedRequest => axios.post(`${baseUrl}/token/refresh`).then(tokenRefreshResponse => {
    localStorage.setItem('token', tokenRefreshResponse.data.token);
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
    return Promise.resolve();
});

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axios, refreshAuthLogic);

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
