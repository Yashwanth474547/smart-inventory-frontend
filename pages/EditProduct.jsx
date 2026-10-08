import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../Services/ProductService";

const EditProduct = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState({
        productName: "",
        category: "",
        price: "",
        quantity: ""
    });

    useEffect(() => {

        ProductService.getProductById(id)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {

                console.error(
                    "Error loading product:",
                    error
                );

                alert("Unable to load product.");

            });

    }, [id]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProduct({
            ...product,
            [name]: value
        });

    };

    const updateProduct = (e) => {

        e.preventDefault();

        ProductService.updateProduct(id, product)
            .then(() => {

                alert(
                    "Product Updated Successfully!"
                );

                navigate("/products");

            })
            .catch((error) => {

                console.error(
                    "Update Product Error:",
                    error
                );

                alert(
                    "Unable to update product."
                );

            });

    };

    return (

        <div className="container mt-4">

            {/* HEADER */}
            <div
                className="d-flex justify-content-between align-items-center mb-4"
            >

                <h2 className="mb-0">
                    Edit Product
                </h2>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/products")}
                >
                    ← Back to Products
                </button>

            </div>


            {/* FORM */}
            <form
                onSubmit={updateProduct}
                style={{ maxWidth: "700px" }}
            >

                {/* PRODUCT NAME */}
                <div className="mb-3">

                    <label className="form-label">
                        Product Name
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="productName"
                        value={product.productName || ""}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* CATEGORY */}
                <div className="mb-3">

                    <label className="form-label">
                        Category
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={product.category || ""}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* PRICE */}
                <div className="mb-3">

                    <label className="form-label">
                        Price
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={product.price ?? ""}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />

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
                        value={product.quantity ?? ""}
                        onChange={handleChange}
                        min="0"
                        required
                    />

                </div>


                {/* BUTTONS */}
                <div className="d-flex gap-2">

                    <button
                        type="submit"
                        className="btn btn-warning"
                    >
                        Update Product
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/products")}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    );

};

export default EditProduct;