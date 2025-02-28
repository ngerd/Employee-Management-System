import React from "react";
import { createContext, useState } from "react";

export const LoginContext = createContext(null);
export const LoginPageContext = createContext(null);
export const UserContext = createContext(null);

function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [duringLogin, setDuringLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <LoginPageContext.Provider
        value={{
          duringLogin,
          setDuringLogin,
        }}
      >
        <LoginContext.Provider
          value={{
            isLogin,
            setIsLogin,
          }}
        >
          {children}
        </LoginContext.Provider>
      </LoginPageContext.Provider>
    </UserContext.Provider>
  );
}

export default ContextProvider;
