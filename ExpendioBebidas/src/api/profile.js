import api from "./axios";

export const profile = async () => {
    try {
      const response = await api.get('/profile');
      return response.data; // Esto debería ser un objeto con los datos del usuario, incluido el rol
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error; // Maneja el error según sea necesario
    }
  };