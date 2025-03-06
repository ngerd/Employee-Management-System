import React, { createContext, useState, useEffect } from "react";

export const Employee = createContext(null);
export const ProjectContext = createContext(null);
export const TaskContext = createContext(null);

function ContextProvider({ children }) {
  const [employeeId, setEmployeeId] = useState(() => {
    return sessionStorage.getItem("employeeId") || null;
  });

  const [isadmin, setisadmin] = useState(() => {
    return sessionStorage.getItem("isadmin") === "true";
  });

  const [projectId, setProjectId] = useState(() => {
    return sessionStorage.getItem("projectId") || null;
  });

  const [taskId, setTaskID] = useState(() => {
    return sessionStorage.getItem("taskId") || null;
  });

  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("employeeId", employeeId);
  }, [employeeId]);

  useEffect(() => {
    sessionStorage.setItem("isadmin", isadmin);
  }, [isadmin]);

  useEffect(() => {
    sessionStorage.setItem("projectId", projectId);
  }, [projectId]);

  useEffect(() => {
    sessionStorage.setItem("taskId", taskId);
  }, [taskId]);

  useEffect(() => {
    sessionStorage.setItem("currentEmployeeId", currentEmployeeId);
  }, [currentEmployeeId]);

  useEffect(() => {
    sessionStorage.setItem("currentTaskId", currentTaskId);
  }, [currentTaskId]);

  return (
    <TaskContext.Provider value={{ taskId, setTaskID, currentTaskId, setCurrentTaskId }}>
      <ProjectContext.Provider value={{ projectId, setProjectId }}>
        <Employee.Provider value={{ employeeId, setEmployeeId, isadmin, setisadmin, currentEmployeeId, setCurrentEmployeeId }}>
          {children}
        </Employee.Provider>
      </ProjectContext.Provider>
    </TaskContext.Provider>
  );
}

export default ContextProvider;
