import api from "../api/axiosConfig";

class InventoryService {

    getAllInventories() {
        return api.get("/inventories");
    }

    getInventoryById(id) {
        return api.get(`/inventories/${id}`);
    }

    addInventory(inventory) {
        return api.post("/inventories", inventory);
    }

    updateInventory(id, inventory) {
        return api.put(`/inventories/${id}`, inventory);
    }

    deleteInventory(id) {
        return api.delete(`/inventories/${id}`);
    }

    getLowStockProducts() {
        return api.get("/inventories/low-stock");
    }

}

export default new InventoryService();