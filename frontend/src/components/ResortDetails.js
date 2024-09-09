import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import './ResortDetails.css';

const ResortDetails = ({ resort }) => {
  if (!resort) {
    return <div>No resort data available</div>;
  }

  return (
    <div>
      <h2>{resort.name}</h2>
      <p>Location: {resort.location}</p>
      <p>Condition: {resort.condition}</p>
    </div>
  );
};

// Define PropTypes for the component
ResortDetails.propTypes = {
  resort: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    condition: PropTypes.string,
  }),
};

export default ResortDetails;
