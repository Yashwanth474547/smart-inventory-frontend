import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        identifier: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const login = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        setErrorMessage("");
        setLoading(true);

        try {

            const response = await api.post(
                "/users/login",
                {
                    username: user.identifier,
                    password: user.password
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "username",
                response.data.username
            );

            localStorage.setItem(
                "fullName",
                response.data.fullName
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            navigate("/", { replace: true });

        } catch (error) {

            console.error("Login Error:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Invalid username, email, mobile number or password."
            );

            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("fullName");
            localStorage.removeItem("role");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #101d45, #2459d6)",
                padding: "30px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "1110px",
                    minHeight: "650px",
                    display: "flex",
                    background: "#ffffff",
                    borderRadius: "22px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
                }}
            >

                {/* LEFT SIDE */}

                <div
                    style={{
                        flex: 1,
                        background:
                            "linear-gradient(160deg, #101d45, #2459d6)",
                        color: "white",
                        padding: "70px 55px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >

                    <div
                        style={{
                            fontSize: "48px",
                            marginBottom: "25px"
                        }}
                    >
                        📦
                    </div>

                    <h1
                        style={{
                            fontSize: "44px",
                            fontWeight: "700",
                            marginBottom: "15px"
                        }}
                    >
                        Smart Inventory
                    </h1>

                    <h3
                        style={{
                            fontWeight: "400",
                            marginBottom: "30px"
                        }}
                    >
                        Inventory & Purchase Management
                    </h3>

                    <p
                        style={{
                            fontSize: "18px",
                            lineHeight: "1.8",
                            opacity: "0.95",
                            maxWidth: "500px"
                        }}
                    >
                        Manage products, warehouses, inventory,
                        suppliers, purchase orders, sales orders
                        and reports from one centralized system.
                    </p>

                    <div
                        style={{
                            marginTop: "35px",
                            fontSize: "17px",
                            lineHeight: "2.5"
                        }}
                    >
                        <div>✓ Product Management</div>
                        <div>✓ Inventory Tracking</div>
                        <div>✓ Purchase & Sales Management</div>
                        <div>✓ Reports & Stock Monitoring</div>
                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div
                    style={{
                        flex: 1,
                        padding: "70px 65px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >

                    <h2
                        style={{
                            fontSize: "38px",
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: "8px"
                        }}
                    >
                        Welcome Back
                    </h2>

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "17px",
                            marginBottom: "30px"
                        }}
                    >
                        Sign in to access your inventory dashboard.
                    </p>

                    {/* ERROR */}

                    {errorMessage && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <form onSubmit={login}>

                        {/* IDENTIFIER */}

                        <div className="mb-4">

                            <label
                                className="form-label"
                                style={{
                                    fontWeight: "600",
                                    color: "#374151"
                                }}
                            >
                                Username / Email / Mobile Number
                            </label>

                            <div
                                style={{
                                    position: "relative"
                                }}
                            >

                                <span
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform:
                                            "translateY(-50%)",
                                        fontSize: "20px",
                                        zIndex: 2
                                    }}
                                >
                                    👤
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username, email or mobile"
                                    value={user.identifier}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            identifier:
                                                e.target.value
                                        })
                                    }
                                    style={{
                                        height: "58px",
                                        paddingLeft: "50px",
                                        borderRadius: "10px",
                                        fontSize: "16px"
                                    }}
                                    autoComplete="username"
                                    required
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div className="mb-3">

                            <label
                                className="form-label"
                                style={{
                                    fontWeight: "600",
                                    color: "#374151"
                                }}
                            >
                                Password
                            </label>

                            <div
                                style={{
                                    position: "relative"
                                }}
                            >

                                <span
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform:
                                            "translateY(-50%)",
                                        fontSize: "20px",
                                        zIndex: 2
                                    }}
                                >
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={user.password}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            password:
                                                e.target.value
                                        })
                                    }
                                    style={{
                                        height: "58px",
                                        paddingLeft: "50px",
                                        paddingRight: "50px",
                                        borderRadius: "10px",
                                        fontSize: "16px"
                                    }}
                                    autoComplete="current-password"
                                    required
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
                                    style={{
                                        position: "absolute",
                                        right: "14px",
                                        top: "50%",
                                        transform:
                                            "translateY(-50%)",
                                        border: "none",
                                        background:
                                            "transparent",
                                        cursor: "pointer",
                                        fontSize: "18px"
                                    }}
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>

                        {/* FORGOT PASSWORD */}

                        <div
                            style={{
                                textAlign: "right",
                                marginBottom: "25px"
                            }}
                        >
                            <Link
                                to="/forgot-password"
                                style={{
                                    color: "#2563eb",
                                    textDecoration: "none",
                                    fontWeight: "600"
                                }}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="btn w-100"
                            disabled={loading}
                            style={{
                                height: "58px",
                                background: "#2864e6",
                                color: "white",
                                borderRadius: "10px",
                                fontSize: "18px",
                                fontWeight: "600",
                                border: "none"
                            }}
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}
                        </button>

                    </form>

                    {/* CREATE ACCOUNT */}

                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            fontSize: "15px",
                            color: "#6b7280"
                        }}
                    >
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            style={{
                                color: "#2563eb",
                                fontWeight: "600",
                                textDecoration: "none"
                            }}
                        >
                            Create Account
                        </Link>
                    </div>

                    {/* FOOTER */}

                    <div
                        style={{
                            borderTop:
                                "1px solid #e5e7eb",
                            marginTop: "35px",
                            paddingTop: "25px",
                            textAlign: "center",
                            color: "#9ca3af"
                        }}
                    >
                        Smart Inventory & Purchase Management
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;