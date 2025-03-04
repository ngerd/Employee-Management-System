import React, { useEffect, useState } from "react";

const Alert = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 0); // Call onClose immediately after hiding the alert
    }, 3000); // Show alert for 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertStyles = {
    success: "text-green-600 border-green-100 bg-green-50",
    error: "text-red-600 border-red-100 bg-red-50",
  };

  return (
    <div
      role="alert"
      className={`mb-3 rounded-xl border p-4 ${alertStyles[type]} ${!visible && "hidden"}`}
    >
      <div className="flex items-start gap-4">
        <span className={type === "success" ? "text-green-600" : "text-red-600"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={type === "success" ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M6 18L18 6M6 6l12 12"}
            />
          </svg>
        </span>

        <div className="flex-1">
          <strong className="block font-medium text-gray-900">
            {type === "success" ? "Success" : "Error"}
          </strong>
          <p className="mt-1 text-sm text-gray-700">{message}</p>
        </div>

        <button className="text-gray-500 transition hover:text-gray-600" onClick={() => setVisible(false)}>
          <span className="sr-only">Dismiss popup</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;