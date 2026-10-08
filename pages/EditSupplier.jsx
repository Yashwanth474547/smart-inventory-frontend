import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SupplierService from "../Services/SupplierService";

const EditSupplier = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState({
        supplierName: "",
        email: "",
        phone: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSupplier();
    }, [id]);

    const loadSupplier = async () => {
        setLoading(true);

        try {
            const response =
                await SupplierService.getSupplierById(id);

            setSupplier({
                supplierName:
                    response.data?.supplierName ?? "",
                email:
                    response.data?.email ?? "",
                phone:
                    response.data?.phone ?? "",
                address:
                    response.data?.address ?? ""
            });
        } catch (error) {
            console.error(
                "Error loading supplier:",
                error
            );

            const status = error.response?.status;

            if (status === 401) {
                alert(
                    "Session expired or unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to view this supplier."
                );
            } else if (status === 404) {
                alert(
                    "Supplier not found."
                );
            } else {
                alert(
                    "Unable to load supplier."
                );
            }

            navigate("/suppliers");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSupplier((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const updateSupplier = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        setSaving(true);

        try {
            await SupplierService.updateSupplier(
                id,
                supplier
            );

            alert(
                "Supplier Updated Successfully!"
            );

            navigate("/suppliers");
        } catch (error) {
            console.error(
                "Update Supplier Error:",
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
                    "You do not have permission to update this supplier."
                );
            } else if (status === 404) {
                alert(
                    "Supplier not found."
                );
            } else if (status === 409) {
                alert(
                    "A supplier with this information already exists."
                );
            } else {
                alert(
                    "Unable to update supplier."
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
                    Edit Supplier
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

            {loading ? (

                <div
                    className="alert alert-info"
                    style={{ maxWidth: "700px" }}
                >
                    Loading supplier...
                </div>

            ) : (

                <form
                    onSubmit={updateSupplier}
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
                            className="btn btn-warning"
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Supplier"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/suppliers")
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

export default EditSupplier;