import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";
import Alert from "../component/Alert";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const navigate = useNavigate();
  const { employeeId, setEmployeeId, setisadmin } = useContext(Employee);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Login API call; returns login data including employee_id
  const fetchLogin = async () => {
    try {
      console.log(formValues);
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (data.error) {
        setAlert({
          show: true,
          message: "Wrong email or password",
          type: "error",
        });
        return null;
      } else {
        // Update context with employee id
        setEmployeeId(data.employee_id);
        setAlert({ show: true, message: "Login successful", type: "success" });
        return data;
      }
    } catch (error) {
      console.error("There was a problem fetching the login data:", error);
      setAlert({
        show: true,
        message: "Wrong email or password",
        type: "error",
      });
      return null;
    }
  };

  // Update fetchEmployeeInfo to accept an employee id parameter.
  const fetchEmployeeInfo = async (empId) => {
    try {
      const response = await fetch(`${backendUrl}/viewinfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: empId }),
      });
      const data = await response.json();
      console.log("Employee info:", data);
      setisadmin(data.isadmin);
      return data;
    } catch (error) {
      console.error("There was a problem fetching employee info:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  // Use the employee id returned from login to fetch employee info.
  const loginUser = async () => {
    const data = await fetchLogin();
    if (data && !data.error) {
      const empInfo = await fetchEmployeeInfo(data.employee_id);
      if (empInfo && !empInfo.error) {
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    }
  };

  useEffect(() => {
    if (employeeId) {
      console.log("Employee logged in:", employeeId);
    }
  }, [employeeId]);

  return (
    <div className="relative">
      {alert.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ show: false, message: "", type: "" })}
          />
        </div>
      )}
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="hidden lg:flex relative items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="A background"
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="relative p-12">
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to Icon Consulting Group
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">
              Icon Consulting Group Internal Portal is an exclusively designed
              platform to help our team manage projects, track tasks, and collaborate seamlessly in one place.
            </p>
          </div>
        </section>
        <div className="flex items-center justify-center px-8 py-12 sm:px-16 lg:col-span-7 lg:px-32 lg:py-32 xl:col-span-6">
          <div className="rounded-lg bg-white p-8 sm:p-12 md:p-16 shadow-xl w-full max-w-md">
            <h2 className="text-2xl pb-10 font-extrabold text-gray-900">Login</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="Email"
              />
              <input
                id="password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                className="mt-1 p-2 h-10 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="Password"
              />
              <div className="col-span-6 mt-7 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white transition duration-300 ease-in-out hover:bg-gray-700"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
