import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SalesOrderService from "../Services/SalesOrderService";

const SalesOrders = () => {
    const navigate = useNavigate();

    const [salesOrders, setSalesOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSalesOrders();
    }, []);

    const loadSalesOrders = () => {
        setLoading(true);

        SalesOrderService.getAllSalesOrders()
            .then((response) => {
                console.log("SALES ORDERS:", response.data);

                setSalesOrders(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            })
            .catch((error) => {
                console.error(
                    "Error loading Sales Orders:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Session expired or unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to view Sales Orders."
                    );
                } else {
                    alert(
                        "Unable to load Sales Orders."
                    );
                }

                setSalesOrders([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteSalesOrder = (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this Sales Order?"
            )
        ) {
            return;
        }

        SalesOrderService.deleteSalesOrder(id)
            .then(() => {
                alert(
                    "Sales Order Deleted Successfully!"
                );

                loadSalesOrders();
            })
            .catch((error) => {
                console.error(
                    "Delete Sales Order Error:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to delete this Sales Order."
                    );
                } else if (status === 409) {
                    alert(
                        "This Sales Order cannot be deleted because it is being used elsewhere."
                    );
                } else {
                    alert(
                        "Unable to delete Sales Order."
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

            case "CANCELLED":
                return "bg-secondary";

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
                        Sales Orders
                    </h2>

                    <p className="text-muted mb-0">
                        Manage customer sales orders
                    </p>
                </div>

                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadSalesOrders}
                    >
                        🔄 Refresh
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/add-sales-order")
                        }
                    >
                        + Add Sales Order
                    </button>

                </div>

            </div>

            {/* COUNT */}

            <div
                className="alert alert-info"
                role="alert"
            >
                <strong>
                    Total Sales Orders:
                </strong>{" "}
                {salesOrders.length}
            </div>

            {/* TABLE */}

            <div className="table-responsive">

                <table className="table table-bordered table-striped table-hover shadow">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Product</th>
                            <th>Order Date</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan="9"
                                    className="text-center py-4"
                                >
                                    Loading Sales Orders...
                                </td>
                            </tr>

                        ) : salesOrders.length > 0 ? (

                            salesOrders.map((order) => (

                                <tr
                                    key={order.salesOrderId}
                                >

                                    <td>
                                        {order.salesOrderId}
                                    </td>

                                    <td>
                                        {order.customerName || "N/A"}
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

                                        <button
                                            type="button"
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                navigate(
                                                    `/edit-sales-order/${order.salesOrderId}`
                                                )
                                            }
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteSalesOrder(
                                                    order.salesOrderId
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
                                    colSpan="9"
                                    className="text-center py-4"
                                >

                                    <div className="text-muted">

                                        <h5>
                                            No Sales Orders Available
                                        </h5>

                                        <p className="mb-0">
                                            Add your first sales order using the
                                            <strong>
                                                {" "}+ Add Sales Order{" "}
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

export default SalesOrders;