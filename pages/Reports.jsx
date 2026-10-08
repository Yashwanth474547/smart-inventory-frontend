import { useEffect, useState } from "react";
import ReportService from "../Services/ReportService";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const Reports = () => {
    const [report, setReport] = useState({
        totalPurchaseValue: 0,
        totalSalesValue: 0,
        profit: 0,
        totalStock: 0,
        stockValue: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = () => {
        setLoading(true);

        ReportService.getSummaryReport()
            .then((response) => {
                console.log("REPORT:", response.data);

                setReport({
                    totalPurchaseValue:
                        response.data?.totalPurchaseValue ?? 0,

                    totalSalesValue:
                        response.data?.totalSalesValue ?? 0,

                    profit:
                        response.data?.profit ?? 0,

                    totalStock:
                        response.data?.totalStock ?? 0,

                    stockValue:
                        response.data?.stockValue ?? 0
                });
            })
            .catch((error) => {
                console.error(
                    "Error loading report:",
                    error
                );

                const status = error.response?.status;

                if (status === 401) {
                    alert(
                        "Session expired or unauthorized. Please login again."
                    );
                } else if (status === 403) {
                    alert(
                        "You do not have permission to view reports."
                    );
                } else {
                    alert("Unable to load reports.");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // ==========================
    // WEBSITE / EXCEL AMOUNT
    // ==========================

    const formatAmount = (amount) => {
        return Number(amount ?? 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    // ==========================
    // PDF NUMBER
    // ==========================

    const formatPdfAmount = (amount) => {
        return Number(amount ?? 0).toFixed(2);
    };

    // ==========================
    // DOWNLOAD PDF
    // ==========================

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");

        doc.text(
            "Smart Inventory - Reports",
            14,
            20
        );

        // Date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        doc.text(
            `Generated Date: ${new Date().toLocaleDateString(
                "en-IN"
            )}`,
            14,
            28
        );

        // Report data
        const reportData = [
            [
                "Total Purchase Value",
                `INR ${formatPdfAmount(
                    report.totalPurchaseValue
                )}`
            ],
            [
                "Total Sales Value",
                `INR ${formatPdfAmount(
                    report.totalSalesValue
                )}`
            ],
            [
                "Profit",
                `INR ${formatPdfAmount(
                    report.profit
                )}`
            ],
            [
                "Total Stock",
                Number(
                    report.totalStock ?? 0
                ).toLocaleString("en-IN")
            ],
            [
                "Stock Value",
                `INR ${formatPdfAmount(
                    report.stockValue
                )}`
            ]
        ];

        autoTable(doc, {
            startY: 38,

            head: [
                [
                    "Report",
                    "Value"
                ]
            ],

            body: reportData,

            theme: "grid",

            styles: {
                font: "helvetica",
                fontSize: 11,
                cellPadding: 5,
                textColor: [40, 40, 40]
            },

            headStyles: {
                font: "helvetica",
                fontStyle: "bold",
                textColor: [255, 255, 255]
            },

            columnStyles: {
                0: {
                    cellWidth: 110
                },

                1: {
                    cellWidth: 70,
                    halign: "right"
                }
            }
        });

        doc.save(
            "smart-inventory-report.pdf"
        );
    };

    // ==========================
    // DOWNLOAD EXCEL
    // ==========================

    const downloadExcel = () => {
        const excelData = [
            {
                Report: "Total Purchase Value",
                Value: Number(
                    report.totalPurchaseValue ?? 0
                )
            },
            {
                Report: "Total Sales Value",
                Value: Number(
                    report.totalSalesValue ?? 0
                )
            },
            {
                Report: "Profit",
                Value: Number(
                    report.profit ?? 0
                )
            },
            {
                Report: "Total Stock",
                Value: Number(
                    report.totalStock ?? 0
                )
            },
            {
                Report: "Stock Value",
                Value: Number(
                    report.stockValue ?? 0
                )
            }
        ];

        const worksheet =
            XLSX.utils.json_to_sheet(
                excelData
            );

        worksheet["!cols"] = [
            {
                wch: 30
            },
            {
                wch: 20
            }
        ];

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Report"
        );

        XLSX.writeFile(
            workbook,
            "smart-inventory-report.xlsx"
        );
    };

    return (
        <div className="container mt-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Reports
                    </h2>

                    <p className="text-muted mb-0">
                        Summary of purchases, sales, profit and inventory
                    </p>
                </div>

                <div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={loadReport}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={downloadPDF}
                        disabled={loading}
                    >
                        📄 Download PDF
                    </button>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={downloadExcel}
                        disabled={loading}
                    >
                        📊 Download Excel
                    </button>

                </div>

            </div>

            {/* LOADING */}

            {loading ? (

                <div className="alert alert-info">
                    Loading report...
                </div>

            ) : (

                <div className="row">

                    {/* PURCHASE */}

                    <div className="col-md-4 mb-4">

                        <div className="card text-white bg-primary shadow h-100">

                            <div className="card-body">

                                <h5>
                                    Total Purchase Value
                                </h5>

                                <h3>
                                    ₹{" "}
                                    {formatAmount(
                                        report.totalPurchaseValue
                                    )}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* SALES */}

                    <div className="col-md-4 mb-4">

                        <div className="card text-white bg-success shadow h-100">

                            <div className="card-body">

                                <h5>
                                    Total Sales Value
                                </h5>

                                <h3>
                                    ₹{" "}
                                    {formatAmount(
                                        report.totalSalesValue
                                    )}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* PROFIT */}

                    <div className="col-md-4 mb-4">

                        <div className="card text-white bg-warning shadow h-100">

                            <div className="card-body">

                                <h5>
                                    Profit
                                </h5>

                                <h3>
                                    ₹{" "}
                                    {formatAmount(
                                        report.profit
                                    )}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* TOTAL STOCK */}

                    <div className="col-md-6 mb-4">

                        <div className="card text-white bg-info shadow h-100">

                            <div className="card-body">

                                <h5>
                                    Total Stock
                                </h5>

                                <h3>
                                    {Number(
                                        report.totalStock ?? 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* STOCK VALUE */}

                    <div className="col-md-6 mb-4">

                        <div className="card text-white bg-dark shadow h-100">

                            <div className="card-body">

                                <h5>
                                    Stock Value
                                </h5>

                                <h3>
                                    ₹{" "}
                                    {formatAmount(
                                        report.stockValue
                                    )}
                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Reports;