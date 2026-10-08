import api from "../api/axiosConfig";

class SupplierService {

    getAllSuppliers() {
        return api.get("/suppliers");
    }

    getSupplierById(id) {
        return api.get(`/suppliers/${id}`);
    }

    addSupplier(supplier) {
        return api.post("/suppliers", supplier);
    }

    updateSupplier(id, supplier) {
        return api.put(`/suppliers/${id}`, supplier);
    }

    deleteSupplier(id) {
        return api.delete(`/suppliers/${id}`);
    }
}

export default new SupplierService();