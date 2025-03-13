import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, ClipboardList } from "lucide-react";
import { CustomerContext } from "../context/ContextProvider";

const CustomerPayment = () => {
    const navigate = useNavigate();
    const { company_code } = useContext(CustomerContext);
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/customer/customer-info", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ companyCode: company_code }),
                });
                console.log("Customer Payment: " + companyCode)
                if (!response.ok) throw new Error("Failed to fetch payment data");
                const data = await response.json();
                setPaymentInfo(data.payment);
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
            </div>

            <div className="mt-4">
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-1">
                            <a href="customer-information" className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-sky-600 bg-white">
                                <Info size={16} /> General Information
                            </a>
                            <a href="customer-payment" className="shrink-0 w-32 flex items-center gap-2 rounded-t-2xl border border-gray-300 border-b-white p-3 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100">
                                <ClipboardList size={16} /> Payment Information
                            </a>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flow-root rounded-b-lg border border-gray-300 py-3 shadow-xs bg-white">
                <dl className="-my-3 divide-y divide-gray-100 text-sm">
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Company Code</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.company_code : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Legal Name</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.legal_name : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Street 1</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.street_1 : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Street 2</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.street_2 : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Street 3</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.street_3 : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">House Number</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.house_number : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Postal Code</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.postal_code : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">City</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.city : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Region</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.region : "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Country</dt>
                        <dd className="text-gray-700 sm:col-span-2">{customer ? customer.country : "N/A"}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};
export default CustomerPayment;