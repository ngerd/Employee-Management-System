import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadExcelButton = ({ customer }) => {
    const generateExcelFile = () => {
        if (!customer) return;

        const workbook = XLSX.utils.book_new();
        const worksheetData = [
            ["Business Partner Template"],
            [],
            ["General Information"],
            ["Role", "Customer (Sold-To = Bill-To)"],
            ["Company Code", customer.company_code || "N/A"],
            [],
            ["Address"],
            ["Legal name", customer.legal_name || "N/A"],
            ["Street 1", customer.street_1 || "N/A"],
            ["Street 2", customer.street_2 || "N/A"],
            ["Street 3", customer.street_3 || "N/A"],
            ["House number", customer.house_number || "N/A"],
            ["Postal Code", customer.postal_code || "N/A"],
            ["City", customer.city || "N/A"],
            ["Region", customer.region || "N/A"],
            ["Country", customer.country || "N/A"],
            [],
            ["Identification"],
            ["Tax number", customer.tax_number || "N/A"],
            ["Order currency", customer.order_currency || "N/A"],
            ["Payment term", customer.payment_term || "N/A"],
            ["Payment method", customer.payment_method || "N/A"],
            ["Account code", customer.account_code || "N/A"],
            [],
            ["Contacts"],
            ["Accountant", customer.accountant || "N/A"],
            ["Invoice email", customer.invoice_email || "N/A"],
            ["Notices email", customer.notices_email || "N/A"],
            ["Account manager", customer.account_manager || "N/A"],
            ["Account partner", customer.account_partner || "N/A"],
            ["Sales manager", customer.sales_manager || "N/A"],
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        worksheet["!cols"] = [{ wch: 25 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Information");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "CustomerInformation.xlsx");
    };

    return (
        <button
            onClick={generateExcelFile}
            className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
        >
            Download Excel
        </button>
    );
};

export default DownloadExcelButton;
