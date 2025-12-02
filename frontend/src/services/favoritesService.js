
import api from './api';

export const favoritesService = {
  async list() {
    const response = await api.get('/favorites');
    return response.data;
  },

  async add(bookId) {
    const response = await api.post('/favorites', { book_id: bookId });
    return response.data;
  },

  async remove(bookId) {
    const response = await api.delete(`/favorites/${bookId}`);
    return response.data;
  }
};
