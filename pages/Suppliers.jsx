import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SupplierService from "../Services/SupplierService";

const Suppliers = () => {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = () => {
        setLoading(true);

        SupplierService.getAllSuppliers()
            .then((response) => {
                console.log("SUPPLIERS:", response.data);

                setSuppliers(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            })
            .catch((error) => {
                console.error(
                    "Error loading suppliers:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Session expired or unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to view suppliers."
                    );
                } else {
                    alert(
                        "Unable to load suppliers."
                    );
                }

                setSuppliers([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteSupplier = (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this supplier?"
            )
        ) {
            return;
        }

        SupplierService.deleteSupplier(id)
            .then(() => {
                alert(
                    "Supplier Deleted Successfully!"
                );

                loadSuppliers();
            })
            .catch((error) => {
                console.error(
                    "Delete Supplier Error:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to delete this supplier."
                    );
                } else if (status === 409) {
                    alert(
                        "This supplier cannot be deleted because it is being used by a purchase order."
                    );
                } else {
                    alert(
                        "Unable to delete supplier."
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
                        Suppliers
                    </h2>

                    <p className="text-muted mb-0">
                        Manage suppliers and supplier information
                    </p>
                </div>

                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadSuppliers}
                    >
                        🔄 Refresh
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/add-supplier")
                        }
                    >
                        + Add Supplier
                    </button>

                </div>

            </div>

            {/* COUNT */}

            <div
                className="alert alert-info"
                role="alert"
            >
                <strong>
                    Total Suppliers:
                </strong>{" "}
                {suppliers.length}
            </div>

            {/* TABLE */}

            <div className="table-responsive">

                <table className="table table-bordered table-striped table-hover shadow">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Supplier Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-4"
                                >
                                    Loading Suppliers...
                                </td>
                            </tr>

                        ) : suppliers.length > 0 ? (

                            suppliers.map((supplier) => (

                                <tr
                                    key={supplier.supplierId}
                                >

                                    <td>
                                        {supplier.supplierId}
                                    </td>

                                    <td>
                                        {supplier.supplierName || "N/A"}
                                    </td>

                                    <td>
                                        {supplier.email || "N/A"}
                                    </td>

                                    <td>
                                        {supplier.phone || "N/A"}
                                    </td>

                                    <td>
                                        {supplier.address || "N/A"}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                navigate(
                                                    `/edit-supplier/${supplier.supplierId}`
                                                )
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteSupplier(
                                                    supplier.supplierId
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
                                    colSpan="6"
                                    className="text-center py-4"
                                >

                                    <div className="text-muted">

                                        <h5>
                                            No Suppliers Available
                                        </h5>

                                        <p className="mb-0">
                                            Add your first supplier using the
                                            <strong>
                                                {" "}+ Add Supplier{" "}
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

export default Suppliers;