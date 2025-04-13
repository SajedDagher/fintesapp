const API_KEY = 'lMK4uidUePxEle2PkcSPJwUbUjUISqnQcowwChae'; 
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export const searchFoods = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('Error searching foods:', error);
    return [];
  }
};

export const getFoodDetails = async (fdcId) => {
  try {
    const response = await fetch(`${BASE_URL}/food/${fdcId}?api_key=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching food details:', error);
    return null;
  }
};