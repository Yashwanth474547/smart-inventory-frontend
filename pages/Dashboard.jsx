import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardService from "../Services/DashboardService";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState({
        totalProducts: 0,
        totalSuppliers: 0,
        totalStock: 0,
        totalWarehouses: 0,
        totalPurchaseOrders: 0,
        totalSalesOrders: 0,
        lowStockProducts: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const response =
                await DashboardService.getDashboardData();

            setDashboard({
                totalProducts: response.data.totalProducts || 0,
                totalSuppliers: response.data.totalSuppliers || 0,
                totalStock: response.data.totalStock || 0,
                totalWarehouses: response.data.totalWarehouses || 0,
                totalPurchaseOrders:
                    response.data.totalPurchaseOrders || 0,
                totalSalesOrders:
                    response.data.totalSalesOrders || 0,
                lowStockProducts:
                    response.data.lowStockProducts || 0
            });

        } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    const cards = [
        {
            title: "Total Products",
            value: dashboard.totalProducts,
            icon: "📦",
            color: "#0d6efd",
            link: "/products"
        },
        {
            title: "Total Suppliers",
            value: dashboard.totalSuppliers,
            icon: "🚚",
            color: "#198754",
            link: "/suppliers"
        },
        {
            title: "Total Stock",
            value: dashboard.totalStock,
            icon: "📊",
            color: "#ffc107",
            textColor: "#212529",
            link: "/inventory"
        },
        {
            title: "Total Warehouses",
            value: dashboard.totalWarehouses,
            icon: "🏭",
            color: "#0dcaf0",
            textColor: "#212529",
            link: "/warehouses"
        },
        {
            title: "Purchase Orders",
            value: dashboard.totalPurchaseOrders,
            icon: "🛒",
            color: "#6c757d",
            link: "/purchase-orders"
        },
        {
            title: "Sales Orders",
            value: dashboard.totalSalesOrders,
            icon: "💰",
            color: "#dc3545",
            link: "/sales-orders"
        }
    ];

    return (

        <div
            style={{
                padding: "30px",
                minHeight: "100vh",
                backgroundColor: "#f5f7fb"
            }}
        >

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontWeight: "700",
                            color: "#212529"
                        }}
                    >
                        Smart Inventory Dashboard
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#6c757d"
                        }}
                    >
                        Overview of your inventory management system
                    </p>

                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadDashboard}
                >
                    🔄 Refresh
                </button>

            </div>


            {/* Low Stock Alert */}

            {dashboard.lowStockProducts > 0 && (

                <div
                    className="alert alert-danger"
                    style={{
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 22px",
                        marginBottom: "25px"
                    }}
                >

                    <div>

                        <h5
                            style={{
                                marginBottom: "5px",
                                fontWeight: "700"
                            }}
                        >
                            ⚠ Low Stock Alert
                        </h5>

                        <div>
                            {dashboard.lowStockProducts} product(s)
                            are below the reorder level.
                        </div>

                    </div>

                    <Link
                        to="/low-stock"
                        className="btn btn-danger"
                    >
                        View Low Stock
                    </Link>

                </div>

            )}


            {/* Dashboard Cards */}

            <div className="row">

                {cards.map((card, index) => (

                    <div
                        className="col-lg-4 col-md-6 mb-4"
                        key={index}
                    >

                        <Link
                            to={card.link}
                            style={{
                                textDecoration: "none"
                            }}
                        >

                            <div
                                style={{
                                    backgroundColor: card.color,
                                    color:
                                        card.textColor || "white",
                                    borderRadius: "15px",
                                    padding: "25px",
                                    minHeight: "155px",
                                    boxShadow:
                                        "0 5px 15px rgba(0,0,0,0.12)",
                                    transition:
                                        "transform 0.2s ease"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center"
                                    }}
                                >

                                    <div>

                                        <div
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "600",
                                                marginBottom: "12px"
                                            }}
                                        >
                                            {card.title}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "42px",
                                                fontWeight: "700"
                                            }}
                                        >
                                            {loading
                                                ? "..."
                                                : card.value}
                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            fontSize: "42px"
                                        }}
                                    >
                                        {card.icon}
                                    </div>

                                </div>

                                <div
                                    style={{
                                        marginTop: "10px",
                                        fontSize: "14px",
                                        opacity: 0.85
                                    }}
                                >
                                    View details →
                                </div>

                            </div>

                        </Link>

                    </div>

                ))}

            </div>


            {/* Empty System Message */}

            {!loading &&
                dashboard.totalProducts === 0 &&
                dashboard.totalSuppliers === 0 &&
                dashboard.totalWarehouses === 0 &&
                dashboard.totalPurchaseOrders === 0 &&
                dashboard.totalSalesOrders === 0 && (

                    <div
                        className="alert alert-info text-center"
                        style={{
                            borderRadius: "12px",
                            marginTop: "10px"
                        }}
                    >
                        <h5>Welcome to Smart Inventory</h5>

                        <p style={{ marginBottom: 0 }}>
                            Your inventory is currently empty.
                            Start by adding your first product.
                        </p>

                    </div>

                )}

        </div>
    );
};

export default Dashboard;