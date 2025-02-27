import React from "react";
import TextInput from "../component/TextInput";
import PasswordInput from "../component/PasswordInput";

const Login = () => {
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

      <div className="flex items-center justify-center px-12 py-12 sm:px-16 lg:col-span-7 lg:px-32 lg:py-32 xl:col-span-6">
        <div className="rounded-lg bg-white p-16 shadow-xl max-w-2xl w-full">
          <h2 className="text-2xl pb-10 font-extrabold text-gray-900">
            Login
          </h2>
          <form action="#" className="space-y-6">
            <TextInput
              label="Username"
              id="Username"
              name="username"
              className="w-full px-6 py-4 text-lg"
            />
            <PasswordInput
              label="Password"
              id="Password"
              name="password"
              type="password"
              className="w-full px-6 py-4 text-lg"
            />

            <div className="col-span-6 mt-7 sm:flex sm:items-center sm:gap-4">
              <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-200 hover:text-blue-800 focus:ring-3 focus:outline-none">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
