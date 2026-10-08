import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarehouseService from "../Services/WarehouseService";

const EditWarehouse = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [warehouse, setWarehouse] = useState({
        warehouseName: "",
        location: "",
        city: "",
        state: "",
        capacity: ""
    });

    useEffect(() => {
        WarehouseService.getWarehouseById(id)
            .then((response) => {
                setWarehouse(response.data);
            })
            .catch((error) => {
                console.error("Error loading warehouse:", error);
                alert("Unable to load warehouse.");
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setWarehouse({
            ...warehouse,
            [name]: value
        });
    };

    const updateWarehouse = (e) => {
        e.preventDefault();

        const warehouseData = {
            warehouseName: warehouse.warehouseName,
            location: warehouse.location,
            city: warehouse.city,
            state: warehouse.state,
            capacity: Number(warehouse.capacity)
        };

        WarehouseService.updateWarehouse(id, warehouseData)
            .then(() => {
                alert("Warehouse Updated Successfully!");
                navigate("/warehouses");
            })
            .catch((error) => {
                console.error("Update Warehouse Error:", error);

                const status = error.response?.status;

                if (status === 401) {
                    alert("Unauthorized. Please login again.");
                } else if (status === 403) {
                    alert(
                        "You do not have permission to update this warehouse."
                    );
                } else if (status === 404) {
                    alert("Warehouse not found.");
                } else {
                    alert("Unable to update warehouse.");
                }
            });
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Edit Warehouse</h2>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/warehouses")}
                >
                    ← Back to Warehouses
                </button>
            </div>

            <form
                onSubmit={updateWarehouse}
                style={{ maxWidth: "700px" }}
            >

                <div className="mb-3">
                    <label className="form-label">
                        Warehouse Name
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="warehouseName"
                        value={warehouse.warehouseName || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Location
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={warehouse.location || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        City
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={warehouse.city || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        State
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={warehouse.state || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Capacity
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        name="capacity"
                        value={warehouse.capacity ?? ""}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <div className="d-flex gap-2">

                    <button
                        type="submit"
                        className="btn btn-warning"
                    >
                        Update Warehouse
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/warehouses")}
                    >
                        Cancel
                    </button>

                </div>

            </form>
        </div>
    );
};

export default EditWarehouse;