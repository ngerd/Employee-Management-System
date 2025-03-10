import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../context/ContextProvider";
import Alert from "../component/Alert"; // Import Alert component

function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const navigate = useNavigate();
  const { employeeId, setEmployeeId, setisadmin } = useContext(Employee);
  const [alert, setAlert] = useState({ message: "", type: "" }); // Alert state

  const fetchMockData = async () => {
    try {
      console.log(formValues);
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      if (data.error) {
        setAlert({ message: "wrong Email or Password", type: "error" });
        return null;
      } else {
        setEmployeeId(data.employee_id);
        setAlert({ message: "Login Successfully", type: "success" });
        return data;
      }
    } catch (error) {
      console.error("There was a problem fetching the mock data:", error);
      setAlert({ message: "wrong Email or Password", type: "error" });
      return null;
    }
  };

  const fetchEmployeeInfo = async () => {
    try {
      console.log(formValues);
      const response = await fetch("http://localhost:3000/viewinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id: employeeId }),
      });
      const data = await response.json();
      console.log(data);
      setisadmin(data.isadmin);
      return data;
    } catch (error) {
      console.error("There was a problem fetching the mock data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
  };

  const validate = async () => {
    const data = await fetchMockData();
    if (data && !data.error) {
      console.log("Waiting for employeeId update...");
    }
  };

  useEffect(() => {
    if (employeeId) {
      console.log("Updated Employee ID:", employeeId);
      const init = async () => {
        const data = await fetchEmployeeInfo();
        if (data && !data.error) {
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        }
      };
      init();
    }
  }, [employeeId, navigate]);

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
      <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
        <img
          alt="a picture"
          src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="hidden lg:relative lg:block lg:p-12">
          <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Welcome to ICS 🐱
          </h2>
          <p className="mt-4 leading-relaxed text-white/90">
            Some description about the website.
          </p>
        </div>
      </section>
      <div className="flex items-center justify-center place-items-center px-12 py-12 sm:px-16 lg:col-span-7 lg:px-32 lg:py-32 xl:col-span-6">
        <div className="rounded-lg bg-white p-16 shadow-xl max-w-2xl w-full">
          {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />} {/* Render Alert */}
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
                className="cursor-pointer rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-700"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
