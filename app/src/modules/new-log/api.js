import axios from 'axios';

import apiUrl from 'utils/apiUrl';

export default {
  async createLog({ title, content }) {
    try {
      await axios.post(`${apiUrl}/api/logs`, { title, content });
      return {};
    } catch (error) {
      console.error('error getting logs', error);
      return { error };
    }
  },
};
