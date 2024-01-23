// Import the useState hook from React
import { useState } from "react";
import { Navigate } from "react-router-dom";

// Define the RegisterPage component
export default function RegisterPage() {
  // State variables to manage user input (username and password)
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    // Assign api_url for deplyoment
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    
  // Async function to handle the registration process
  async function register(e) {
    // Prevent the default form submission behavior
    e.preventDefault();
  
    try {
      // Send a POST request to the registration endpoint with user credentials
      const response =  await fetch(`${API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({userName, password}),
        headers: {'Content-Type': 'application/json'},
      });

      // Check the status code of the response to determine the registration result
      if (response.ok) {
        // If successful, display an alert with a success message
        alert("Registration successful");
        setRedirect(true);
      } else {
        // If unsuccessful, display an alert with a failure message
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      // Handle unexpected errors during the registration process
      console.error("Error during registration:", error);
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

  // Render the registration form
  return (
    <form className="max-w-md mx-auto m-4 p-6 bg-white rounded-md shadow-md" onSubmit={register}>
      <h1  className="text-2xl font-semibold mb-4">Register</h1>

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

      {/* Submit button for the registration form */}
      <button className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
       type="submit" 
       disabled={loading}>
        {loading ? "Registering..." : "Register"}
        </button>

       {/* Display error message if there is an error */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
