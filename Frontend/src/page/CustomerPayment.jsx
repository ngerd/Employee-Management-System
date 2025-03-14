import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, ClipboardList } from "lucide-react";
import { CustomerContext } from "../context/ContextProvider";
import DownloadButton from "../component/DownloadButton"; // Import component

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CustomerPayment = () => {
    const navigate = useNavigate();
    const { company_code } = useContext(CustomerContext);
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${backendUrl}/customer/customer-info`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ companyCode: company_code }),
                });
                console.log("Customer Payment: " + company_code)
                if (!response.ok) throw new Error("Failed to fetch payment data");
                const data = await response.json();
                setCustomer(data.customer);
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };

        if (company_code) {
            fetchData();
        }
    }, [company_code]);

    return (
        <div className="mx-auto max-w-screen-xl py-10 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                    General Information
                </h1>
                <div className="flex items-center gap-4 ml-auto">
                    <DownloadButton customer={customer} />
                    <button
                        className="cursor-pointer flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-medium hover:bg-green-500"
                        onClick={() => navigate("/update-customer")}
                    >
                        {/* <CirclePlus className="w-5 h-5" />  */}
                        Update Customer
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-1">
                            <a href="customer-information" className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100">
                                <ClipboardList size={16} /> General Information
                            </a>
                            <a href="customer-payment" className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600 bg-white">
                                <Info size={16} /> Payment Information
                            </a>

                        </nav>
                    </div>
                </div>
            </div>

            <div className="flow-root rounded-b-lg border border-gray-300 py-3 shadow-xs bg-white">
                <dl className="-my-3 divide-y divide-gray-100 text-sm">
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Tax number</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.tax_number : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Order currency </dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.order_currency : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Payment term</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.payment_term : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Payment method</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.payment_method : "N/A"}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Account code</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.account_code : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Accountant</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.accountant : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Invoice email</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.invoice_email : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Notices email</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.notices_email : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Account manager</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.account_manager : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Account partner</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.account_partner : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Sales manager</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.sales_manager : "N/A"}</dd>
                    </div>


                </dl>
            </div>
        </div>
    );
};
export default CustomerPayment;