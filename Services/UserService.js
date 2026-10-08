import api from "../api/axiosConfig";

class UserService {

    getAllUsers() {
        return api.get("/users");
    }

    getUserById(id) {
        return api.get(`/users/${id}`);
    }

    addUser(user) {
        return api.post("/users/register", user);
    }

    deleteUser(id) {
        return api.delete(`/users/${id}`);
    }

}

export default new UserService();