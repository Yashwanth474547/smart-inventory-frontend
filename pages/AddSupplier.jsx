import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SupplierService from "../Services/SupplierService";

const AddSupplier = () => {
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState({
        supplierName: "",
        email: "",
        phone: "",
        address: ""
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSupplier((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const saveSupplier = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        setSaving(true);

        try {
            await SupplierService.addSupplier(supplier);

            alert("Supplier Added Successfully!");

            navigate("/suppliers");
        } catch (error) {
            console.error(
                "Add Supplier Error:",
                error
            );

            const status = error.response?.status;

            if (status === 400) {
                alert(
                    error.response?.data?.message ||
                    "Invalid supplier data."
                );
            } else if (status === 401) {
                alert(
                    "Unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to add a supplier."
                );
            } else if (status === 409) {
                alert(
                    "A supplier with this information already exists."
                );
            } else {
                alert(
                    "Unable to add supplier."
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
                    Add Supplier
                </h2>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/suppliers")}
                    disabled={saving}
                >
                    ← Back to Suppliers
                </button>

            </div>

            <form
                onSubmit={saveSupplier}
                style={{ maxWidth: "700px" }}
            >

                <div className="mb-3">

                    <label className="form-label">
                        Supplier Name
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="supplierName"
                        value={supplier.supplierName}
                        onChange={handleChange}
                        required
                        disabled={saving}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Email
                    </label>

                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={supplier.email}
                        onChange={handleChange}
                        required
                        disabled={saving}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Phone
                    </label>

                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={supplier.phone}
                        onChange={handleChange}
                        required
                        disabled={saving}
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Address
                    </label>

                    <textarea
                        className="form-control"
                        rows="3"
                        name="address"
                        value={supplier.address}
                        onChange={handleChange}
                        required
                        disabled={saving}
                    />

                </div>

                <div className="d-flex gap-2">

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Supplier"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/suppliers")}
                        disabled={saving}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AddSupplier;