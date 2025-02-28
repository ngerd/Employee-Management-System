import React from "react";
import { createContext, useState } from "react";

export const Employee = createContext(null);

function ContextProvider({ children }) {
  const [employeeId, setEmployeeId] = useState(null);
  const [isadmin, setisadmin] = useState(false);
  
  return (
    <Employee.Provider
      value={{
        employeeId,
        setEmployeeId,
        isadmin,
        setisadmin,
      }}
    >
      {children}
    </Employee.Provider>
  );
}

export default ContextProvider;
