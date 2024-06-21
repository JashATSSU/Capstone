document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the form submission
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const mountainName = document.getElementById('mountainName').value.trim();

        if (!mountainName) {
            displayError('Please enter a mountain name.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/resort/${encodeURIComponent(mountainName)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            displayApiResponse(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            displayError(error.message);
        }
    });
});

function displayApiResponse(data) {
    const resultContainer = document.getElementById('resortData');
    resultContainer.innerHTML = ''; // Clear previous content

    if (data.data.length === 0) {
        resultContainer.innerHTML = '<p>No information found for the specified mountain.</p>';
        return;
    }

    const mountain = data.data[0];
    const mountainElement = document.createElement('div');
    mountainElement.innerHTML = `
        <h3>${mountain.name}</h3>
        <p><strong>Country:</strong> ${mountain.country}</p>
        <p><strong>Region:</strong> ${mountain.region}</p>
        <p><strong>Location:</strong> ${mountain.location.latitude}, ${mountain.location.longitude}</p>
        <p><strong>URL:</strong> <a href="${mountain.url}" target="_blank">${mountain.name} Website</a></p>
        <p><strong>Open Lifts:</strong> ${mountain.lifts ? mountain.lifts.open || 'Information not available' : 'Information not available'}</p>
        <p><strong>Weather Condition:</strong> ${mountain.weather ? mountain.weather.condition || 'Information not available' : 'Information not available'}</p>
        <p><strong>Snow Conditions:</strong> ${mountain.snowConditions || 'Information not available'}</p>
    `;
    resultContainer.appendChild(mountainElement);
}

function displayError(message) {
    const resultContainer = document.getElementById('resortData');
    resultContainer.innerHTML = `<p>${message}</p>`;
}
