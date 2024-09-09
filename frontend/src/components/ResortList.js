import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import './ResortList.css';

const ResortList = ({ resorts = [], onResortClick }) => {
  if (!Array.isArray(resorts)) {
    console.error('Resorts is not an array:', resorts);
    return <div>Unexpected data format</div>;
  }

  return (
    <div>
      {resorts.length === 0 ? (
        <p>No resorts available</p>
      ) : (
        <ul>
          {resorts.map(resort => (
            <li key={resort.id} onClick={() => onResortClick(resort)}>
              {resort.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Define PropTypes for the component
ResortList.propTypes = {
  resorts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onResortClick: PropTypes.func.isRequired,
};

export default ResortList;
