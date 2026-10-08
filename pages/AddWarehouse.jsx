import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseService from "../Services/WarehouseService";

const AddWarehouse = () => {
    const navigate = useNavigate();

    const [warehouse, setWarehouse] = useState({
        warehouseName: "",
        location: "",
        city: "",
        state: "",
        capacity: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setWarehouse({
            ...warehouse,
            [name]: value
        });
    };

    const saveWarehouse = (e) => {
        e.preventDefault();

        const warehouseData = {
            warehouseName: warehouse.warehouseName,
            location: warehouse.location,
            city: warehouse.city,
            state: warehouse.state,
            capacity: Number(warehouse.capacity)
        };

        WarehouseService.addWarehouse(warehouseData)
            .then(() => {
                alert("Warehouse Added Successfully!");
                navigate("/warehouses");
            })
            .catch((error) => {
                console.error("Add Warehouse Error:", error);

                const status = error.response?.status;

                if (status === 401) {
                    alert("Unauthorized. Please login again.");
                } else if (status === 403) {
                    alert("You do not have permission to add a warehouse.");
                } else {
                    alert("Unable to add warehouse.");
                }
            });
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Add Warehouse</h2>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/warehouses")}
                >
                    ← Back to Warehouses
                </button>
            </div>

            <form
                onSubmit={saveWarehouse}
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
                        value={warehouse.warehouseName}
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
                        value={warehouse.location}
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
                        value={warehouse.city}
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
                        value={warehouse.state}
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
                        value={warehouse.capacity}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <div className="d-flex gap-2">

                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Save Warehouse
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

export default AddWarehouse;