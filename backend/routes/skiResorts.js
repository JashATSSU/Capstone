const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/ski-resorts', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching ski resorts:', error);
    res.status(500).json({ message: 'Error fetching ski resorts data', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
