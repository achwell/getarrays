import axios from 'axios';
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
