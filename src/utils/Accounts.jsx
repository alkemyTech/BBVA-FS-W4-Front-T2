

export const fetchAccounts = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/accounts/myAccounts/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Assuming the API returns an object with an `accounts` array
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return []; // Return an empty array on error
    }
};