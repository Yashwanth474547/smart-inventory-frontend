import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const sendOtp = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/users/forgot-password", {
                email: email.trim()
            });

            setOtpSent(true);
            setMessage(
                response.data?.message ||
                "OTP has been sent to your email."
            );
        } catch (err) {
            console.error("Send OTP Error:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to send OTP. Please check your email and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }

        if (otp.length !== 6) {
            setError("OTP must contain 6 digits.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/users/verify-otp", {
                email: email.trim(),
                otp: otp.trim()
            });

            if (response.data?.verified === true) {
                setOtpVerified(true);
                setMessage("OTP verified successfully.");
            } else {
                setError(
                    response.data?.message ||
                    "Invalid or expired OTP."
                );
            }
        } catch (err) {
            console.error("Verify OTP Error:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Invalid or expired OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!newPassword || !confirmPassword) {
            setError("Please enter and confirm your new password.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/users/reset-password", {
                email: email.trim(),
                newPassword: newPassword
            });

            setMessage(
                response.data?.message ||
                "Password reset successfully."
            );

            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } catch (err) {
            console.error("Reset Password Error:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <div style={styles.logoCircle}>
                    SI
                </div>

                <h1 style={styles.title}>
                    Forgot Password
                </h1>

                <p style={styles.subtitle}>
                    Reset your Smart Inventory account password
                </p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {message && (
                    <div style={styles.success}>
                        {message}
                    </div>
                )}

                {!otpSent && (
                    <form onSubmit={sendOtp}>

                        <label style={styles.label}>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            style={styles.input}
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>

                    </form>
                )}

                {otpSent && !otpVerified && (
                    <form onSubmit={verifyOtp}>

                        <label style={styles.label}>
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            placeholder="Enter 6-digit OTP"
                            style={styles.input}
                            maxLength={6}
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setOtpSent(false);
                                setOtp("");
                                setMessage("");
                                setError("");
                            }}
                            style={styles.secondaryButton}
                            disabled={loading}
                        >
                            Change Email
                        </button>

                    </form>
                )}

                {otpVerified && (
                    <form onSubmit={resetPassword}>

                        <label style={styles.label}>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            style={styles.input}
                            disabled={loading}
                        />

                        <label style={styles.label}>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm new password"
                            style={styles.input}
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                    </form>
                )}

                <div style={styles.loginLink}>
                    <Link to="/login" style={styles.link}>
                        ← Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
    },

    card: {
        width: "100%",
        maxWidth: "430px",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 35px rgba(0, 0, 0, 0.10)"
    },

    logoCircle: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "#1d4ed8",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        fontWeight: "bold",
        margin: "0 auto 20px"
    },

    title: {
        textAlign: "center",
        margin: "0",
        color: "#1f2937",
        fontSize: "28px"
    },

    subtitle: {
        textAlign: "center",
        color: "#6b7280",
        marginTop: "8px",
        marginBottom: "28px",
        fontSize: "14px"
    },

    label: {
        display: "block",
        marginBottom: "7px",
        color: "#374151",
        fontWeight: "600",
        fontSize: "14px"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px 14px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "15px",
        marginBottom: "18px",
        outline: "none"
    },

    button: {
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: "8px",
        background: "#1d4ed8",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "5px"
    },

    secondaryButton: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#ffffff",
        color: "#374151",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "12px"
    },

    error: {
        background: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
        padding: "11px 13px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "14px"
    },

    success: {
        background: "#f0fdf4",
        color: "#15803d",
        border: "1px solid #bbf7d0",
        padding: "11px 13px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "14px"
    },

    loginLink: {
        textAlign: "center",
        marginTop: "25px"
    },

    link: {
        color: "#1d4ed8",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "600"
    }
};

export default ForgotPassword;