import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PurchaseOrderService from "../Services/PurchaseOrderService";
import SupplierService from "../Services/SupplierService";
import ProductService from "../Services/ProductService";

const EditPurchaseOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [purchaseOrder, setPurchaseOrder] = useState({
        supplierId: "",
        productId: "",
        orderDate: "",
        quantity: "",
        unitPrice: "",
        totalAmount: "",
        status: "",
        expectedDeliveryDate: ""
    });

    useEffect(() => {
        loadPurchaseOrderData();
    }, [id]);

    const loadPurchaseOrderData = async () => {
        setLoading(true);

        try {
            const [
                supplierResponse,
                productResponse,
                orderResponse
            ] = await Promise.all([
                SupplierService.getAllSuppliers(),
                ProductService.getAllProducts(),
                PurchaseOrderService.getPurchaseOrderById(id)
            ]);

            setSuppliers(
                Array.isArray(supplierResponse.data)
                    ? supplierResponse.data
                    : []
            );

            setProducts(
                Array.isArray(productResponse.data)
                    ? productResponse.data
                    : []
            );

            const order = orderResponse.data;

            setPurchaseOrder({
                supplierId:
                    order?.supplier?.supplierId ?? "",
                productId:
                    order?.product?.productId ?? "",
                orderDate:
                    order?.orderDate ?? "",
                quantity:
                    order?.quantity ?? "",
                unitPrice:
                    order?.unitPrice ?? "",
                totalAmount:
                    order?.totalAmount ?? "",
                status:
                    order?.status ?? "Pending",
                expectedDeliveryDate:
                    order?.expectedDeliveryDate ?? ""
            });

        } catch (error) {
            console.error(
                "Error loading purchase order:",
                error
            );

            const status = error.response?.status;

            if (status === 401) {
                alert(
                    "Session expired or unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to view this Purchase Order."
                );
            } else if (status === 404) {
                alert(
                    "Purchase Order not found."
                );
            } else {
                alert(
                    "Unable to load Purchase Order."
                );
            }

            navigate("/purchase-orders");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setPurchaseOrder((previous) => {
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

    const updatePurchaseOrder = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        if (!purchaseOrder.supplierId) {
            alert("Please select a supplier.");
            return;
        }

        if (!purchaseOrder.productId) {
            alert("Please select a product.");
            return;
        }

        if (!purchaseOrder.orderDate) {
            alert("Please select the order date.");
            return;
        }

        if (
            purchaseOrder.quantity === "" ||
            Number(purchaseOrder.quantity) <= 0
        ) {
            alert("Quantity must be greater than 0.");
            return;
        }

        if (
            purchaseOrder.unitPrice === "" ||
            Number(purchaseOrder.unitPrice) < 0
        ) {
            alert("Please enter a valid unit price.");
            return;
        }

        if (!purchaseOrder.expectedDeliveryDate) {
            alert(
                "Please select the expected delivery date."
            );
            return;
        }

        const orderData = {
            supplier: {
                supplierId: Number(
                    purchaseOrder.supplierId
                )
            },

            product: {
                productId: Number(
                    purchaseOrder.productId
                )
            },

            orderDate:
                purchaseOrder.orderDate,

            quantity:
                Number(purchaseOrder.quantity),

            unitPrice:
                Number(purchaseOrder.unitPrice),

            totalAmount:
                Number(purchaseOrder.totalAmount),

            status:
                purchaseOrder.status,

            expectedDeliveryDate:
                purchaseOrder.expectedDeliveryDate
        };

        console.log(
            "UPDATED PURCHASE ORDER DATA:",
            orderData
        );

        setSaving(true);

        try {
            await PurchaseOrderService.updatePurchaseOrder(
                id,
                orderData
            );

            alert(
                "Purchase Order Updated Successfully!"
            );

            navigate("/purchase-orders");

        } catch (error) {
            console.error(
                "Update Purchase Order Error:",
                error
            );

            const status = error.response?.status;

            if (status === 400) {
                alert(
                    error.response?.data?.message ||
                    "Invalid Purchase Order data."
                );
            } else if (status === 401) {
                alert(
                    "Unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to update this Purchase Order."
                );
            } else if (status === 404) {
                alert(
                    "Purchase Order, supplier, or product not found."
                );
            } else {
                alert(
                    "Unable to update Purchase Order."
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
                    Edit Purchase Order
                </h2>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate("/purchase-orders")
                    }
                    disabled={saving}
                >
                    ← Back to Purchase Orders
                </button>

            </div>

            {loading ? (

                <div
                    className="alert alert-info"
                    style={{ maxWidth: "700px" }}
                >
                    Loading Purchase Order...
                </div>

            ) : (

                <form
                    onSubmit={updatePurchaseOrder}
                    style={{ maxWidth: "700px" }}
                >

                    {/* Supplier */}

                    <div className="mb-3">

                        <label className="form-label">
                            Supplier
                        </label>

                        <select
                            className="form-select"
                            name="supplierId"
                            value={purchaseOrder.supplierId}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        >

                            <option value="">
                                Select Supplier
                            </option>

                            {suppliers.map((supplier) => (

                                <option
                                    key={supplier.supplierId}
                                    value={supplier.supplierId}
                                >
                                    {supplier.supplierName}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* Product */}

                    <div className="mb-3">

                        <label className="form-label">
                            Product
                        </label>

                        <select
                            className="form-select"
                            name="productId"
                            value={purchaseOrder.productId}
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

                    {/* Order Date */}

                    <div className="mb-3">

                        <label className="form-label">
                            Order Date
                        </label>

                        <input
                            type="date"
                            className="form-control"
                            name="orderDate"
                            value={purchaseOrder.orderDate}
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
                            value={purchaseOrder.quantity}
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
                            value={purchaseOrder.unitPrice}
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
                            value={purchaseOrder.totalAmount}
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
                            value={purchaseOrder.status}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        >

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Ordered">
                                Ordered
                            </option>

                            <option value="Delivered">
                                Delivered
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>

                    {/* Expected Delivery Date */}

                    <div className="mb-3">

                        <label className="form-label">
                            Expected Delivery Date
                        </label>

                        <input
                            type="date"
                            className="form-control"
                            name="expectedDeliveryDate"
                            value={
                                purchaseOrder.expectedDeliveryDate
                            }
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />

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
                                : "Update Purchase Order"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/purchase-orders"
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

export default EditPurchaseOrder;