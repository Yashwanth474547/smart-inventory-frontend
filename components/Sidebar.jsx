import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const role = localStorage.getItem("role");

    const isAdmin = role === "ADMIN";
    const isManager = role === "MANAGER";

    const menuItemStyle = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 15px",
        margin: "5px 0",
        borderRadius: "8px",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: "500",
        transition: "all 0.2s ease",
    };

    const getLinkStyle = ({ isActive }) => ({
        ...menuItemStyle,
        backgroundColor: isActive ? "#0d6efd" : "transparent",
        color: isActive ? "white" : "#cbd5e1",
        boxShadow: isActive
            ? "0 4px 10px rgba(13, 110, 253, 0.25)"
            : "none",
    });

    return (
        <div
            style={{
                width: "250px",
                minHeight: "calc(100vh - 65px)",
                background: "#111827",
                color: "white",
                padding: "20px 15px",
                boxSizing: "border-box",
                flexShrink: 0,
            }}
        >
            {/* SYSTEM TITLE */}

            <div
                style={{
                    padding: "5px 10px 20px",
                    borderBottom: "1px solid #374151",
                    marginBottom: "15px",
                }}
            >
                <div
                    style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "6px",
                    }}
                >
                    Management
                </div>

                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "white",
                    }}
                >
                    Inventory System
                </div>
            </div>

            {/* MAIN MENU */}

            <div
                style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    padding: "5px 10px",
                    marginBottom: "5px",
                }}
            >
                Main Menu
            </div>

            {/* DASHBOARD */}

            <NavLink
                to="/"
                end
                style={getLinkStyle}
            >
                <span style={{ fontSize: "19px" }}>🏠</span>
                <span>Dashboard</span>
            </NavLink>

            {/* PRODUCTS */}

            <NavLink
                to="/products"
                style={getLinkStyle}
            >
                <span style={{ fontSize: "19px" }}>📦</span>
                <span>Products</span>
            </NavLink>

            {/* WAREHOUSES */}

            <NavLink
                to="/warehouses"
                style={getLinkStyle}
            >
                <span style={{ fontSize: "19px" }}>🏢</span>
                <span>Warehouses</span>
            </NavLink>

            {/* INVENTORY */}

            <NavLink
                to="/inventory"
                style={getLinkStyle}
            >
                <span style={{ fontSize: "19px" }}>📊</span>
                <span>Inventory</span>
            </NavLink>

            {/* LOW STOCK */}

            <NavLink
                to="/low-stock"
                style={({ isActive }) => ({
                    ...menuItemStyle,
                    backgroundColor: isActive
                        ? "#dc3545"
                        : "transparent",
                    color: isActive
                        ? "white"
                        : "#f87171",
                })}
            >
                <span style={{ fontSize: "19px" }}>⚠️</span>
                <span>Low Stock</span>
            </NavLink>

            {/* MANAGEMENT */}

            {(isAdmin || isManager) && (
                <>
                    <div
                        style={{
                            fontSize: "11px",
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            padding: "15px 10px 5px",
                            marginTop: "5px",
                        }}
                    >
                        Management
                    </div>

                    {/* SUPPLIERS */}

                    <NavLink
                        to="/suppliers"
                        style={getLinkStyle}
                    >
                        <span style={{ fontSize: "19px" }}>🚚</span>
                        <span>Suppliers</span>
                    </NavLink>

                    {/* PURCHASE ORDERS */}

                    <NavLink
                        to="/purchase-orders"
                        style={getLinkStyle}
                    >
                        <span style={{ fontSize: "19px" }}>🛒</span>
                        <span>Purchase Orders</span>
                    </NavLink>

                    {/* REPORTS */}

                    <NavLink
                        to="/reports"
                        style={getLinkStyle}
                    >
                        <span style={{ fontSize: "19px" }}>📋</span>
                        <span>Reports</span>
                    </NavLink>
                </>
            )}

            {/* SALES */}

            <div
                style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    padding: "15px 10px 5px",
                    marginTop: "5px",
                }}
            >
                Sales
            </div>

            <NavLink
                to="/sales-orders"
                style={getLinkStyle}
            >
                <span style={{ fontSize: "19px" }}>💰</span>
                <span>Sales Orders</span>
            </NavLink>

            {/* ADMINISTRATION */}

            {isAdmin && (
                <>
                    <div
                        style={{
                            fontSize: "11px",
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            padding: "15px 10px 5px",
                            marginTop: "5px",
                        }}
                    >
                        Administration
                    </div>

                    <NavLink
                        to="/users"
                        style={({ isActive }) => ({
                            ...menuItemStyle,
                            backgroundColor: isActive
                                ? "#6f42c1"
                                : "transparent",
                            color: isActive
                                ? "white"
                                : "#c4b5fd",
                        })}
                    >
                        <span style={{ fontSize: "19px" }}>👤</span>
                        <span>Users</span>
                    </NavLink>
                </>
            )}

            {/* CURRENT ROLE */}

            <div
                style={{
                    marginTop: "25px",
                    padding: "15px",
                    background: "#1f2937",
                    borderRadius: "10px",
                    border: "1px solid #374151",
                }}
            >
                <div
                    style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        marginBottom: "5px",
                    }}
                >
                    CURRENT ROLE
                </div>

                <div
                    style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#60a5fa",
                    }}
                >
                    {role || "USER"}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;