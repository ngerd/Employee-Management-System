import React from "react";
import { createContext, useState } from "react";

export const Employee = createContext(null);
export const ProjectContext = createContext(null);
export const TaskContext = createContext(null);

function ContextProvider({ children }) {
  const [employeeId, setEmployeeId] = useState(null);
  const [isadmin, setisadmin] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [taskId, setTaskID] = useState(null);

  return (
    <TaskContext.Provider 
    value={(
      taskId, 
      setTaskID)}>
      <ProjectContext.Provider
        value={{
          projectId,
          setProjectId,
        }}
      >
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
      </ProjectContext.Provider>
    </TaskContext.Provider>
  );
}

export default ContextProvider;
