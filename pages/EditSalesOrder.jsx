import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SalesOrderService from "../Services/SalesOrderService";
import ProductService from "../Services/ProductService";

const EditSalesOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [salesOrder, setSalesOrder] = useState({
        productId: "",
        quantity: "",
        unitPrice: "",
        totalAmount: "",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerAddress: "",
        orderDate: "",
        status: "Pending"
    });

    useEffect(() => {
        loadSalesOrderData();
    }, [id]);

    const loadSalesOrderData = async () => {
        setLoading(true);

        try {
            const [
                productResponse,
                orderResponse
            ] = await Promise.all([
                ProductService.getAllProducts(),
                SalesOrderService.getSalesOrderById(id)
            ]);

            setProducts(
                Array.isArray(productResponse.data)
                    ? productResponse.data
                    : []
            );

            const order = orderResponse.data;

            setSalesOrder({
                productId:
                    order?.product?.productId ?? "",
                quantity:
                    order?.quantity ?? "",
                unitPrice:
                    order?.unitPrice ?? "",
                totalAmount:
                    order?.totalAmount ?? "",
                customerName:
                    order?.customerName ?? "",
                customerPhone:
                    order?.customerPhone ?? "",
                customerEmail:
                    order?.customerEmail ?? "",
                customerAddress:
                    order?.customerAddress ?? "",
                orderDate:
                    order?.orderDate ?? "",
                status:
                    order?.status ?? "Pending"
            });

        } catch (error) {
            console.error(
                "Error loading Sales Order:",
                error
            );

            const status = error.response?.status;

            if (status === 401) {
                alert(
                    "Session expired or unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to view this Sales Order."
                );
            } else if (status === 404) {
                alert(
                    "Sales Order not found."
                );
            } else {
                alert(
                    "Unable to load Sales Order."
                );
            }

            navigate("/sales-orders");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSalesOrder((previous) => {
            const updatedOrder = {
                ...previous,
                [name]: value
            };

            if (
                name === "quantity" ||
                name === "unitPrice"
            ) {
                if (
                    updatedOrder.quantity !== "" &&
                    updatedOrder.unitPrice !== ""
                ) {
                    updatedOrder.totalAmount =
                        Number(updatedOrder.quantity) *
                        Number(updatedOrder.unitPrice);
                } else {
                    updatedOrder.totalAmount = "";
                }
            }

            return updatedOrder;
        });
    };

    const updateSalesOrder = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        if (!salesOrder.productId) {
            alert("Please select a product.");
            return;
        }

        if (!salesOrder.customerName.trim()) {
            alert("Please enter customer name.");
            return;
        }

        if (!salesOrder.customerPhone.trim()) {
            alert("Please enter customer phone.");
            return;
        }

        if (!salesOrder.customerEmail.trim()) {
            alert("Please enter customer email.");
            return;
        }

        if (!salesOrder.customerAddress.trim()) {
            alert("Please enter customer address.");
            return;
        }

        if (!salesOrder.orderDate) {
            alert("Please select the order date.");
            return;
        }

        if (
            salesOrder.quantity === "" ||
            Number(salesOrder.quantity) <= 0
        ) {
            alert("Quantity must be greater than 0.");
            return;
        }

        if (
            salesOrder.unitPrice === "" ||
            Number(salesOrder.unitPrice) < 0
        ) {
            alert("Please enter a valid unit price.");
            return;
        }

        const orderData = {
            product: {
                productId: Number(
                    salesOrder.productId
                )
            },

            quantity: Number(
                salesOrder.quantity
            ),

            unitPrice: Number(
                salesOrder.unitPrice
            ),

            totalAmount: Number(
                salesOrder.totalAmount
            ),

            customerName:
                salesOrder.customerName.trim(),

            customerPhone:
                salesOrder.customerPhone.trim(),

            customerEmail:
                salesOrder.customerEmail.trim(),

            customerAddress:
                salesOrder.customerAddress.trim(),

            orderDate:
                salesOrder.orderDate,

            status:
                salesOrder.status
        };

        console.log(
            "UPDATED SALES ORDER DATA:",
            orderData
        );

        setSaving(true);

        try {
            await SalesOrderService.updateSalesOrder(
                id,
                orderData
            );

            alert(
                "Sales Order Updated Successfully!"
            );

            navigate("/sales-orders");

        } catch (error) {
            console.error(
                "Update Sales Order Error:",
                error
            );

            const status = error.response?.status;

            if (status === 400) {
                alert(
                    error.response?.data?.message ||
                    "Invalid Sales Order data."
                );
            } else if (status === 401) {
                alert(
                    "Unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to update this Sales Order."
                );
            } else if (status === 404) {
                alert(
                    "Sales Order or product not found."
                );
            } else if (status === 409) {
                alert(
                    "Insufficient stock or Sales Order cannot be updated."
                );
            } else {
                alert(
                    "Unable to update Sales Order."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Edit Sales Order
                </h2>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate("/sales-orders")
                    }
                    disabled={saving}
                >
                    ← Back to Sales Orders
                </button>

            </div>

            {loading ? (

                <div
                    className="alert alert-info"
                    style={{ maxWidth: "700px" }}
                >
                    Loading Sales Order...
                </div>

            ) : (

                <form
                    onSubmit={updateSalesOrder}
                    style={{ maxWidth: "700px" }}
                >

                    {/* Product */}

                    <div className="mb-3">

                        <label className="form-label">
                            Product
                        </label>

                        <select
                            className="form-select"
                            name="productId"
                            value={salesOrder.productId}
                            onChange={handleChange}
                            required
                            disabled={saving}
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

                    </div>

                    {/* Customer Name */}

                    <div className="mb-3">

                        <label className="form-label">
                            Customer Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="customerName"
                            value={salesOrder.customerName}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />

                    </div>

                    {/* Customer Phone */}

                    <div className="mb-3">

                        <label className="form-label">
                            Customer Phone
                        </label>

                        <input
                            type="tel"
                            className="form-control"
                            name="customerPhone"
                            value={salesOrder.customerPhone}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />

                    </div>

                    {/* Customer Email */}

                    <div className="mb-3">

                        <label className="form-label">
                            Customer Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            name="customerEmail"
                            value={salesOrder.customerEmail}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />

                    </div>

                    {/* Customer Address */}

                    <div className="mb-3">

                        <label className="form-label">
                            Customer Address
                        </label>

                        <textarea
                            className="form-control"
                            name="customerAddress"
                            value={salesOrder.customerAddress}
                            onChange={handleChange}
                            rows="3"
                            required
                            disabled={saving}
                        />

                    </div>

                    {/* Order Date */}

                    <div className="mb-3">

                        <label className="form-label">
                            Order Date
                        </label>

                        <input
                            type="date"
                            className="form-control"
                            name="orderDate"
                            value={salesOrder.orderDate}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />

                    </div>

                    {/* Quantity */}

                    <div className="mb-3">

                        <label className="form-label">
                            Quantity
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={salesOrder.quantity}
                            onChange={handleChange}
                            min="1"
                            required
                            disabled={saving}
                        />

                    </div>

                    {/* Unit Price */}

                    <div className="mb-3">

                        <label className="form-label">
                            Unit Price
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="unitPrice"
                            value={salesOrder.unitPrice}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            disabled={saving}
                        />

                    </div>

                    {/* Total Amount */}

                    <div className="mb-3">

                        <label className="form-label">
                            Total Amount
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            value={salesOrder.totalAmount}
                            readOnly
                        />

                    </div>

                    {/* Status */}

                    <div className="mb-3">

                        <label className="form-label">
                            Status
                        </label>

                        <select
                            className="form-select"
                            name="status"
                            value={salesOrder.status}
                            onChange={handleChange}
                            disabled={saving}
                        >

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Processing">
                                Processing
                            </option>

                            <option value="Delivered">
                                Delivered
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>

                    {/* BUTTONS */}

                    <div className="d-flex gap-2">

                        <button
                            type="submit"
                            className="btn btn-warning"
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Sales Order"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/sales-orders"
                                )
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

export default EditSalesOrder;