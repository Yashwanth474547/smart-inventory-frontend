import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WarehouseService from "../Services/WarehouseService";

const Warehouses = () => {

    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWarehouses();
    }, []);

    const loadWarehouses = () => {

        setLoading(true);

        WarehouseService.getAllWarehouses()
            .then((response) => {

                console.log("WAREHOUSES:", response.data);

                setWarehouses(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            })
            .catch((error) => {

                console.error(
                    "Error loading warehouses:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {

                    alert(
                        "Session expired or unauthorized. Please login again."
                    );

                } else if (status === 403) {

                    alert(
                        "You do not have permission to view warehouses."
                    );

                } else {

                    alert(
                        "Unable to load warehouses."
                    );

                }

            })
            .finally(() => {

                setLoading(false);

            });
    };


    const deleteWarehouse = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this warehouse?"
            )
        ) {
            return;
        }

        WarehouseService.deleteWarehouse(id)

            .then(() => {

                alert(
                    "Warehouse Deleted Successfully!"
                );

                loadWarehouses();

            })

            .catch((error) => {

                console.error(
                    "Delete Warehouse Error:",
                    error
                );

                const status =
                    error.response?.status;

                if (status === 409) {

                    alert(
                        "This warehouse cannot be deleted because it is being used by inventory."
                    );

                } else if (status === 401) {

                    alert(
                        "Unauthorized. Please login again."
                    );

                } else if (status === 403) {

                    alert(
                        "You do not have permission to delete this warehouse."
                    );

                } else {

                    alert(
                        "Unable to delete warehouse."
                    );

                }

            });
    };


    return (

        <div className="container mt-4">

            {/* HEADER */}

            <div
                className="d-flex justify-content-between align-items-center mb-4"
            >

                <div>

                    <h2 className="mb-1">
                        Warehouses
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your warehouses and storage locations
                    </p>

                </div>


                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadWarehouses}
                    >
                        🔄 Refresh
                    </button>


                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/add-warehouse")
                        }
                    >
                        + Add Warehouse
                    </button>

                </div>

            </div>


            {/* TOTAL WAREHOUSES */}

            <div
                className="alert alert-info"
                role="alert"
            >

                <strong>
                    Total Warehouses:
                </strong>{" "}

                {warehouses.length}

            </div>


            {/* TABLE */}

            <div className="table-responsive">

                <table
                    className="table table-bordered table-striped table-hover shadow"
                >

                    <thead className="table-dark">

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Warehouse Name
                            </th>

                            <th>
                                Location
                            </th>

                            <th>
                                City
                            </th>

                            <th>
                                State
                            </th>

                            <th>
                                Capacity
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-4"
                                >
                                    Loading Warehouses...
                                </td>

                            </tr>

                        ) : warehouses.length > 0 ? (

                            warehouses.map(
                                (warehouse) => (

                                    <tr
                                        key={
                                            warehouse.warehouseId
                                        }
                                    >

                                        <td>
                                            {
                                                warehouse.warehouseId
                                            }
                                        </td>

                                        <td>
                                            {
                                                warehouse.warehouseName ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {
                                                warehouse.location ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {
                                                warehouse.city ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {
                                                warehouse.state ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {
                                                warehouse.capacity ??
                                                0
                                            }
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-warehouse/${warehouse.warehouseId}`
                                                    )
                                                }
                                            >
                                                ✏️ Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    deleteWarehouse(
                                                        warehouse.warehouseId
                                                    )
                                                }
                                            >
                                                🗑️ Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-4"
                                >

                                    <div className="text-muted">

                                        <h5>
                                            No Warehouses Available
                                        </h5>

                                        <p className="mb-0">
                                            Add your first warehouse using the
                                            <strong> + Add Warehouse </strong>
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

export default Warehouses;