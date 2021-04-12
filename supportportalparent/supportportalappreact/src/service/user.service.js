import usermanagerapi from "../api/usermanagerapi";

//functions to make api calls
const userService = {
    getUsers: () => {
        return usermanagerapi.get('/user');
    },
    addUser: (user) => {
        return usermanagerapi.post('/user', user);
    },
    updateUser: (user) => {
        return usermanagerapi.put('/user', user);
    },
    resetPassword: (email) => {
        return usermanagerapi.get(`/user/resetpassword/${email}`);
    },

    deleteUser(userName) {
        return usermanagerapi.delete(`/user/${userName}`);
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
