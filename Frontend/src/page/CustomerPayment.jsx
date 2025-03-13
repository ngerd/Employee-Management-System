import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, ClipboardList } from "lucide-react";
import { ProjectContext } from "../context/ContextProvider";

const CustomerPayment = () => {
    const navigate = useNavigate();
    const { projectId: companyCode } = useContext(ProjectContext);
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/customer/payment-info", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ companyCode }),
                });

                if (!response.ok) throw new Error("Failed to fetch payment data");
                const data = await response.json();
                setPaymentInfo(data.payment);
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };

        if (companyCode) {
            fetchData();
        }
    }, [companyCode]);

    return (
        <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                    Payment Information
                </h1>
            </div>

            <div className="mt-4">
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-1">
                            <a href="customer-information" className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-white">
                                <Info size={16} /> General Information
                            </a>
                            <a href="customer-payment" className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600 bg-gray-100">
                                <ClipboardList size={16} /> Payment Information
                            </a>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flow-root rounded-b-lg border border-gray-300 py-3 shadow-xs bg-white">
                <dl className="-my-3 divide-y divide-gray-100 text-sm">
                    {[
                        { label: "Tax Number", value: paymentInfo?.tax_number },
                        { label: "Order Currency", value: paymentInfo?.order_currency },
                        { label: "Payment Term", value: paymentInfo?.payment_term },
                        { label: "Payment Method", value: paymentInfo?.payment_method },
                        { label: "Account Code", value: paymentInfo?.account_code },
                        { label: "Accountant", value: paymentInfo?.accountant },
                        { label: "Invoice Email", value: paymentInfo?.invoice_email },
                        { label: "Notices Email", value: paymentInfo?.notices_email },
                        { label: "Account Manager", value: paymentInfo?.account_manager },
                        { label: "Account Partner", value: paymentInfo?.account_partner },
                        { label: "Sales Manager", value: paymentInfo?.sales_manager },
                    ].map((item, index) => (
                        <div key={index} className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-gray-900">{item.label}</dt>
                            <dd className="text-gray-700 sm:col-span-2">{item.value || "N/A"}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
};

export default CustomerPayment;