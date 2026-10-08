import api from "../api/axiosConfig";

class ProductService {

    getAllProducts() {
        return api.get("/products");
    }

    getProductById(id) {
        return api.get(`/products/${id}`);
    }

    addProduct(product) {
        return api.post("/products", product);
    }

    updateProduct(id, product) {
        return api.put(`/products/${id}`, product);
    }

    deleteProduct(id) {
        return api.delete(`/products/${id}`);
    }

}

export default new ProductService();