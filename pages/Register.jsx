import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ==========================
    // HANDLE INPUT
    // ==========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    // ==========================
    // REGISTER
    // ==========================

    const handleRegister = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");

        const fullName =
            formData.fullName.trim();

        const email =
            formData.email.trim().toLowerCase();

        const mobileNumber =
            formData.mobileNumber.trim();

        const password =
            formData.password;

        const confirmPassword =
            formData.confirmPassword;

        // ==========================
        // VALIDATION
        // ==========================

        if (!fullName) {
            setErrorMessage(
                "Please enter your full name."
            );
            return;
        }

        if (!email) {
            setErrorMessage(
                "Please enter your email address."
            );
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage(
                "Please enter a valid email address."
            );
            return;
        }

        if (!mobileNumber) {
            setErrorMessage(
                "Please enter your mobile number."
            );
            return;
        }

        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            setErrorMessage(
                "Mobile number must contain exactly 10 digits."
            );
            return;
        }

        if (!password) {
            setErrorMessage(
                "Please create a password."
            );
            return;
        }

        if (password.length < 6) {
            setErrorMessage(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage(
                "Password and Confirm Password do not match."
            );
            return;
        }

        setLoading(true);

        try {

            // ==========================
            // GENERATE INTERNAL USERNAME
            // ==========================
            //
            // The user does NOT see or enter
            // a username anymore.
            //
            // Backend still requires a unique
            // username because of the existing
            // database structure.
            //

            const generatedUsername =
                "user_" +
                mobileNumber +
                "_" +
                Date.now();

            // ==========================
            // CREATE ACCOUNT
            // ==========================

            const registerResponse =
                await api.post(
                    "/users/public-register",
                    {
                        fullName: fullName,
                        username: generatedUsername,
                        email: email,
                        mobileNumber: mobileNumber,
                        password: password
                    }
                );

            console.log(
                "REGISTRATION SUCCESS:",
                registerResponse.data
            );

            setSuccessMessage(
                "Account created successfully. Signing you in..."
            );

            // ==========================
            // AUTOMATIC LOGIN
            // ==========================

            const loginResponse =
                await api.post(
                    "/users/login",
                    {
                        username: email,
                        password: password
                    }
                );

            console.log(
                "AUTOMATIC LOGIN SUCCESS:",
                loginResponse.data
            );

            // ==========================
            // SAVE LOGIN INFORMATION
            // ==========================

            localStorage.setItem(
                "token",
                loginResponse.data.token
            );

            localStorage.setItem(
                "username",
                loginResponse.data.username
            );

            localStorage.setItem(
                "fullName",
                loginResponse.data.fullName
            );

            localStorage.setItem(
                "role",
                loginResponse.data.role
            );

            // ==========================
            // DASHBOARD
            // ==========================

            navigate("/", {
                replace: true
            });

        } catch (error) {

            console.error(
                "Registration/Login Error:",
                error
            );

            const status =
                error.response?.status;

            const responseData =
                error.response?.data;

            console.error(
                "STATUS:",
                status
            );

            console.error(
                "BACKEND RESPONSE:",
                responseData
            );

            // ==========================
            // SHOW REAL ERROR
            // ==========================

            if (status === 400) {

                setErrorMessage(
                    responseData?.message ||
                    "Invalid registration details."
                );

            } else if (status === 401) {

                setErrorMessage(
                    "Registration request was unauthorized (401). Please make sure the backend is restarted with the latest SecurityConfig."
                );

            } else if (status === 403) {

                setErrorMessage(
                    "Registration is forbidden (403). Please check the backend security configuration."
                );

            } else if (status === 409) {

                setErrorMessage(
                    responseData?.message ||
                    "Email or mobile number already exists."
                );

            } else if (status >= 500) {

                setErrorMessage(
                    responseData?.message ||
                    "Server error. Please check the Spring Boot console."
                );

            } else if (error.request) {

                setErrorMessage(
                    "Cannot connect to the backend. Please make sure Spring Boot is running."
                );

            } else {

                setErrorMessage(
                    responseData?.message ||
                    responseData?.error ||
                    "Unable to create account. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #eef4ff 0%, #dbeafe 50%, #f8fafc 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "35px 15px",
                fontFamily:
                    "Arial, Helvetica, sans-serif"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    background: "#ffffff",
                    borderRadius: "16px",
                    boxShadow:
                        "0 15px 45px rgba(30, 64, 175, 0.15)",
                    padding: "40px 45px"
                }}
            >

                {/* ==========================
                    LOGO
                ========================== */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >

                    <div
                        style={{
                            width: "72px",
                            height: "72px",
                            margin: "0 auto 18px",
                            borderRadius: "50%",
                            background: "#2563eb",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "26px",
                            fontWeight: "700"
                        }}
                    >
                        SI
                    </div>

                    <h1
                        style={{
                            margin: "0",
                            fontSize: "32px",
                            fontWeight: "400",
                            color: "#111827"
                        }}
                    >
                        Create Account
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            marginBottom: "0",
                            color: "#64748b",
                            fontSize: "17px"
                        }}
                    >
                        Create your Smart Inventory account
                    </p>

                </div>

                {/* ==========================
                    ERROR
                ========================== */}

                {errorMessage && (

                    <div
                        style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#b91c1c",
                            padding: "13px 15px",
                            borderRadius: "9px",
                            marginBottom: "22px",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}
                    >
                        ⚠️ {errorMessage}
                    </div>

                )}

                {/* ==========================
                    SUCCESS
                ========================== */}

                {successMessage && (

                    <div
                        style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            color: "#15803d",
                            padding: "13px 15px",
                            borderRadius: "9px",
                            marginBottom: "22px",
                            fontSize: "14px"
                        }}
                    >
                        ✓ {successMessage}
                    </div>

                )}

                {/* ==========================
                    FORM
                ========================== */}

                <form onSubmit={handleRegister}>

                    {/* FULL NAME */}

                    <div style={{ marginBottom: "20px" }}>

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#1e293b",
                                marginBottom: "8px"
                            }}
                        >
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            disabled={loading}
                            required
                            style={{
                                width: "100%",
                                height: "56px",
                                boxSizing: "border-box",
                                border: "1px solid #cbd5e1",
                                borderRadius: "9px",
                                padding: "0 17px",
                                fontSize: "16px",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* EMAIL */}

                    <div style={{ marginBottom: "20px" }}>

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#1e293b",
                                marginBottom: "8px"
                            }}
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            autoComplete="email"
                            disabled={loading}
                            required
                            style={{
                                width: "100%",
                                height: "56px",
                                boxSizing: "border-box",
                                border: "1px solid #cbd5e1",
                                borderRadius: "9px",
                                padding: "0 17px",
                                fontSize: "16px",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* MOBILE */}

                    <div style={{ marginBottom: "20px" }}>

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#1e293b",
                                marginBottom: "8px"
                            }}
                        >
                            Mobile Number
                        </label>

                        <input
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={(e) => {

                                const value =
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 10);

                                setFormData(
                                    (previous) => ({
                                        ...previous,
                                        mobileNumber: value
                                    })
                                );

                                setErrorMessage("");
                                setSuccessMessage("");
                            }}
                            placeholder="Enter 10-digit mobile number"
                            autoComplete="tel"
                            disabled={loading}
                            required
                            style={{
                                width: "100%",
                                height: "56px",
                                boxSizing: "border-box",
                                border: "1px solid #cbd5e1",
                                borderRadius: "9px",
                                padding: "0 17px",
                                fontSize: "16px",
                                outline: "none"
                            }}
                        />

                    </div>

                    {/* PASSWORD */}

                    <div style={{ marginBottom: "20px" }}>

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#1e293b",
                                marginBottom: "8px"
                            }}
                        >
                            Password
                        </label>

                        <div style={{ position: "relative" }}>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                autoComplete="new-password"
                                disabled={loading}
                                required
                                style={{
                                    width: "100%",
                                    height: "56px",
                                    boxSizing: "border-box",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "9px",
                                    padding: "0 55px 0 17px",
                                    fontSize: "16px",
                                    outline: "none"
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform:
                                        "translateY(-50%)",
                                    border: "none",
                                    background: "transparent",
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

                    {/* CONFIRM PASSWORD */}

                    <div style={{ marginBottom: "25px" }}>

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                color: "#1e293b",
                                marginBottom: "8px"
                            }}
                        >
                            Confirm Password
                        </label>

                        <div style={{ position: "relative" }}>

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                disabled={loading}
                                required
                                style={{
                                    width: "100%",
                                    height: "56px",
                                    boxSizing: "border-box",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "9px",
                                    padding: "0 55px 0 17px",
                                    fontSize: "16px",
                                    outline: "none"
                                }}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "50%",
                                    transform:
                                        "translateY(-50%)",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "18px"
                                }}
                            >
                                {showConfirmPassword
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                    </div>

                    {/* CREATE ACCOUNT */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: "52px",
                            border: "none",
                            borderRadius: "9px",
                            background: "#2563eb",
                            color: "#ffffff",
                            fontSize: "17px",
                            fontWeight: "600",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* ==========================
                    LOGIN LINK
                ========================== */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "25px",
                        color: "#64748b",
                        fontSize: "15px"
                    }}
                >
                    Already have an account?{" "}

                    <Link
                        to="/login"
                        style={{
                            color: "#2563eb",
                            fontWeight: "600",
                            textDecoration: "none"
                        }}
                    >
                        Sign in
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default Register;