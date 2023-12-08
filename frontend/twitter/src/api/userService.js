// src/api/userService.js
const API_URL = 'http://localhost:5002/api'; 

export const getUserData = async (username) => {
  try {
    const response = await fetch(`${API_URL}/users/${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserDescription = async (username, description) => {
  try {
    const response = await fetch(`${API_URL}/users/${username}/description`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user description:', error);
    throw error;
  }
};
