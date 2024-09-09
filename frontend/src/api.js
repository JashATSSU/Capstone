import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Fetch all resorts
export const fetchResorts = async () => {
  try {
    const response = await axios.get(`${API_URL}/ski-resorts`);
    console.log("API response:", response.data); // Log the response data
    return response.data; // Ensure this is an array or contains an array
  } catch (error) {
    console.error('Error fetching resorts:', error.message); // Detailed logging
    return []; // Return an empty array in case of error
  }
};

// Fetch a specific resort by slug
export const fetchResort = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/ski-resorts/${slug}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching resort:', error.message); // Detailed logging
    return null; // Return null to indicate no data was fetched
  }
};
