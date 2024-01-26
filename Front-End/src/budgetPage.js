import {React, useEffect, useState, useContext} from "react";
import { Link} from "react-router-dom";
import { UserContext } from "./userContext";
import DeleteBudgetPopup from "./deleteBudgetPopup";

// The main functional component for the Budget Page
export default function BudgetPage() {
  // State to store budget data including incomes, expenses, and author
  const [budgetData, setBudgetData] = useState({ incomes: [], expenses: [], author: '' });
  // Using UserContext to access user information
  const { userInfo } = useContext(UserContext);
  // State to control the visibility of the delete budget popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Extracting the username from userInfo, defaulting to an empty string if userInfo is undefined
  const userName = userInfo?.userName || '';

  // Assign api_url for deplyoment
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  // useEffect hook to fetch budget data when the component mounts or userName changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching budget data from the backend for the logged-in user
        const response = await fetch(`${API_URL}/budget/${userName}`);
        const data = await response.json();
        // Updating the state with the fetched budget data
        setBudgetData(data);
      } catch (error) {
        // Handling errors during fetch and logging to the console
        console.error("Error fetching data:", error.message);
      }
    };

    // Calling fetchData to execute the data fetching
    fetchData();
  }, [userName]); // Dependency array with userName to re-run the effect when userName changes

  // Destructuring budget data for easy access
  const { incomes, expenses, totalIncome, amountLeft } = budgetData;

  // Function to get unique categories from the expenses
  const getCategories = (expenses) => {
    const categoriesSet = new Set(expenses.map(expense => expense.category));
    return Array.from(categoriesSet);
  };

  // Organizing expenses by category
  const organizedExpenses = getCategories(expenses).map((currentCategory) => ({
    category: currentCategory,
    expenses: expenses.filter((expense) => expense.category === currentCategory),
  }));

  // Async function to delete the budget
  async function deleteBudget() {
    try {
      // Sending a DELETE request to the backend to delete the budget
      await fetch(`${API_URL}/budget/${userName}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Budget deleted successfully");
    } catch (error) {
      // Handling errors during deletion and logging to the console
      console.error("Error deleting budget:", error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-green-700 p-10 text-white space-y-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap font-bold -mb-px text-lg font-medium-bold text-center text-gray-500 dark:text-gray-400">
            <li className= "font-bold border-b-4 border-green-800">
              <Link
                to="/budget/complete"
                className="bg-gray-400 text-green-700 py-2 w-48 inline-block hover:hover:bg-gray-200 transition duration-300 mx-auto"
              >
                Budget
              </Link>
            </li>
            <li className= "border-b-4  border-green-800">
              <Link
                to="/purchase"
                className="bg-white text-green-700 py-2 w-48 inline-block  hover:bg-gray-200 transition duration-300 mx-auto"
              >
                View Transactions
              </Link>
            </li>
          </ul>
        </div>

     
       {/* Container for budget details */}
      <div className="flex flex-col items-center space-y-8">
        {/* Section displaying monthly income streams */}
        <div className="flex flex-col items-center border-2 border-white p-8 w-96 bg-green-800">
          <h2 className="text-2xl font-bold border-b">Monthly Income Sources</h2>
          <ul className="text-center">
            {/* Mapping over incomes to list each income stream */}
            {incomes.map((incomeItem, index) => (
              <li className="mb-2" key={index}>
                {incomeItem.incomeStream}: ${incomeItem.income.toLocaleString()}
              </li>
            ))}
          </ul>
             {/* Display total monthly income */}
          <div className="text-2xl text-center mt-6 ">
            <label className="border-b font-bold">Total Monthly Pay</label>
            <p className="text-white text-center">${totalIncome}</p>
          </div>
        </div>
          {/* Section displaying expenses */}
        <div className="flex flex-col items-center border-2 border-white p-8 w-96 bg-green-800">
             {/* Check if there are expenses and map over them */}
          {expenses.length > 0 ? (
            <div>
              {getCategories(expenses).map((category, index) => (
                <div className="mb-2" key={index}>
                  <h3 className="text-2xl font-bold text-center border-b">{category}</h3>
                  <ul>
                     {/* List each expense under its respective category */}
                    {expenses
                      .filter(expense => expense.category === category)
                      .map((expense, expenseIndex) => (
                        <li key={expenseIndex} className="text-sm flex items-center justify-between">
                        <div className="flex pr-10 items-center">
                          <span className="text-sm">{expense.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-white">${expense.amount.toLocaleString()}</span>
                        </div>
                      </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No expenses available.</p>
          )}
        </div>
      {/* Section showing the total amount left after expenses */}
        <div className="flex flex-col items-center border-2 border-white p-8 w-96 bg-green-800">
          <h2 className="text-2xl font-bold border-b">Total Left</h2>
          <p className="text-white text-center">${amountLeft}</p>
        </div>
      </div>
      {/* Button to trigger the delete budget popup */}
    <button className="text-white bg-green-600 hover:bg-green-500 p-2 rounded-md" onClick={() => setShowDeletePopup(true)}>
      Delete Budget
    </button>

     {/* Delete Budget Popup component */}
    <DeleteBudgetPopup onDelete={deleteBudget} showPopup={showDeletePopup} setShowPopup={setShowDeletePopup} />
    </div>
    
  );
}
