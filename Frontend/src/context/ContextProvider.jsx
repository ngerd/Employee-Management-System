import React from "react";
import { createContext, useState } from "react";

export const Employee = createContext(null);

function ContextProvider({ children }) {
  const [employeeId, setEmployeeId] = useState(null);
  return (
    <Employee.Provider
      value={{
        employeeId,
        setEmployeeId,
      }}
    >
      {children}
    </Employee.Provider>
  );
}

export default ContextProvider;
