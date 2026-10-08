import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import InventoryService from "../Services/InventoryService";

const Inventory = () => {

    const navigate = useNavigate();

    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = () => {

        setLoading(true);

        InventoryService.getAllInventories()
            .then((response) => {

                console.log("INVENTORY:", response.data);

                setInventories(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            })
            .catch((error) => {

                console.error(
                    "Error loading inventory:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Session expired or unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to view inventory."
                    );
                } else {
                    alert(
                        "Unable to load inventory."
                    );
                }

                setInventories([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteInventory = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this inventory?"
            )
        ) {
            return;
        }

        InventoryService.deleteInventory(id)
            .then(() => {

                alert(
                    "Inventory Deleted Successfully!"
                );

                loadInventory();
            })
            .catch((error) => {

                console.error(
                    "Delete Inventory Error:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to delete this inventory."
                    );
                } else if (status === 409) {
                    alert(
                        "This inventory cannot be deleted because it is being used elsewhere."
                    );
                } else {
                    alert(
                        "Unable to delete inventory."
                    );
                }
            });
    };

    return (
        <div className="container mt-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Inventory
                    </h2>

                    <p className="text-muted mb-0">
                        Manage product stock across warehouses
                    </p>
                </div>

                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadInventory}
                    >
                        🔄 Refresh
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate("/add-inventory")}
                    >
                        + Add Inventory
                    </button>

                </div>

            </div>

            {/* TOTAL INVENTORY RECORDS */}

            <div
                className="alert alert-info"
                role="alert"
            >
                <strong>
                    Total Inventory Records:
                </strong>{" "}
                {inventories.length}
            </div>

            {/* TABLE */}

            <div className="table-responsive">

                <table className="table table-bordered table-striped table-hover shadow">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Warehouse</th>
                            <th>Quantity</th>
                            <th>Reorder Level</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-4"
                                >
                                    Loading Inventory...
                                </td>
                            </tr>

                        ) : inventories.length > 0 ? (

                            inventories.map((inventory) => (

                                <tr
                                    key={inventory.inventoryId}
                                >

                                    <td>
                                        {inventory.inventoryId}
                                    </td>

                                    <td>
                                        {inventory.product?.productName || "N/A"}
                                    </td>

                                    <td>
                                        {inventory.warehouse?.warehouseName || "N/A"}
                                    </td>

                                    <td>
                                        {inventory.quantity ?? 0}
                                    </td>

                                    <td>
                                        {inventory.reorderLevel ?? 0}
                                    </td>

                                    <td>
                                        {inventory.lastUpdated || "N/A"}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                navigate(
                                                    `/edit-inventory/${inventory.inventoryId}`
                                                )
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteInventory(
                                                    inventory.inventoryId
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-4"
                                >

                                    <div className="text-muted">

                                        <h5>
                                            No Inventory Available
                                        </h5>

                                        <p className="mb-0">
                                            Add inventory using the
                                            <strong>
                                                {" "}+ Add Inventory{" "}
                                            </strong>
                                            button above.
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

export default Inventory;