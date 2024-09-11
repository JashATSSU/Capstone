import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import ResortList from './components/ResortList'; // Ensure correct path
import ResortDetails from './components/ResortDetails'; // Ensure correct path
import Register from './components/Register'; // Ensure correct path
import Login from './components/Login'; // Ensure correct path
import FileUploader from './components/FileUploader'; // Ensure correct path
import { fetchResorts, fetchResort } from './api'; // Ensure correct path
import { useAuth } from './components/AuthProvider'; // Ensure correct path

function App() {
  const [resorts, setResorts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedResort, setSelectedResort] = useState(null);
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated); // Debug line
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const loadResorts = async () => {
        try {
          const data = await fetchResorts();
          if (Array.isArray(data)) {
            setResorts(data);
          } else {
            console.error('Unexpected data format:', data);
          }
        } catch (error) {
          console.error('Error loading resorts:', error);
        }
      };

      loadResorts();
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = async () => {
    try {
      const resortData = await fetchResort(search);
      if (resortData) {
        setResorts([resortData]);
      } else {
        console.error('No data found for the given search term');
      }
    } catch (error) {
      console.error('Error searching for resort:', error);
    }
  };

  const handleResortClick = (resort) => {
    setSelectedResort(resort);
    navigate(`/resort/${resort.id}`); // Ensure resort.id is the correct identifier
  };

  return (
    <div>
      <nav>
        <ul>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/upload">Upload File</Link>
              </li>
              <li>
                <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for resorts"
                />
                <button onClick={handleSearch}>Search</button>
                <ResortList resorts={resorts} onResortClick={handleResortClick} />
              </div>
            ) : (
              <div>Please log in to view resorts.</div>
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<FileUploader />} />
        <Route path="/resort/:id" element={<ResortDetails resort={selectedResort} />} />
      </Routes>
    </div>
  );
}

export default App;
