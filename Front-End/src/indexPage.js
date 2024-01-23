
import { useEffect, useState } from "react";
import  { useContext} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";


export default function IndexPage(){
 // Access user information from the context
 const { setUserInfo, userInfo } = useContext(UserContext);

 // Extract the user name from user information
 const userName = userInfo?.userName;

 // State variable to store budget data
 const [data, setData] = useState(null);

 // Assign api_url for deplyoment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
 // useEffect to fetch user profile data when the component mounts or setUserInfo changes
 useEffect(() => {
  if (userName){
   fetch(`${API_URL}/profile`, {
     credentials: "include",
   }).then((response) => {
     response.json().then((userInfo) => {
       setUserInfo(userInfo); // Update user information in the context
     });
   });
  }
 },[userName, setUserInfo]); 

 // Function to fetch budget data
 const fetchData = async () => {
  if (userName){
   try {
     // Fetch request to the budget endpoint using the userName
     const response = await fetch(`${API_URL}/budget/${userName}`);
     const fetchedData = await response.json();
     setData(fetchedData); 

   } catch (error) {
     // Log any errors that occur during the fetch
     console.error("Error fetching data:", error.message);
   }
  }
 };

 // useEffect to fetch budget data when the component mounts or userName changes
 useEffect(() => {
   fetchData(); 
 }, [userName]); 



   return(
<div className= "text-black p-10 text-center">
  <h1 className="text-3xl font-bold mb-4">Welcome to Savvy Saver</h1>
  <p className="text-lg">
    Manage your finances with ease using our intuitive budgeting application.
    Keep track of your expenses, set financial goals, and achieve financial success.
  </p>
  {/* Check if budget data exists */}
  {userName && (
    <>
      {data && data.incomes && data.expenses ? (
        <>
          {/* Render links for viewing current budget and deleting the budget */}
          <Link
            to="/budget/complete"
            className="bg-green-700 text-white py-2 px-4 font-bold inline-block mt-4 hover:bg-gray-400 transition duration-300 mx-auto"
          >
            <span>View Current Budget</span>
          </Link>
        </>
      ) : (
        // Render link for creating a new budget
        <Link
          to="/budget"
          className="bg-green-700 text-white py-2 px-4 font-bold inline-block mt-4 hover:bg-gray-400 transition duration-300 mx-auto"
        >
          <span>Create New Budget</span>
        </Link>
      )}
    </>
  )}
  {!userName && (
    <>
    </>
  )}
     
</div>
  );
};
