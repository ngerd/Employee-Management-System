import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logoICON.png"

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex items-center justify-between py-2 px-3 md:px-5 bg-white drop-shadow-md text-black">
      <a href="#">
        <img src={logo} alt="" className="w-40 hover:scale-152 transition-all"/>
      </a>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsActive(!isActive)}
          className="focus:outline-none"
        >
          <FaUserCircle size={32} />
        </button>

        {isActive && (
          <div
            className="absolute right-0 mt-2 w-56 divide-y divide-gray-100 rounded-md border bg-white shadow-lg z-10"
            role="menu"
          >
            <div className="p-2">
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                View on Storefront
              </a>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                View Warehouse Info
              </a>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                Duplicate Product
              </a>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                Unpublish Product
              </a>
            </div>

            <div className="p-2">
              <form method="POST" action="#">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  role="menuitem"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Product
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
