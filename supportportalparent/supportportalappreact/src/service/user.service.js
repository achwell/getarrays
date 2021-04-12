import axios from "axios";

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
const userService = {
    getUsers: () => {
        return axios.get(`${baseUrl}/user`);
    },
    addUser: (user) => {
        return axios.post(`${baseUrl}/user`, user);
    },
    updateUser: (user) => {
        return axios.put(`${baseUrl}/user`, user);
    },
    resetPassword: (email) => {
        return axios.get(`${baseUrl}/user/resetpassword/${email}`);
    },

    deleteUser(userName) {
        return axios.delete(`${baseUrl}/user/${userName}`);
    },
    addUsersToLocalCache(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },
    getUsersFromLocalCache() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }
};
export default userService;
