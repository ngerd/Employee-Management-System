import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { CustomerContext, ProjectContext, TaskContext } from "../context/ContextProvider";
import Alert from "../component/Alert";

const UpdateCustomer = () => {
    const navigate = useNavigate();
    const { company_code } = useContext(CustomerContext);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });
    const [formValues, setFormValues] = useState({
        company_code: "",
        legal_name: "",
        street_1: "",
        street_2: "",
        street_3: "",
        house_number: "",
        postal_code: "",
        city: "",
        region: "",
        country: "",
        tax_number: "",
        order_currency: "",
        payment_term: "",
        payment_method: "",
        account_code: "",
        accountant: "",
        invoice_email: "",
        notices_email: "",
        account_manager: "",
        account_partner: "",
        sales_manager: "",
    });

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            try {
                const response = await fetch("http://localhost:3000/customer/customer-info", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ companyCode: company_code }),
                });
                console.log("Customer info:" + company_code);
                const data = await response.json();
                console.log("Customer data:", data);
                if (response.ok) {
                    setFormValues(prev => ({
                        ...prev,
                        ...data.customer
                    }));
                } else {
                    console.error("Error fetching customer info:", data.error);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        if (company_code) fetchCustomerInfo();
    }, [company_code]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/customer/update-customer", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });
            const data = await response.json();
            if (response.ok) {
                setAlert({ show: true, message: "Customer updated successfully!", type: "success" });
                setTimeout(() => navigate("/customer"), 1500);
            } else {
                setAlert({ show: true, message: data.error || "Failed to update customer.", type: "error" });
            }
        } catch (error) {
            setAlert({ show: true, message: "Error updating customer.", type: "error" });
            console.error("Update error:", error);
        }
    };
    useEffect(() => {
        console.log("Updated form values:", formValues);
    }, [formValues]);


    return (
        <div className="mx-auto max-w-screen-xl px-6 py-12 sm:px-8 lg:px-10">
            {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false, message: "", type: "" })} />}
            <div className="mt-4 grid max-w-screen-xl grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-2" >
                <div className="rounded-lg bg-white p-8 shadow-lg">
                    <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Create Customer</h2>
                    <form className="space-y-4">
                        {/* <div className="flex gap-4"> */}
                        <input
                            id="company_code"
                            name="company_code"
                            value={formValues.company_code || ""}
                            onChange={(e) => setFormValues({ ...formValues, company_code: e.target.value })}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Company Code"
                        />


                        <input
                            id="legal_name"
                            name="legal_name"
                            value={formValues.legal_name || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Legal Name"
                        />
                        <input
                            id="street_1"
                            name="street_1"
                            value={formValues.street_1 || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Street 1"
                        />
                        <input
                            id="street_2"
                            name="street_2"
                            value={formValues.street_2 || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Street 2"
                        />
                        <input
                            id="street_3"
                            name="street_3"
                            value={formValues.street_3 || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Street 3"
                        />
                        <input
                            id="house_number"
                            name="house_number"
                            value={formValues.house_number || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="House Number"
                        />
                        <input
                            id="postal_code"
                            name="postal_code"
                            value={formValues.postal_code || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Postal Code"
                        />
                        <input
                            id="city"
                            name="city"
                            value={formValues.city || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="City"
                        />
                        <input
                            id="region"
                            name="region"
                            value={formValues.region || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Region"
                        />
                        <input
                            id="country"
                            name="country"
                            value={formValues.country || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Country"
                        />
                    </form>
                </div>


                <div className="rounded-lg bg-white p-8 shadow-lg">
                    <form className=" mt-16 space-y-4" onSubmit={handleSubmit}>
                        <input
                            id="tax_number"
                            name="tax_number"
                            value={formValues.tax_number || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Tax number"
                        />
                        <input
                            id="order_currency"
                            name="order_currency"
                            value={formValues.order_currency || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Order currency"
                        />
                        <input
                            id="payment_term"
                            name="payment_term"
                            value={formValues.payment_term || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Payment term"
                        />
                        <input
                            id="payment_method"
                            name="payment_method"
                            value={formValues.payment_method || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Payment method"
                        />
                        <input
                            id="account_code"
                            name="account_code"
                            value={formValues.account_code || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Account code"
                        />
                        <input
                            id="accountant"
                            name="accountant"
                            value={formValues.accountant || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Accountant"
                        />
                        <input
                            id="invoice_email"
                            name="invoice_email"
                            value={formValues.invoice_email || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Invoice email"
                        />
                        <input
                            id="notices_email"
                            name="notices_email"
                            value={formValues.notices_email || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Notices email"
                        />
                        <input
                            id="account_manager"
                            name="account_manager"
                            value={formValues.account_manager || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Account manager"
                        />
                        <input
                            id="account_partner"
                            name="account_partner"
                            value={formValues.account_partner || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Account partner"
                        />
                        <input
                            id="sales_manager"
                            name="sales_manager"
                            value={formValues.sales_manager || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Sales manager"
                        />



                        {/* </div> */}

                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={() => navigate("/customer")}
                                className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
                            >
                                Submit
                            </button>
                        </div>

                    </form>
                </div>



            </div>
        </div >
    );
};

export default UpdateCustomer;
