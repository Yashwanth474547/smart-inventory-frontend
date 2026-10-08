import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AccessDenied from "./pages/AccessDenied";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Products
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

// Warehouses
import Warehouses from "./pages/Warehouses";
import AddWarehouse from "./pages/AddWarehouse";
import EditWarehouse from "./pages/EditWarehouse";

// Inventory
import Inventory from "./pages/Inventory";
import AddInventory from "./pages/AddInventory";
import EditInventory from "./pages/EditInventory";
import LowStock from "./pages/LowStock";

// Suppliers
import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";
import EditSupplier from "./pages/EditSupplier";

// Purchase Orders
import PurchaseOrders from "./pages/PurchaseOrders";
import AddPurchaseOrder from "./pages/AddPurchaseOrder";
import EditPurchaseOrder from "./pages/EditPurchaseOrder";

// Sales Orders
import SalesOrders from "./pages/SalesOrders";
import AddSalesOrder from "./pages/AddSalesOrder";
import EditSalesOrder from "./pages/EditSalesOrder";

// Reports
import Reports from "./pages/Reports";

// Users
import Users from "./pages/Users";

const ALL_ROLES = ["ADMIN", "MANAGER", "EMPLOYEE"];
const MANAGEMENT_ROLES = ["ADMIN", "MANAGER"];

function App() {
    return (
        <Routes>

            {/* =========================
                LOGIN
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* =========================
                REGISTER
            ========================= */}

            <Route
                path="/register"
                element={<Register />}
            />

            {/* =========================
                FORGOT PASSWORD
            ========================= */}

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            {/* =========================
                ACCESS DENIED
            ========================= */}

            <Route
                path="/access-denied"
                element={
                    <ProtectedRoute>
                        <AccessDenied />
                    </ProtectedRoute>
                }
            />

            {/* =========================
                PROTECTED APPLICATION
            ========================= */}

            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <Layout>

                            <Routes>

                                {/* =========================
                                    DASHBOARD
                                ========================= */}

                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    PRODUCTS
                                ========================= */}

                                <Route
                                    path="/products"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <Products />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/add-product"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <AddProduct />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/edit-product/:id"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <EditProduct />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    WAREHOUSES
                                ========================= */}

                                <Route
                                    path="/warehouses"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <Warehouses />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/add-warehouse"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <AddWarehouse />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/edit-warehouse/:id"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <EditWarehouse />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    INVENTORY
                                ========================= */}

                                <Route
                                    path="/inventory"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <Inventory />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/add-inventory"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <AddInventory />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/edit-inventory/:id"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <EditInventory />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/low-stock"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <LowStock />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    SUPPLIERS
                                    ADMIN + MANAGER
                                ========================= */}

                                <Route
                                    path="/suppliers"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={MANAGEMENT_ROLES}
                                        >
                                            <Suppliers />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/add-supplier"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={MANAGEMENT_ROLES}
                                        >
                                            <AddSupplier />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/edit-supplier/:id"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={MANAGEMENT_ROLES}
                                        >
                                            <EditSupplier />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    PURCHASE ORDERS
                                    ADMIN + MANAGER
                                ========================= */}

                                <Route
                                    path="/purchase-orders"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={MANAGEMENT_ROLES}
                                        >
                                            <PurchaseOrders />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/add-purchase-order"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={MANAGEMENT_ROLES}
                                        >
                                            <AddPurchaseOrder />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/edit-purchase-order/:id"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={MANAGEMENT_ROLES}
                                        >
                                            <EditPurchaseOrder />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    SALES ORDERS
                                ========================= */}

                                <Route
                                    path="/sales-orders"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <SalesOrders />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/add-sales-order"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <AddSalesOrder />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/edit-sales-order/:id"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={ALL_ROLES}
                                        >
                                            <EditSalesOrder />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    REPORTS
                                    ADMIN + MANAGER
                                ========================= */}

                                <Route
                                    path="/reports"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={MANAGEMENT_ROLES}
                                        >
                                            <Reports />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    USERS
                                    ADMIN ONLY
                                ========================= */}

                                <Route
                                    path="/users"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={["ADMIN"]}
                                        >
                                            <Users />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* =========================
                                    UNKNOWN ROUTE
                                ========================= */}

                                <Route
                                    path="*"
                                    element={
                                        <Navigate
                                            to="/"
                                            replace
                                        />
                                    }
                                />

                            </Routes>

                        </Layout>
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;