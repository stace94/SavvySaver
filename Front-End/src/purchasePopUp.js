import React from 'react';

const PurchasePopup = ({
  showPopup,
  handleClose,
  subtractAmount,
  handleSubtractAmountChange,
  transactionDetail,
  handleTransactionDetailChange,
  transactionDate,
  handleTransactionDateChange,
  handlePurchases,
  expenses,
  selectedExpense, 
  handleExpenseChange 
}) => {
   // Styles for the popup overlay
  const popupStyles = {
    display: showPopup ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  };
 // Styles for the popup content box
  const contentStyles = {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={popupStyles} onClick={handleClose}>
      {/* Prevents closing the popup when clicking on its content */}
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        <div className="text-black flex flex-col items-center space-y-2">
          <label className="text-black text-lg mb-2 text-center">Purchase Details</label>

          <label className="text-lg mb-2">Select Expense:</label>
          <select
            className="mb-2 p-2 border text-black"
            value={selectedExpense}
            onChange={handleExpenseChange}
          >
            {expenses.map((expense, index) => (
              <option key={index} value={expense.name}>
                {expense.name}
              </option>
            ))}
          </select>

          <label className="text-lg mb-2">Purchase Amount:</label>
          <input
            className="mb-2 p-2 border text-black"
            type="number"
            placeholder="Enter Purchase Amount"
            value={subtractAmount}
            onChange={handleSubtractAmountChange}
          />

          <label className="text-lg mb-2">Purchase Details:</label>
          <input
            className="mb-2 p-2 border text-black"
            type="text"
            placeholder="Enter Purchase Details"
            value={transactionDetail}
            onChange={handleTransactionDetailChange}
          />

          <label className="text-lg mb-2">Purchase Date:</label>
          <input
            className="mb-2 p-2 border text-black"
            type="date"
            placeholder="Enter Purchase Date"
            value={transactionDate}
            onChange={handleTransactionDateChange}
          />

          <button className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-md" onClick={handlePurchases}>
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePopup;
