const fetchData = async (userName, callback) => {

  // Assign api_url for deplyoment
 const API_URL = 'http://localhost:5000';

  try {
    const response = await fetch(`${API_URL}/budget/${userName}`);
    const fetchedData = await response.json();
    
    // Execute the callback with the fetched data
    callback(fetchedData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

export default fetchData;
