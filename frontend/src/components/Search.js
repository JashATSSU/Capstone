import React, { useEffect, useState } from 'react';
import { fetchResorts } from '../api';
import '../styles/Search.css'; // Assuming you have a CSS file for additional styles

function Search() {
  const [resorts, setResorts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResorts, setFilteredResorts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchResorts();
      setResorts(data);
      setFilteredResorts(data); // Initialize filteredResorts with fetched data
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter resorts based on the search term
    const results = resorts.filter(resort =>
      resort.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResorts(results);
  }, [searchTerm, resorts]);

  return (
    <div className="search-container">
      <h1>Search for Ski Resorts</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by resort name"
        className="search-input"
      />
      <ul className="resort-list">
        {filteredResorts.length ? (
          filteredResorts.map((resort) => (
            <li key={resort.id} className="resort-item">
              {resort.name}
            </li>
          ))
        ) : (
          <li className="resort-item">No resorts found</li>
        )}
      </ul>
    </div>
  );
}

export default Search;
