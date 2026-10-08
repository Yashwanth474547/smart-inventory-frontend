import { useEffect, useState } from "react";
import UserService from "../Services/UserService";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [newUser, setNewUser] = useState({
        fullName: "",
        username: "",
        email: "",
        mobileNumber: "",
        password: "",
        role: "EMPLOYEE"
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);

        try {
            const response = await UserService.getAllUsers();

            console.log("USERS:", response.data);

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {
            console.error("Error loading users:", error);

            const status = error.response?.status;

            if (status === 401) {
                alert(
                    "Session expired or unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to manage users."
                );
            } else {
                alert("Unable to load users.");
            }

            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewUser((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const addUser = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        if (!newUser.fullName.trim()) {
            alert("Please enter full name.");
            return;
        }

        if (!newUser.username.trim()) {
            alert("Please enter username.");
            return;
        }

        if (!newUser.email.trim()) {
            alert("Please enter email address.");
            return;
        }

        if (!newUser.mobileNumber.trim()) {
            alert("Please enter mobile number.");
            return;
        }

        if (!/^\d{10}$/.test(newUser.mobileNumber.trim())) {
            alert("Mobile number must contain exactly 10 digits.");
            return;
        }

        if (!newUser.password) {
            alert("Please enter password.");
            return;
        }

        if (newUser.password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (!newUser.role) {
            alert("Please select a role.");
            return;
        }

        const userData = {
            fullName: newUser.fullName.trim(),
            username: newUser.username.trim(),
            email: newUser.email.trim().toLowerCase(),
            mobileNumber: newUser.mobileNumber.trim(),
            password: newUser.password,
            role: newUser.role
        };

        setSaving(true);

        try {
            await UserService.addUser(userData);

            alert("User Created Successfully!");

            setNewUser({
                fullName: "",
                username: "",
                email: "",
                mobileNumber: "",
                password: "",
                role: "EMPLOYEE"
            });

            setShowForm(false);

            loadUsers();

        } catch (error) {
            console.error("Error creating user:", error);

            const status = error.response?.status;
            const backendMessage =
                error.response?.data?.message ||
                error.response?.data?.error;

            if (status === 400) {
                alert(
                    backendMessage ||
                    "Invalid user information."
                );
            } else if (status === 401) {
                alert(
                    "Unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to create users."
                );
            } else if (status === 409) {
                alert(
                    backendMessage ||
                    "Username, email, or mobile number already exists."
                );
            } else {
                alert(
                    backendMessage ||
                    "Unable to create user."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const deleteUser = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this user?"
            )
        ) {
            return;
        }

        try {
            await UserService.deleteUser(id);

            alert("User Deleted Successfully!");

            loadUsers();

        } catch (error) {
            console.error("Error deleting user:", error);

            const status = error.response?.status;

            if (status === 401) {
                alert(
                    "Unauthorized. Please login again."
                );
            } else if (status === 403) {
                alert(
                    "You do not have permission to delete users."
                );
            } else if (status === 409) {
                alert(
                    "This user cannot be deleted."
                );
            } else {
                alert(
                    "Unable to delete user."
                );
            }
        }
    };

    const getRoleClass = (role) => {
        switch (role) {
            case "ADMIN":
                return "bg-danger";

            case "MANAGER":
                return "bg-warning text-dark";

            case "EMPLOYEE":
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
                        User Management
                    </h2>

                    <p className="text-muted mb-0">
                        Manage system users and their roles
                    </p>
                </div>

                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadUsers}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                        disabled={saving}
                    >
                        {showForm
                            ? "✕ Close"
                            : "+ Add User"}
                    </button>

                </div>

            </div>

            {/* COUNT */}

            <div
                className="alert alert-info"
                role="alert"
            >
                <strong>
                    Total Users:
                </strong>{" "}
                {users.length}
            </div>

            {/* ADD USER FORM */}

            {showForm && (

                <div className="card shadow mb-4">

                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                            Create New User
                        </h5>
                    </div>

                    <div className="card-body">

                        <form onSubmit={addUser}>

                            <div className="row">

                                {/* FULL NAME */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        value={newUser.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                        disabled={saving}
                                    />

                                </div>

                                {/* USERNAME */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={newUser.username}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                        required
                                        disabled={saving}
                                    />

                                </div>

                                {/* EMAIL */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                        disabled={saving}
                                    />

                                </div>

                                {/* MOBILE */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="mobileNumber"
                                        value={newUser.mobileNumber}
                                        onChange={(e) =>
                                            setNewUser((previous) => ({
                                                ...previous,
                                                mobileNumber: e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 10)
                                            }))
                                        }
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength={10}
                                        required
                                        disabled={saving}
                                    />

                                </div>

                                {/* PASSWORD */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        required
                                        disabled={saving}
                                    />

                                </div>

                                {/* ROLE */}

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Role
                                    </label>

                                    <select
                                        className="form-select"
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleChange}
                                        required
                                        disabled={saving}
                                    >
                                        <option value="EMPLOYEE">
                                            Employee
                                        </option>

                                        <option value="MANAGER">
                                            Manager
                                        </option>

                                        <option value="ADMIN">
                                            Admin
                                        </option>

                                    </select>

                                </div>

                            </div>

                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Creating..."
                                        : "Create User"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowForm(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* USERS TABLE */}

            <div className="card shadow">

                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">
                        Registered Users
                    </h5>
                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-striped table-hover mb-0">

                            <thead className="table-dark">

                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4"
                                        >
                                            Loading Users...
                                        </td>
                                    </tr>

                                ) : users.length > 0 ? (

                                    users.map((user) => (

                                        <tr key={user.userId}>

                                            <td>
                                                {user.userId}
                                            </td>

                                            <td>
                                                {user.fullName || "N/A"}
                                            </td>

                                            <td>
                                                {user.username || "N/A"}
                                            </td>

                                            <td>
                                                {user.email || "N/A"}
                                            </td>

                                            <td>
                                                {user.mobileNumber || "N/A"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getRoleClass(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role || "N/A"}
                                                </span>
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteUser(
                                                            user.userId
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
                                            colSpan="7"
                                            className="text-center py-4"
                                        >

                                            <div className="text-muted">

                                                <h5>
                                                    No Users Available
                                                </h5>

                                                <p className="mb-0">
                                                    Create your first user using the
                                                    <strong>
                                                        {" "}+ Add User{" "}
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

            </div>

        </div>
    );
};

export default Users;