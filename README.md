# SavvySaver Budgeting App

## Description
The Savvy Saver Budgeting App is an intuitive and comprehensive tool designed to help users effectively manage their finances. It facilitates secure user registration and login, and provides functionalities to create budgets, log purchases, and view financial summaries.

## Backend
- **Framework**: Built using Node.js with Express.js.
- **Database**: Uses MongoDB with Mongoose for object data modeling.
- **Authentication**: JWT is used for secure user authentication.
- **Security**: Implements bcrypt.js for password hashing.
- **File Handling**: Utilizes multer and fs modules.
- **Environment Variables**: Configured with variables for database URL, JWT secret key, and server port.

### Key Backend Functionalities
- **User Authentication**: Handles user registration and login processes.
- **Data Handling**: Manages CRUD operations for budgets and purchases.
- **Security**: Ensures data integrity and secure access.

### API Endpoints
- Registration, login, user profile, logout.
- Budget and purchase creation, updates, retrieval, and deletion.

## Frontend
- **Framework**: Developed using ReactJS.
- **State Management**: Utilizes React Hooks and Context API.
- **User Interface**: Responsive design with interactive elements.

### Key Frontend Functionalities
- **User Account Management**: Allows users to register, log in, and manage their profiles.
- **Budget Management**: Users can create, view, and delete their budgets. This includes adding income streams, expenses, and categorizing them.
- **Expense Tracking**: Provides functionalities to log transactions against expenses and view a transaction log.
- **Interactive Components**: Includes popups and forms for user input and confirmations.

### Pages and Components
- **Budget Creation Page**: 
  - Dynamic income and expense management.
  - User-friendly UI for inputting and organizing financial data.
  - Real-time calculation of total income and remaining budget.
- **Budget View Page**: 
  - Display of Monthly Incomes and Expenses.
  - Real-time Financial Overview.
  - Category-wise Expense Organization.
  - Deletion of Budget.
- **Transaction Log Page**: 
  - Expense Tracking.
  - Dynamic Transaction Log.
  - Real-time Budget Adjustment.
  - Interactive Popups.

## Deployment
The application is deployed at [https://Savvy-saver.onrender.com](https://Savvy-saver.onrender.com).

## License
This project is released under the MIT License.
