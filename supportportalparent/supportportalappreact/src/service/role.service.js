import usermanagerapi from "../api/usermanagerapi";

const roleService = {
    loadRoles: () => {
        usermanagerapi.get('/role')
            .then(response => {
                localStorage.setItem('roles', JSON.stringify(response.data));
            })
    },
    getRoles: () => {
        let roles = localStorage.getItem("roles")
        return roles ? JSON.parse(roles) : [];
    },
};
export default roleService;
