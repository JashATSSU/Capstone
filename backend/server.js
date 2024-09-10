const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  
  // Replace with actual database logic
  // Here you should save the user to the database
  
  res.status(201).send('User registered');
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Replace with actual user fetching logic from the database
  // Here you should fetch the user and compare passwords
  
  // Example user object
  const user = { email: 'user@example.com', password: bcrypt.hashSync('password', 8) };

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post('/api/upload', authenticateJWT, upload.single('file'), (req, res) => {
  res.json({ fileUrl: req.file.location });
});

app.get('/api/ski-resorts', async (req, res) => {
  try {
    const response = await axios.get('https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort', {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com'
      }
    });

    const newEnglandResorts = response.data.filter(resort =>
      ["NH", "VT", "ME", "MA", "CT"].includes(resort.region)
    );

    res.json(newEnglandResorts);
  } catch (error) {
    console.error('Error fetching ski resorts:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching ski resorts data' });
  }
});

app.get('/api/ski-resorts/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const [resortResponse, liftStatusResponse, weatherResponse, snowConditionsResponse] = await Promise.all([
      axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${slug}`, {
        headers: { 'x-rapidapi-key': process.env.RAPIDAPI_KEY, 'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com' }
      }),
      axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${slug}/lifts`, {
        headers: { 'x-rapidapi-key': process.env.RAPIDAPI_KEY, 'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com' }
      }),
      axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${slug}/weather`, {
        headers: { 'x-rapidapi-key': process.env.RAPIDAPI_KEY, 'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com' }
      }),
      axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${slug}/snow`, {
        headers: { 'x-rapidapi-key': process.env.RAPIDAPI_KEY, 'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com' }
      })
    ]);

    res.json({
      resort: resortResponse.data,
      liftStatus: liftStatusResponse.data,
      weather: weatherResponse.data,
      snowConditions: snowConditionsResponse.data
    });
  } catch (error) {
    console.error('Error fetching resort details:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching resort details' });
  }
});

// Middleware to proxy API requests to React Development Server
app.use((req, res, next) => {
  if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
