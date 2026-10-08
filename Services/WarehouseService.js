import api from "../api/axiosConfig";

class WarehouseService {

    getAllWarehouses() {
        return api.get("/warehouses");
    }

    getWarehouseById(id) {
        return api.get(`/warehouses/${id}`);
    }

    addWarehouse(warehouse) {
        return api.post("/warehouses", warehouse);
    }

    updateWarehouse(id, warehouse) {
        return api.put(`/warehouses/${id}`, warehouse);
    }

    deleteWarehouse(id) {
        return api.delete(`/warehouses/${id}`);
    }

}

export default new WarehouseService();