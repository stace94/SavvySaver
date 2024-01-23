import {React, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import Logo from "./Logo/savvySaver.png";

export default function Header() {
   // useContext hook to access user information from UserContext
   const { setUserInfo, userInfo } = useContext(UserContext);

   // useNavigate hook from react-router-dom to programmatically navigate
   const navigate = useNavigate(); 
 
    // Assign api_url for deplyoment
    const API_URL =  process.env.URL;

   // Extract userName from userInfo, if it exists
   const userName = userInfo?.userName;
   
   // Async function to handle user logout
   async function logout() {
     await fetch(`${API_URL}/logout`, {
       credentials: "include",
       method: "POST",
     });
     
     setUserInfo(null);
     navigate('/login');
   }

  // Render the Header component
  return (
<header>
<nav className="flex items-center justify-between flex-wrap bg-green-900 p-3">
  {/* Logo and navigation links */}
  <div className="flex items-center flex-shrink-0 text-white">
    <Link to="/" className="flex items-center font-bold text-3xl tracking-tight">
      <img className="h-12 rounded-xl" src={Logo} alt="logo" />
      <span className="ml-2">Savvy Saver</span>
    </Link>
  </div>
  {/* Conditional rendering based on user authentication */}
  {userName && (
    <div className="flex items-center text-2xl text-white ml-4">
      {/* Display "Hello, userName" and the Logout button */}
      <span className="mr-10">Hello, {userName}</span>
      <button onClick={logout}>Logout</button>
    </div>
  )}
  {!userName && (
    // Render links for login and registration when the user is not authenticated
    <div className="flex gap-4 text-xl font-semibold text-white">
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  )}
</nav>
</header>

  );
}
