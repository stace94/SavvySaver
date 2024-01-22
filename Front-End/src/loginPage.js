// Import necessary hooks and components from React and React Router
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./userContext";

// Define the LoginPage component
export default function LoginPage() {
  // State variables to manage user input, redirection, loading state, and error messages
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Access the user context to update user information
  const { setUserInfo } = useContext(UserContext);

  // Assign api_url for deplyoment
   const API_URL = 'http://localhost:5000';

  // Function to handle the login process
  async function login(e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Set loading state to true while processing the login request
    setLoading(true);

    try {
      // Send a POST request to the login endpoint with user credentials
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ userName, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      // Check if the login was successful (status code 2xx)
      if (response.ok) {
        // Parse the response data and update user information
        alert("Login successful");
        const userData = await response.json();
        setUserInfo(userData);
        setRedirect(true);
      } else {
        // If the login was unsuccessful, retrieve and set the error message
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      // Handle unexpected errors during the login process
      console.error("Error during login:", error);
      setError("An unexpected error occurred");
    } finally {
      // Set loading state back to false after processing is complete
      setLoading(false);
    }
  }

  // If the redirection flag is true, navigate to the home page
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  // Render the login form
  return (
    <form className="max-w-md mx-auto m-4 p-6 bg-white rounded-md shadow-md" onSubmit={login}>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      {/* Input field for the username */}
      <input
        className="w-full p-2 mb-4 border rounded-md"
        type="text"
        placeholder="username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      {/* Input field for the password */}
      <input
        className="w-full p-2 mb-4 border rounded-md"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Submit button for the login form, disabled when loading */}
      <button
        className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
        type="submit" 
       disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Display error message if there is an error */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
