import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import InventoryService from "../Services/InventoryService";
import ProductService from "../Services/ProductService";
import WarehouseService from "../Services/WarehouseService";

const AddInventory = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [inventory, setInventory] = useState({
        productId: "",
        warehouseId: "",
        quantity: "",
        reorderLevel: "",
        lastUpdated: ""
    });

    useEffect(() => {
        loadProductsAndWarehouses();
    }, []);

    const loadProductsAndWarehouses = async () => {
        setLoading(true);

        try {
            const [productResponse, warehouseResponse] =
                await Promise.all([
                    ProductService.getAllProducts(),
                    WarehouseService.getAllWarehouses()
                ]);

            setProducts(
                Array.isArray(productResponse.data)
                    ? productResponse.data
                    : []
            );

            setWarehouses(
                Array.isArray(warehouseResponse.data)
                    ? warehouseResponse.data
                    : []
            );
        } catch (error) {
            console.error(
                "Error loading products/warehouses:",
                error
            );

            const status = error.response?.status;

            if (status === 401) {
                alert(
                    "Session expired or unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to load products or warehouses."
                );
            } else {
                alert(
                    "Unable to load products or warehouses."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setInventory((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const saveInventory = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        if (!inventory.productId) {
            alert("Please select a product.");
            return;
        }

        if (!inventory.warehouseId) {
            alert("Please select a warehouse.");
            return;
        }

        if (
            inventory.quantity === "" ||
            Number(inventory.quantity) < 0
        ) {
            alert("Please enter a valid quantity.");
            return;
        }

        if (
            inventory.reorderLevel === "" ||
            Number(inventory.reorderLevel) < 0
        ) {
            alert("Please enter a valid reorder level.");
            return;
        }

        if (!inventory.lastUpdated) {
            alert("Please select the last updated date.");
            return;
        }

        const inventoryData = {
            product: {
                productId: Number(inventory.productId)
            },
            warehouse: {
                warehouseId: Number(inventory.warehouseId)
            },
            quantity: Number(inventory.quantity),
            reorderLevel: Number(inventory.reorderLevel),
            lastUpdated: inventory.lastUpdated
        };

        console.log(
            "INVENTORY DATA:",
            inventoryData
        );

        setSaving(true);

        try {
            await InventoryService.addInventory(
                inventoryData
            );

            alert(
                "Inventory Added Successfully!"
            );

            navigate("/inventory");
        } catch (error) {
            console.error(
                "Add Inventory Error:",
                error
            );

            const status = error.response?.status;

            if (status === 400) {
                alert(
                    error.response?.data?.message ||
                    "Invalid inventory data."
                );
            } else if (status === 401) {
                alert(
                    "Unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to add inventory."
                );
            } else if (status === 404) {
                alert(
                    "Product or warehouse not found."
                );
            } else {
                alert(
                    "Unable to save inventory."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mt-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Add Inventory
                </h2>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/inventory")}
                >
                    ← Back to Inventory
                </button>

            </div>

            {/* LOADING */}

            {loading ? (

                <div
                    className="alert alert-info"
                    style={{ maxWidth: "700px" }}
                >
                    Loading products and warehouses...
                </div>

            ) : (

                <form
                    onSubmit={saveInventory}
                    style={{ maxWidth: "700px" }}
                >

                    {/* PRODUCT */}

                    <div className="mb-3">

                        <label className="form-label">
                            Product
                        </label>

                        <select
                            className="form-select"
                            name="productId"
                            value={inventory.productId}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Product
                            </option>

                            {products.map((product) => (

                                <option
                                    key={product.productId}
                                    value={product.productId}
                                >
                                    {product.productName}
                                </option>

                            ))}

                        </select>

                        {products.length === 0 && (
                            <div className="form-text text-danger">
                                No products available.
                            </div>
                        )}

                    </div>

                    {/* WAREHOUSE */}

                    <div className="mb-3">

                        <label className="form-label">
                            Warehouse
                        </label>

                        <select
                            className="form-select"
                            name="warehouseId"
                            value={inventory.warehouseId}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Warehouse
                            </option>

                            {warehouses.map((warehouse) => (

                                <option
                                    key={warehouse.warehouseId}
                                    value={warehouse.warehouseId}
                                >
                                    {warehouse.warehouseName}
                                </option>

                            ))}

                        </select>

                        {warehouses.length === 0 && (
                            <div className="form-text text-danger">
                                No warehouses available. Please create a warehouse first.
                            </div>
                        )}

                    </div>

                    {/* QUANTITY */}

                    <div className="mb-3">

                        <label className="form-label">
                            Quantity
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={inventory.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />

                    </div>

                    {/* REORDER LEVEL */}

                    <div className="mb-3">

                        <label className="form-label">
                            Reorder Level
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="reorderLevel"
                            value={inventory.reorderLevel}
                            onChange={handleChange}
                            min="0"
                            required
                        />

                    </div>

                    {/* LAST UPDATED */}

                    <div className="mb-3">

                        <label className="form-label">
                            Last Updated
                        </label>

                        <input
                            type="date"
                            className="form-control"
                            name="lastUpdated"
                            value={inventory.lastUpdated}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* BUTTONS */}

                    <div className="d-flex gap-2">

                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Inventory"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/inventory")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            )}

        </div>
    );
};

export default AddInventory;