import axios from 'axios';

import apiUrl from 'utils/apiUrl';

export default {
  async fetchLogs() {
    try {
      const response = await axios.get(`${apiUrl}/api/logs`);
      return { logs: response.data };
    } catch (error) {
      console.error('error getting logs', error);
      return { error };
    }
  },
};
