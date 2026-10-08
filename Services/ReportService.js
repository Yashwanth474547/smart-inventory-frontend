import api from "../api/axiosConfig";

class ReportService {

    getSummaryReport() {
        return api.get("/reports/summary");
    }

}

export default new ReportService();