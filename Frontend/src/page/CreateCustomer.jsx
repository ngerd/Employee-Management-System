import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../component/Alert";

const CreateCustomer = () => {
    const navigate = useNavigate();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/customer/create-customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues),
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({ show: true, message: "Customer added successfully!", type: "success" });
                setTimeout(() => {
                    navigate("/customer");
                }, 1500);
            } else {
                setAlert({ show: true, message: data.error || "Failed to create customer.", type: "error" });
            }
        } catch (error) {
            setAlert({ show: true, message: "There was a problem creating the customer.", type: "error" });
            console.error("Error:", error);
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 lg:px-10">
            {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ show: false, message: "", type: "" })} />}

            <div className="rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-2xl pb-8 font-extrabold text-gray-900">Create Customer</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {Object.keys(formValues).map((key) => (
                        <input
                            key={key}
                            id={key}
                            name={key}
                            value={formValues[key]}
                            onChange={handleChange}
                            className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder={key.replace(/_/g, " ").replace(/\b\w/g, (char, index) => index === 0 ? char.toUpperCase() : char.toLowerCase())}
                        />
                    ))}

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
    );
};

export default CreateCustomer;
