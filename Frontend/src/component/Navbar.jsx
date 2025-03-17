import React, { useState, useRef, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import logo from "../assets/logoICON.png";
import { CircleUserRound } from "lucide-react";
import { Employee } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const { setEmployeeId, setisadmin } = useContext(Employee);

  // Refs to the button and the dropdown
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Store the computed dropdown position
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogout = async (e) => {
    e.preventDefault();
    await fetchData();
    setEmployeeId(null);
    setisadmin(null);
    navigate("/");
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.error("There was a problem logging out:", error);
    }
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsActive((prev) => !prev);
  };

  /**
   * Whenever the dropdown is activated,
   * compute its position based on the button’s bounding rect.
   */
  useEffect(() => {
    if (isActive && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      // Tailwind 'w-56' is ~224px. Adjust if your dropdown width differs.
      const DROPDOWN_WIDTH = 224;
      const OFFSET = 4; // Gap below the button

      let top = rect.bottom + OFFSET;
      let left = rect.left;

      // If the dropdown would overflow the right edge, shift it left.
      if (left + DROPDOWN_WIDTH > window.innerWidth) {
        left = window.innerWidth - DROPDOWN_WIDTH - 16; // 16px margin
      }

      setDropdownPosition({ top, left });
    }
  }, [isActive]);

  // Close dropdown if user clicks anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsActive(false);
      }
    };

    // Use 'click' instead of 'mousedown' for better mobile compatibility
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Dropdown content
  const dropdownMenu = (
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
      }}
      className="z-[9999] w-48 sm:w-56 rounded-md border bg-white shadow-lg divide-y divide-gray-100"
      role="menu"
    >
      <div className="p-2">
        <button
          onClick={() => {
            setIsActive(false);
            navigate("/view-account");
          }}
          className="block w-full text-left rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          role="menuitem"
        >
          View Account
        </button>
      </div>
      <div className="p-2">
        <form onSubmit={handleLogout}>
          <button
            type="submit"
            className="cursor-pointer flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
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
            Log out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-between py-2 px-3 md:px-5 bg-white drop-shadow-md text-black">
      <a href="/home">
        <img
          src={logo}
          alt="Logo"
          className="w-32 sm:w-40 hover:scale-110 transition-all"
        />
      </a>
      <div className="flex gap-4">
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="focus:outline-none"
        >
          <CircleUserRound size={30} />
        </button>
      </div>
      {isActive && ReactDOM.createPortal(dropdownMenu, document.body)}
    </div>
  );
}

export default Navbar;