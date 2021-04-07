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

const roleService = {
    loadRoles: () => {
        axios.get(`${baseUrl}/role`)
            .then(response => {
                localStorage.setItem('roles', JSON.stringify(response.data));
            })
    },
    getRole: name => {
        return this.getRoles().filter(role => role.name === name);
    },
    getRoles: () => {
        let roles = localStorage.getItem("roles")
        return roles ? JSON.parse(roles) : [];
    },
};
export default roleService;
