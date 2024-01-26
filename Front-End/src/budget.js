import { React, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./userContext";
import NewCatPopup from "./newCatPopUp.js";
import EditCatPopUp from "./editCat.js";

// Define the Budget functional component
const Budget = () => {
  // State variables to manage the budget data and UI states
  const [redirect, setRedirect] = useState(false); // Controls redirection after budget submission
  const [expenses, setExpenses] = useState([]); // Stores the list of expenses
  const [name, setName] = useState(''); // Stores the name of the current expense
  const [amount, setAmount] = useState(''); // Stores the amount of the current expense
  const [category, setCategory] = useState(''); // Stores the category of the current expense
  const [income, setIncome] = useState(''); // Stores the income amount
  const [incomeStream, setIncomeStream] = useState(''); // Stores the income stream name
  const [incomes, setIncomes] = useState([]); // Stores the list of income streams
  const [totalIncome, setTotalIncome] = useState(0); // Stores the total income calculated
  const [amountLeft, setAmountLeft] = useState(0); // Stores the remaining amount after expenses
  const [categories, setCategories] = useState(['Essentials', 'Non-Essentials', 'Other']); // Predefined categories for expenses
  const [editingCategory, setEditingCategory] = useState(''); // Stores the category currently being edited
  const [newCategory, setNewCategory] = useState(''); // Stores the new category name to be added
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false); // Flag for showing the new category input field
  const [showPopup, setShowPopup] = useState(false); // Flag for showing popups


 // Assign api_url for deplyoment
 const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
 
  // Context for accessing and updating user information
  const { setUserInfo, userInfo } = useContext(UserContext);

  // Function to handle adding a new expense
  const addExpense = () => {
    if (name && amount && category) {
      const validCategories = getValidCategories();
      const expenseCategory = validCategories.includes(category) ? category : 'Other';
      setExpenses([...expenses, { name, amount: parseFloat(amount), category: expenseCategory }]);
      setAmountLeft(amountLeft - parseFloat(amount));
      setName('');
      setAmount('');
      setCategory('');
    }
  };

  // Function to handle adding a new income
  const addIncome = () => {
    if (incomes && incomeStream && income) {
      setIncomes([...incomes, { incomeStream, income: parseFloat(income) }]);
      setTotalIncome(totalIncome + parseFloat(income));
      setAmountLeft(amountLeft + parseFloat(income));
      setIncome('');
      setIncomeStream('');
    }
  };

  // Function to remove an income stream
  const removeIncome = (index) => {
    const updatedIncomes = [...incomes];
    const removedIncome = updatedIncomes.splice(index, 1)[0];
    setIncomes(updatedIncomes);
    setTotalIncome(totalIncome - removedIncome.income);
    setAmountLeft(amountLeft - removedIncome.income);
  };

  // Function to remove an expense
  const removeExpense = (expenseToRemove) => {
    const updatedExpenses = expenses.filter(expense => expense !== expenseToRemove);
    setExpenses(updatedExpenses);
    setAmountLeft(amountLeft + expenseToRemove.amount);
  };

  // Function to get a list of all unique categories from expenses
  const getValidCategories = () => {
    const categoriesFromExpenses = expenses.map((expense) => expense.category);
    return [...new Set([...categoriesFromExpenses, ...categories])];
  };

  // Function to initiate editing of a category
  const editCategory = (oldCategory) => {
    setEditingCategory(oldCategory);
    setNewCategory(oldCategory);
  };

  // Function to save the edited category and update the expenses
  const saveEditedCategory = () => {
    if (editingCategory && newCategory) {
      const updatedCategories = categories.map((cat) => (cat === editingCategory ? newCategory : cat));
      setCategories(updatedCategories);
      const updatedExpenses = expenses.map((expense) => {
        if (expense.category === editingCategory) {
          return { ...expense, category: newCategory };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
      setEditingCategory('');
    }
  };

  // Function to add a new category to the list
  const addNewCategory = () => {
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  // Async function to create and submit the budget to the backend
  const createBudget = async () => {
    const data = { incomes, expenses, totalIncome, amountLeft };
    const response = await fetch(`${API_URL}/budget`, {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      fetch(`${API_URL}/profile`, {
        credentials: 'include',
      }).then((response) => {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
        });
      });

      setRedirect(true);
    }
  };

  // Redirect to a different page upon successful budget submission
  if (redirect) {
    return <Navigate to={'/budget/complete'} />;
  }

  return (
   // Main container for the Budget component
<div className="flex flex-col items-center justify-center min-h-screen bg-green-700 p-10 text-white space-y-8">
  
  {/* Container for the Income section */}
  <div className="flex flex-col items-center border-2 border-white p-8 w-96 bg-green-800">
    {/* Title for the Income section */}
    <h2 className="text-3xl font-bold mb-6 text-center border-b">Income</h2>

    {/* Input field for Income Stream */}
    <div className="flex flex-col mb-6 space-y-4 items-center">
      <label className="text-lg">Income Source</label>
      <input 
        className="mb-2 p-2 border text-black" 
        type="text" 
        value={incomeStream} 
        onChange={(e) => setIncomeStream(e.target.value)} 
      />
    </div>

    {/* Input field for Income Amount */}
    <div className="flex flex-col mb-6 space-y-4 items-center">
      <label className="text-lg">Amount</label>
      <input 
        className="mb-2 p-2 border text-black" 
        type="number" 
        value={income} 
        onChange={(e) => setIncome(parseFloat(e.target.value))} 
      />
    </div>

    {/* Button to submit the Income */}
    <button 
      className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-md" 
      onClick={addIncome}
    >
      Enter Income
    </button>

    {/* Display of Monthly Income Streams */}
    <h3 className="text-2xl font-bold text-center mt-6 border-b">Monthly Income Streams</h3>
    <ul className="text-center">
      {incomes.map((incomeItem, index) => (
        <li className="mb-2" key={index}>
          {incomeItem.incomeStream}: ${incomeItem.income.toLocaleString()}
          {/* Button to remove an Income Stream */}
          <button className="remove ml-2" onClick={() => removeIncome(index)}>
            <strong>x</strong>
          </button>
        </li>
      ))}
    </ul>

    {/* Display of Total Monthly Pay */}
    <h3 className="text-2xl font-bold text-center mt-6 border-b">Total Monthly Pay</h3>
    <p className="text-white text-center">${totalIncome.toLocaleString()}</p>
  </div>

  {/* Container for the Expenses section */}
  <div className="flex flex-col items-center border-2 border-white p-8 w-96 bg-green-800">
    {/* Title for the Expenses section */}
    <h2 className="text-3xl font-bold mb-6 text-center border-b">Expenses</h2>

    {/* Input fields and buttons for adding Expenses */}
    <div className="flex flex-col mb-6 space-y-4 items-center">
      {/* Input for Expense Name */}
      <div className="flex flex-col items-center">
        <label className="text-lg mb-2 text-center">Expense Name</label>
        <input 
          className="mb-2 p-2 border text-black" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>

      {/* Input for Expense Amount */}
      <div className="flex flex-col items-center">
        <label className="text-lg mb-2 text-center">Amount</label>
        <input 
          className="mb-2 p-2 border text-black" 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
      </div>

      {/* Dropdown for selecting Expense Category */}
      <div className="flex flex-col items-center">
        <label className="text-lg mb-2 text-center">Category</label>
        <div class="relative inline-flex items-center">
          <select
            className="mb-2 p-2 border text-black bg-white dark:text-black"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {getValidCategories().map((validCategory, index) => (
              <option key={index} value={validCategory}>
                {validCategory}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons for adding new category and adding expense */}
      <div className="flex items-center">
        <button 
          className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-md mb-2 mr-2" 
          onClick={() => setShowPopup(true)}
        >
          Add New Category
        </button>
        <button 
          className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-md mb-2" 
          onClick={addExpense}
        >
          Add Expense
        </button>
        {/* Popup Component for adding a new category */}
        <NewCatPopup
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          addNewCategory={addNewCategory}
        />
      </div>
    </div>

    {/* Displaying Expenses categorized */}
    {getValidCategories().map((currentCategory, index) => (
      <div key={index} className="mb-4 relative">
        <div className="flex items-center justify-between border-b">
          <h3 className="text-2xl font-bold text-center mr-10">{currentCategory}</h3>
          {/* Button to edit a category */}
          <button className="hover:text-green-400" onClick={() => editCategory(currentCategory)}>
            {/* SVG for Edit Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" viewBox="0 0 512 512">
              {/* Path for SVG */}
              <path
                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                fill="#fff"
              />
            </svg>
          </button>
        </div>
        <ul>
          {expenses
            .filter((expense) => expense.category === currentCategory)
            .map((expense, expenseIndex) => (
              <li key={expenseIndex} className="text-sm flex items-center justify-between">
                <div className="flex pr-10 items-center">
                  <span className="text-sm">{expense.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white">${expense.amount.toLocaleString()}</span>
                  {/* Button to remove an expense */}
                  <button className="remove ml-2" onClick={() => removeExpense(expense)}>
                    <strong>x</strong>
                  </button>
                </div>
              </li>
          ))}
        </ul>
        {/* Popup Component for editing a category */}
        <EditCatPopUp 
          showPopup={editingCategory === currentCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          saveEditedCategory={saveEditedCategory}
        />
      </div>
    ))}
  </div>

  {/* Container for displaying the total amount left */}
  <div className="flex flex-col items-center justify-center border-2 border-white p-8 w-96 bg-green-800">
    <h2 className="text-2xl font-bold mb-4 border-b">Total Left</h2>
    <p className="text-white text-center">${amountLeft.toLocaleString()}</p>
  </div>

  {/* Submit button for the budget */}
  <button 
    className="bg-white text-green-700 py-2 px-4 inline-block mt-4 hover:bg-gray-300 transition duration-300  w-96 p-2 rounded-md" 
    onClick={createBudget}>
       
        Submit
      </button>
    </div>
  );
};

export default Budget;
