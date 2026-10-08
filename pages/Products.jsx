import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductService from "../Services/ProductService";

const Products = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {

        setLoading(true);

        ProductService.getAllProducts()
            .then((response) => {

                console.log("PRODUCTS:", response.data);

                setProducts(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            })
            .catch((error) => {

                console.error(
                    "Error loading products:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {

                    alert(
                        "Session expired or unauthorized. Please login again."
                    );

                } else if (status === 403) {

                    alert(
                        "You do not have permission to view products."
                    );

                } else {

                    alert(
                        "Unable to load products."
                    );

                }

            })
            .finally(() => {

                setLoading(false);

            });
    };


    const deleteProduct = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this product?"
            )
        ) {
            return;
        }

        ProductService.deleteProduct(id)

            .then(() => {

                alert(
                    "Product Deleted Successfully"
                );

                loadProducts();

            })

            .catch((error) => {

                console.error(
                    "Delete Product Error:",
                    error
                );

                const status =
                    error.response?.status;

                if (status === 401) {

                    alert(
                        "Unauthorized. Please login again."
                    );

                } else if (status === 403) {

                    alert(
                        "You do not have permission to delete this product."
                    );

                } else if (status === 409) {

                    alert(
                        "This product cannot be deleted because it is being used elsewhere."
                    );

                } else {

                    alert(
                        "Unable to delete product."
                    );

                }

            });
    };


    return (

        <div className="container mt-4">

            {/* Page Header */}

            <div
                className="d-flex justify-content-between align-items-center mb-4"
            >

                <div>

                    <h2 className="mb-1">
                        Products
                    </h2>

                    <p className="text-muted mb-0">
                        Manage your products and product information
                    </p>

                </div>


                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadProducts}
                    >
                        🔄 Refresh
                    </button>


                    {/* ONLY ADD PRODUCT BUTTON */}

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/add-product")
                        }
                    >
                        + Add Product
                    </button>

                </div>

            </div>


            {/* Total Products */}

            <div
                className="alert alert-info"
                role="alert"
            >

                <strong>
                    Total Products:
                </strong>{" "}

                {products.length}

            </div>


            {/* Products Table */}

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
                                Product Name
                            </th>

                            <th>
                                Category
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Quantity
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
                                    colSpan="6"
                                    className="text-center py-4"
                                >
                                    Loading Products...
                                </td>

                            </tr>

                        ) : products.length > 0 ? (

                            products.map(
                                (product) => (

                                    <tr
                                        key={
                                            product.productId
                                        }
                                    >

                                        <td>
                                            {
                                                product.productId
                                            }
                                        </td>


                                        <td>
                                            {
                                                product.productName ||
                                                "N/A"
                                            }
                                        </td>


                                        <td>
                                            {
                                                product.category ||
                                                "N/A"
                                            }
                                        </td>


                                        <td>
                                            ₹{" "}
                                            {Number(
                                                product.price ?? 0
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            )}
                                        </td>


                                        <td>
                                            {
                                                product.quantity ??
                                                0
                                            }
                                        </td>


                                        <td>

                                            <button
                                                type="button"
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-product/${product.productId}`
                                                    )
                                                }
                                            >
                                                ✏️ Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    deleteProduct(
                                                        product.productId
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
                                    colSpan="6"
                                    className="text-center py-4"
                                >

                                    <div className="text-muted">

                                        <h5>
                                            No Products Available
                                        </h5>

                                        <p className="mb-0">
                                            Add your first product using the
                                            <strong> + Add Product </strong>
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

export default Products;