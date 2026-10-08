import api from "../api/axiosConfig";

class SalesOrderService {

    getAllSalesOrders() {
        return api.get("/salesorders");
    }

    getSalesOrderById(id) {
        return api.get(`/salesorders/${id}`);
    }

    addSalesOrder(order) {
        return api.post("/salesorders", order);
    }

    updateSalesOrder(id, order) {
        return api.put(`/salesorders/${id}`, order);
    }

    deleteSalesOrder(id) {
        return api.delete(`/salesorders/${id}`);
    }
}

export default new SalesOrderService();