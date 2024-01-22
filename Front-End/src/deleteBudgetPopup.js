import { React, useState } from 'react';
import { Navigate } from 'react-router-dom';

// The DeleteBudgetPopup component definition
const DeleteBudgetPopup = ({ onDelete, showPopup, setShowPopup }) => {
  // State to control redirection after an action
  const [redirect, setRedirect] = useState(false);

  // Function to handle the delete action
  const handleDelete = () => {
    onDelete(); // Calling the onDelete function passed as a prop
    setShowPopup(false); // Hiding the popup
    setRedirect(true); // Setting redirect to true to navigate away from the current page
  };

  // Redirecting to the home page after deletion
  if (redirect) {
    return <Navigate to={'/'} />;
  }

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

  // Styles for the popup content
  const contentStyles = {
    background: 'white',
    color: 'black',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  // Styles for the button container inside the popup
  const buttonContainerStyles = {
    display: 'flex',
    flexDirection: 'row',  
    gap: '10px',  
  };

  // The JSX for the popup
  return (
    <div style={popupStyles} onClick={() => setShowPopup(false)}>
      {/* Prevents the popup from closing when its content is clicked */}
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        <p>Are you sure you want to delete the budget?</p>
        <div style={buttonContainerStyles}>
          {/* Button to confirm deletion */}
          <button className="text-white bg-green-600 hover:bg-green-700 p-2 mt-5 rounded-md" onClick={handleDelete}>
            Yes
          </button>
          {/* Button to cancel and close the popup */}
          <button className="text-white bg-green-600 hover:bg-green-700 p-2 mt-5 rounded-md" onClick={() => setShowPopup(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBudgetPopup;
