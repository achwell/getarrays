import jwt_decode from "jwt-decode";

import usermanagerapi from "../api/usermanagerapi";

//functions to make api calls
const authenticationService = {
    register: (body) => {
        return usermanagerapi.post('/user/register', body);
    },
    login: (body) => {
        return usermanagerapi.post('/user/login', body);
    },
    refreshToken: (body) => {
        return usermanagerapi.get('/token/refresh');
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
