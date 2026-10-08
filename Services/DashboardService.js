import api from "../api/axiosConfig";

class DashboardService {

    getDashboardData() {
        return api.get("/dashboard");
    }

}

export default new DashboardService();