// Client-side API configuration
// Note: Turso database client runs on the server (api/guests.js)
// This file configures the client-side API calls to the server

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async getGuests() {
    const response = await fetch(`${API_BASE_URL}/guests`);
    if (!response.ok) throw new Error('Failed to fetch guests');
    return response.json();
  },

  async getGuest(id) {
    const response = await fetch(`${API_BASE_URL}/guests/${id}`);
    if (!response.ok) throw new Error('Failed to fetch guest');
    return response.json();
  },

  async createGuest(data) {
    const response = await fetch(`${API_BASE_URL}/guests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create guest');
    return response.json();
  },

  async updateGuest(id, data) {
    const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update guest');
    return response.json();
  },

  async patchGuest(id, data) {
    const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to patch guest');
    return response.json();
  },

  async deleteGuest(id) {
    const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete guest');
    return response.json();
  },
};

export default api;