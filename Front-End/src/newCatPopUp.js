import React from 'react';

const NewCatPopup = ({ showPopup, setShowPopup, newCategory, setNewCategory, addNewCategory }) => {
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
    <div style={popupStyles} onClick={() => setShowPopup(false)}>
    {/* Prevents closing the popup when clicking on its content */}
    <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col items-center space-y-2">
        <label className="text-black text-lg mb-2 text-center">New Category</label>
        <input
          className="mb-2 p-2 border text-black"
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)} // Update newCategory state on change
        />
        {/* Button to add the new category */}
        <button
          className="text-white bg-green-600 hover:bg-green-700 p-2 rounded-md ml-2"
          onClick={addNewCategory} // Call addNewCategory function when clicked
        >
          Add New Category
        </button>
      </div>
    </div>
  </div>
  );
};

export default NewCatPopup;
