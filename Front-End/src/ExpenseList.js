import  {React, useEffect, useState, useContext} from "react";
import {UserContext} from "./userContext";
import DeleteBudgetPopup from "./deleteBudgetPopup";
import {Link} from "react-router-dom";
import PurchasePopup from "./purchasePopUp";

const ExpenseList = () => {
  // State declarations
  const [selectedExpense, setSelectedExpense] = useState(null); // Tracks the selected expense
  const [subtractAmount, setSubtractAmount] = useState(''); // Amount to subtract from the expense
  const [remainingBalances, setRemainingBalances] = useState({}); // Stores remaining balances for each expense
  const [transactionLog, setTransactionLog] = useState([]); // Log of all transactions
  const [transactionDate, setTransactionDate] = useState(''); // Date of the transaction
  const [transactionDetail, setTransactionDetail] = useState(''); // Details of the transaction
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false); // Flag to confirm a purchase
  const [budgetData, setBudgetData] = useState({ // Initial budget data
    incomes: [],
    expenses: [],
    totalIncome: 0,
    amountLeft: 0,
  });
  const [showDeletePopup, setShowDeletePopup] = useState(false); // Flag to show/hide delete budget popup
  const [popupSelectedExpense, setPopupSelectedExpense] = useState(''); // Selected expense for popup
  const [showPurchasePopup, setShowPurchasePopup] = useState(false); // Flag to show/hide purchase popup

 // Assign api_url for deplyoment
 const API_URL = 'http://localhost:5000';

  // Context for user information
  const { userInfo } = useContext(UserContext);
  const userName = userInfo.userName;

   // Effect to fetch purchase data
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch(`${API_URL}/purchase/${userName}`);
        const data = await response.json();
        setTransactionLog(data);
      } catch (error) {
        console.error("Error fetching purchase data:", error.message);
      }
    };
  
    fetchPurchases();
  }, [userName]);
  
  // Effect to update budget data based on purchase log
  useEffect(() => {
    const fetchAndUpdateBudget = async () => {
      try {
        const response = await fetch(`${API_URL}/budget/${userName}`);
        let data = await response.json();
        console.log(data)
        // Update expenses based on the transaction log
        if (transactionLog && transactionLog.length > 0) {
          for (let logEntry of transactionLog) {
            let expense = data.expenses.find(e => e.name === logEntry.expense);
            if (expense) {
              expense.amount -= logEntry.amount; // Adjust the expense amount based on the transaction log
            }
          }
        }
        console.log(data)
        setBudgetData(data);
      } catch (error) {
        console.error("Error fetching budget data:", error.message);
      }
    };
   // Fetch and update the budget only if there are no transactions in the log
    if (transactionLog.length === 0) {
      fetchAndUpdateBudget();
    }
  }, [userName, transactionLog]);

  
  // Extract expenses from the budget data  
  const expenses = budgetData.expenses;

  // Function to get unique categories from the list of expenses
  const getCategories = (expenses) => {
    const categoriesSet = new Set(expenses.map(expense => expense.category));
    return Array.from(categoriesSet);
  };
  // Getting unique categories from the expenses
  const categories = Array.from(new Set(expenses.map(expense => expense.category)));

  // Organize expenses into groups by category
  const organizedExpenses = categories.map((currentCategory) => ({
    category: currentCategory,
    expenses: expenses.filter((expense) => expense.category === currentCategory),
  }));

   // Function to handle selection of an expense
   const handleExpenseSelection = (expense) => {
    setSelectedExpense(selectedExpense === expense ? null : expense);
    setSubtractAmount('');
  };

  // Function to handle change in subtract amount
  const handleSubtractAmountChange = (e) => {
    setSubtractAmount(e.target.value);
  };

  // Function to handle change in transaction detail
  const handleTransactionDetailChange = (e) => {
    setTransactionDetail(e.target.value);
  };

  // Function to handle change in transaction date
  const handleTransactionDateChange = (e) => {
    setTransactionDate(e.target.value);
  };


// Function to subtract amount from the selected expense in the popup
const handleSubtractFromExpense = () => {
  const expense = expenses.find(e => e.name === popupSelectedExpense);

  if (expense && subtractAmount) {
    const remainingBalance =
      (remainingBalances[expense.name] || expense.amount) - parseFloat(subtractAmount);

    const newRemainingBalances = {
      ...remainingBalances,
      [expense.name]: remainingBalance,
    };
    setRemainingBalances(newRemainingBalances);

    const transactionEntry = {
      expense: expense.name,
      amount: parseFloat(subtractAmount),
      remainingBalance,
      transactionDetail,
      transactionDate,
    };

    // Create a new transaction log array
    const newTransactionLog = [...transactionLog, transactionEntry];
    setTransactionLog(newTransactionLog);

    // Reset the states
    setSubtractAmount('');
    setTransactionDetail('');
    setTransactionDate('');

    return newTransactionLog; 
  }
  return null;
};

// Function to handle purchases
const handlePurchases = async () => {
  const newTransactionLog = handleSubtractFromExpense();
  if (newTransactionLog) {
    await submitPurchase(newTransactionLog); 
  }
  setPurchaseConfirmed(true);
  setSelectedExpense(null);
  setPopupSelectedExpense('');
  setShowPurchasePopup(false);
};

// Update the submitPurchase function to accept the transactionLog as a parameter
async function submitPurchase(updatedTransactionLog) {
  if (updatedTransactionLog && updatedTransactionLog.length > 0) {
    const method = updatedTransactionLog.length > 1 ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${API_URL}/purchase/${userName}` : `${API_URL}/purchase`;

    await fetch(url, {
      method: method,
      body: JSON.stringify(updatedTransactionLog),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

  // Function to delete budget
  async function deleteBudget() {
    try {
      await fetch(`${API_URL}budget/${userName}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Budget deleted successfully");
    } catch (error) {
      console.error("Error deleting budget:", error.message);
    }
  }
  
  // Handle change in popup
  const handlePopupExpenseChange = (e) => {
    setPopupSelectedExpense(e.target.value);
  };

  // Function to toggle the PurchasePopup
  const togglePurchasePopup = () => {
    if (!showPurchasePopup && expenses.length > 0) {
      // Set to the first expense's name when opening the popup
      setPopupSelectedExpense(expenses[0].name);
    }
    setShowPurchasePopup(!showPurchasePopup);
  };

    // JSX structure for the ExpenseList component
    return (
  
<div className="flex flex-col items-center justify-start min-h-screen bg-green-700 p-10 text-white space-y-8">
  <div className="border-b border-gray-200 dark:border-gray-700">
    <ul className="flex flex-wrap font-bold -mb-px text-lg font-medium-bold text-center text-gray-500 dark:text-gray-400">
      <li className="font-bold border-b-4 border-green-800">
        <Link
          to="/budget/complete"
          className="bg-white text-green-700 py-2 w-48 inline-block hover:hover:bg-gray-200 transition duration-300 mx-auto"
        >
          View Budget
        </Link>
      </li>
      <li className="border-b-4 border-green-800">
        <Link
          to="/purchase"
          className="bg-gray-400 text-green-700 py-2 w-48 inline-block hover:hover:bg-gray-200 transition duration-300 mx-auto"
        >
          Transactions
        </Link>
      </li>
    </ul>
  </div>

   {/* Container for displaying expenses by category */}
  <div className="flex flex-col items-center space-y-8 border-2 border-white p-8 w-96 bg-green-800">
  {organizedExpenses.map((expenseGroup, index) => (
    <div className="inline-block text-center" key={index}>
      <div>
        <h2 className="text-2xl font-bold border-b">
          {expenseGroup.category}
        </h2>
      </div>
      <ul>
        {expenseGroup.expenses.map((expense, expenseIndex) => (
          <li key={expenseIndex} className="flex justify-between items-center">
            <span className="mr-5">{expense.name}</span>
            <span>
              ${remainingBalances[expense.name] !== undefined
                ? remainingBalances[expense.name].toLocaleString()
                : expense.amount.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ))}
  {/* Button to trigger purchase popup */}
  <button
        className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-md mt-4"
        onClick={togglePurchasePopup}
      >
        Make Purchase
      </button>
    </div>
      {/* Purchase Popup component */}
      {showPurchasePopup && (
        <PurchasePopup
          showPopup={showPurchasePopup}
          handleClose={togglePurchasePopup}
          subtractAmount={subtractAmount}
          handleSubtractAmountChange={handleSubtractAmountChange}
          transactionDetail={transactionDetail}
          handleTransactionDetailChange={handleTransactionDetailChange}
          transactionDate={transactionDate}
          handleTransactionDateChange={handleTransactionDateChange}
          handlePurchases={handlePurchases}
          expenses={expenses}
          selectedExpense={popupSelectedExpense}
          handleExpenseChange={handlePopupExpenseChange}
        />
      )}
  {/* Container for transaction log */}
  <div className="flex flex-col items-center border-2 border-white p-8 w-96 bg-green-800">
    <h2 className="text-2xl font-bold mb-6 border-b">Transaction Log</h2>
     {/* Table for displaying transaction logs */}
    <table>
      <thead>
        <tr  className="border-b">
          <th className="pr-4">Expense</th>
          <th className="pr-4">Details</th>
          <th className="pr-4">Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactionLog.map((entry, entryIndex) => (
          <tr key={entryIndex}>
            <td>{entry.expense}</td>
            <td>{entry.transactionDetail}</td>
            <td>${entry.amount.toLocaleString()}</td>
            <td>{entry.transactionDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
{/* Button to trigger delete budget popup */}
  <button className="text-white bg-green-600 hover:bg-green-500 p-2 rounded-md " onClick={() => setShowDeletePopup(true)}>
  Delete Budget
</button>

  {/* DeleteBudgetPopup component */}
  <DeleteBudgetPopup onDelete={deleteBudget} showPopup={showDeletePopup} setShowPopup={setShowDeletePopup} />
</div>

  );
};

export default ExpenseList;
