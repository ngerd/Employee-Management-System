// import React from "react";
// import { createContext, useState } from "react";

// export const Employee = createContext(null);
// export const ProjectContext = createContext(null);
// export const TaskContext = createContext(null);

// function ContextProvider({ children }) {
//   const [employeeId, setEmployeeId] = useState(null);
//   const [isadmin, setisadmin] = useState(false);
//   const [projectId, setProjectId] = useState(null);
//   const [taskId, setTaskID] = useState(null);

//   return (
//     <TaskContext.Provider 
//     value={(
//       taskId, 
//       setTaskID)}>
//       <ProjectContext.Provider
//         value={{
//           projectId,
//           setProjectId,
//         }}
//       >
//         <Employee.Provider
//           value={{
//             employeeId,
//             setEmployeeId,
//             isadmin,
//             setisadmin,
//           }}
//         >
//           {children}
//         </Employee.Provider>
//       </ProjectContext.Provider>
//     </TaskContext.Provider>
//   );
// }

// export default ContextProvider;



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

  return (
    <TaskContext.Provider value={{ taskId, setTaskID }}>
      <ProjectContext.Provider value={{ projectId, setProjectId }}>
        <Employee.Provider value={{ employeeId, setEmployeeId, isadmin, setisadmin }}>
          {children}
        </Employee.Provider>
      </ProjectContext.Provider>
    </TaskContext.Provider>
  );
}

export default ContextProvider;
