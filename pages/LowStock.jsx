import { useEffect, useState } from "react";
import InventoryService from "../Services/InventoryService";

const LowStock = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLowStockProducts();
    }, []);

    const loadLowStockProducts = async () => {
        setLoading(true);

        try {
            const response =
                await InventoryService.getLowStockProducts();

            console.log(
                "LOW STOCK:",
                response.data
            );

            setProducts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Error loading low stock:",
                error
            );

            const status = error.response?.status;

            if (status === 401) {
                alert(
                    "Session expired or unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to view low stock."
                );
            } else {
                alert(
                    "Unable to load low stock products."
                );
            }

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1 text-danger">
                        Low Stock
                    </h2>

                    <p className="text-muted mb-0">
                        Products that have reached or fallen below their reorder level
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={loadLowStockProducts}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* COUNT */}

            <div
                className="alert alert-danger"
                role="alert"
            >
                <strong>
                    Low Stock Items:
                </strong>{" "}
                {products.length}
            </div>

            {/* TABLE */}

            <div className="table-responsive">

                <table className="table table-bordered table-hover shadow">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Warehouse</th>
                            <th>Quantity</th>
                            <th>Reorder Level</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-4"
                                >
                                    Loading Low Stock Items...
                                </td>
                            </tr>

                        ) : products.length > 0 ? (

                            products.map((item) => (

                                <tr
                                    key={item.inventoryId}
                                >

                                    <td>
                                        {item.inventoryId}
                                    </td>

                                    <td>
                                        {item.product?.productName || "N/A"}
                                    </td>

                                    <td>
                                        {item.warehouse?.warehouseName || "N/A"}
                                    </td>

                                    <td>
                                        {item.quantity ?? 0}
                                    </td>

                                    <td>
                                        {item.reorderLevel ?? 0}
                                    </td>

                                    <td>
                                        <span className="badge bg-danger">
                                            Low Stock
                                        </span>
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-4"
                                >

                                    <div className="text-success">

                                        <h5>
                                            No Low Stock Items
                                        </h5>

                                        <p className="text-muted mb-0">
                                            All inventory levels are currently above their reorder levels.
                                        </p>

                                    </div>

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default LowStock;