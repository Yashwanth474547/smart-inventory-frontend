import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PurchaseOrderService from "../Services/PurchaseOrderService";

const PurchaseOrders = () => {
    const navigate = useNavigate();

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPurchaseOrders();
    }, []);

    const loadPurchaseOrders = () => {
        setLoading(true);

        PurchaseOrderService.getAllPurchaseOrders()
            .then((response) => {
                console.log("PURCHASE ORDERS:", response.data);

                setPurchaseOrders(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            })
            .catch((error) => {
                console.error(
                    "Error loading purchase orders:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Session expired or unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to view purchase orders."
                    );
                } else {
                    alert(
                        "Unable to load purchase orders."
                    );
                }

                setPurchaseOrders([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deletePurchaseOrder = (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this Purchase Order?"
            )
        ) {
            return;
        }

        PurchaseOrderService.deletePurchaseOrder(id)
            .then(() => {
                alert(
                    "Purchase Order Deleted Successfully!"
                );

                loadPurchaseOrders();
            })
            .catch((error) => {
                console.error(
                    "Delete Purchase Order Error:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to delete this Purchase Order."
                    );
                } else if (status === 409) {
                    alert(
                        "This Purchase Order cannot be deleted because it is being used elsewhere."
                    );
                } else {
                    alert(
                        "Unable to delete Purchase Order."
                    );
                }
            });
    };

    const formatAmount = (amount) => {
        return Number(amount ?? 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case "APPROVED":
                return "bg-success";

            case "PENDING":
                return "bg-warning text-dark";

            case "REJECTED":
                return "bg-danger";

            case "COMPLETED":
                return "bg-primary";

            default:
                return "bg-secondary";
        }
    };

    return (
        <div className="container mt-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Purchase Orders
                    </h2>

                    <p className="text-muted mb-0">
                        Manage supplier purchase orders
                    </p>
                </div>

                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadPurchaseOrders}
                    >
                        🔄 Refresh
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/add-purchase-order")
                        }
                    >
                        + Add Purchase Order
                    </button>

                </div>

            </div>

            {/* COUNT */}

            <div
                className="alert alert-info"
                role="alert"
            >
                <strong>
                    Total Purchase Orders:
                </strong>{" "}
                {purchaseOrders.length}
            </div>

            {/* TABLE */}

            <div className="table-responsive">

                <table className="table table-bordered table-striped table-hover shadow">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Supplier</th>
                            <th>Product</th>
                            <th>Order Date</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Expected Delivery</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan="10"
                                    className="text-center py-4"
                                >
                                    Loading Purchase Orders...
                                </td>
                            </tr>

                        ) : purchaseOrders.length > 0 ? (

                            purchaseOrders.map((order) => (

                                <tr
                                    key={order.purchaseOrderId}
                                >

                                    <td>
                                        {order.purchaseOrderId}
                                    </td>

                                    <td>
                                        {order.supplier?.supplierName ||
                                            "N/A"}
                                    </td>

                                    <td>
                                        {order.product?.productName ||
                                            "N/A"}
                                    </td>

                                    <td>
                                        {order.orderDate || "N/A"}
                                    </td>

                                    <td>
                                        {order.quantity ?? 0}
                                    </td>

                                    <td>
                                        ₹{" "}
                                        {formatAmount(
                                            order.unitPrice
                                        )}
                                    </td>

                                    <td>
                                        ₹{" "}
                                        {formatAmount(
                                            order.totalAmount
                                        )}
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {order.status ||
                                                "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        {order.expectedDeliveryDate ||
                                            "N/A"}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                navigate(
                                                    `/edit-purchase-order/${order.purchaseOrderId}`
                                                )
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deletePurchaseOrder(
                                                    order.purchaseOrderId
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
                                    colSpan="10"
                                    className="text-center py-4"
                                >

                                    <div className="text-muted">

                                        <h5>
                                            No Purchase Orders Available
                                        </h5>

                                        <p className="mb-0">
                                            Add your first purchase order using the
                                            <strong>
                                                {" "}+ Add Purchase Order{" "}
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

export default PurchaseOrders;