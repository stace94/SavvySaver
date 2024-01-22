// Import necessary styles and components
import Budget from './budget';
import LoginPage from "./loginPage";
import { Route, Routes } from "react-router-dom";
import { UserContextProvider } from './userContext.js';
import RegisterPage from './registrationPage.js';
import Layout from "./layout.js";
import IndexPage from "./indexPage.js"
import BudgetPage from "./budgetPage.js";
import ExpenseList from "./ExpenseList.js";



// Define the main functional component App
function App() {
  // Return the JSX structure
  return (
    <UserContextProvider>
      {/* Use React Router's Routes and Route components to define navigation */}
      <Routes>
        {/* Main layout component as the root route */}
        <Route path="/" element={<Layout />}>
          {/* Index page component */}
          <Route  index element={<IndexPage />} />
          {/* Login page component */}
          <Route path="/login" element={<LoginPage />} />
          {/* Register page component */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Budget component */}
          <Route path="/budget" element={<Budget />} />
          {/* BudgetPage component */}
          <Route path="/budget/complete" element={<BudgetPage />} />
          {/* ExpenseList component */}
          <Route path="/purchase" element={<ExpenseList />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

// Export the App component for use in other files
export default App;
