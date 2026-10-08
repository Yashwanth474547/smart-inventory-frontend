import api from "../api/axiosConfig";

class PurchaseOrderService {

    getAllPurchaseOrders() {
        return api.get("/purchaseorders");
    }

    getPurchaseOrderById(id) {
        return api.get(`/purchaseorders/${id}`);
    }

    addPurchaseOrder(order) {
        return api.post("/purchaseorders", order);
    }

    updatePurchaseOrder(id, order) {
        return api.put(`/purchaseorders/${id}`, order);
    }

    deletePurchaseOrder(id) {
        return api.delete(`/purchaseorders/${id}`);
    }
}

export default new PurchaseOrderService();