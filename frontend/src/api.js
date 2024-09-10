// Fetch all resorts
export const fetchResorts = async () => {
  try {
    const response = await axios.get(`${API_URL}/ski-resorts`);
    console.log("API response:", response.data); // Log the response data for debugging

    // Ensure the response data is an array
    if (!Array.isArray(response.data)) {
      console.warn('Unexpected data format:', response.data); // Log unexpected data format
      return []; // Return an empty array if data format is not as expected
    }

    return response.data; 
  } catch (error) {
    console.error('Error fetching resorts:', error.response ? error.response.data : error.message); // Detailed logging
    return []; // Return an empty array in case of error
  }
};

// Fetch a specific resort by slug
export const fetchResort = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/ski-resorts/${slug}`);
    console.log("Resort data:", response.data); // Log the response data for debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching resort:', error.response ? error.response.data : error.message); // Detailed logging
    return null; // Return null to indicate no data was fetched
  }
};
