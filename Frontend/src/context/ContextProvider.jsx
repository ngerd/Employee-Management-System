import React, { createContext, useState, useEffect } from "react";

export const Employee = createContext(null);
export const ProjectContext = createContext(null);
export const TaskContext = createContext(null);
export const CustomerContext = createContext(null);

function ContextProvider({ children }) {
  // Rehydrate state from sessionStorage (or use default values)
  const [employeeId, setEmployeeId] = useState(() => sessionStorage.getItem("employeeId") || null);
  const [isadmin, setisadmin] = useState(() => sessionStorage.getItem("isadmin") === "true" || false);
  const [projectId, setProjectId] = useState(() => sessionStorage.getItem("projectId") || null);
  const [company_code, setcompany_code] = useState(() => sessionStorage.getItem("company_code") || null);
  const [taskId, setTaskID] = useState(() => sessionStorage.getItem("taskId") || null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(() => sessionStorage.getItem("currentEmployeeId") || null);
  const [currentTaskId, setCurrentTaskId] = useState(() => sessionStorage.getItem("currentTaskId") || null);

  // Sync employeeId to sessionStorage
  useEffect(() => {
    if (employeeId) {
      sessionStorage.setItem("employeeId", employeeId);
    } else {
      sessionStorage.removeItem("employeeId");
    }
  }, [employeeId]);

  // Sync isadmin to sessionStorage
  useEffect(() => {
    if (isadmin) {
      sessionStorage.setItem("isadmin", isadmin);
    } else {
      sessionStorage.removeItem("isadmin");
    }
  }, [isadmin]);

  // Sync projectId to sessionStorage
  useEffect(() => {
    if (projectId) {
      sessionStorage.setItem("projectId", projectId);
    } else {
      sessionStorage.removeItem("projectId");
    }
  }, [projectId]);

  // Sync company_code to sessionStorage
  useEffect(() => {
    if (company_code) {
      sessionStorage.setItem("company_code", company_code);
    } else {
      sessionStorage.removeItem("company_code");
    }
  }, [company_code]);

  // Sync taskId to sessionStorage
  useEffect(() => {
    if (taskId) {
      sessionStorage.setItem("taskId", taskId);
    } else {
      sessionStorage.removeItem("taskId");
    }
  }, [taskId]);

  // Sync currentEmployeeId to sessionStorage
  useEffect(() => {
    if (currentEmployeeId) {
      sessionStorage.setItem("currentEmployeeId", currentEmployeeId);
    } else {
      sessionStorage.removeItem("currentEmployeeId");
    }
  }, [currentEmployeeId]);

  // Sync currentTaskId to sessionStorage
  useEffect(() => {
    if (currentTaskId) {
      sessionStorage.setItem("currentTaskId", currentTaskId);
    } else {
      sessionStorage.removeItem("currentTaskId");
    }
  }, [currentTaskId]);

  return (
    <TaskContext.Provider value={{ taskId, setTaskID, currentTaskId, setCurrentTaskId }}>
      <ProjectContext.Provider value={{ projectId, setProjectId }}>
        <Employee.Provider
          value={{
            employeeId,
            setEmployeeId,
            isadmin,
            setisadmin,
            currentEmployeeId,
            setCurrentEmployeeId,
            company_code,
            setcompany_code,
          }}
        >
          <CustomerContext.Provider value={{ company_code, setcompany_code }}>
            {children}
          </CustomerContext.Provider>
        </Employee.Provider>
      </ProjectContext.Provider>
    </TaskContext.Provider>
  );
}

export default ContextProvider;
