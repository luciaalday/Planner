// client/src/service/config.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// API endpoints
export const api = {
    // Get all guests
    getGuests: () => apiRequest('/guests'),

    // Get single guest
    getGuest: (id) => apiRequest(`/guests/${id}`),

    // Add a new guest
    addGuest: (guestData) => apiRequest('/guests', {
        method: 'POST',
        body: JSON.stringify(guestData),
    }),

    // Update guest (full update)
    updateGuest: (id, guestData) => apiRequest(`/guests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(guestData),
    }),

    // Partial update guest
    patchGuest: (id, partialData) => apiRequest(`/guests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(partialData),
    }),

    // Delete guest
    deleteGuest: (id) => apiRequest(`/guests/${id}`, {
        method: 'DELETE',
    }),
};

export { API_BASE_URL };