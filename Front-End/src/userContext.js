// Import necessary hooks from React
import { createContext, useState } from "react";

// Create a context to manage user information
export const UserContext = createContext({});

// Create a provider component for the UserContext
export function UserContextProvider({ children }) {
  // State variable to store user information
  const [userInfo, setUserInfo] = useState({});

  // Render the UserContext.Provider with the provided value and nested children
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
