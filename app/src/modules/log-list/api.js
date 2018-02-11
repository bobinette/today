import axios from 'axios';

export default {
  async fetchLogs() {
    try {
      const response = await axios.get('http://127.0.0.1:9091/api/logs');
      return { logs: response.data };
    } catch (error) {
      console.error('error getting logs', e);
      return { error };
    }
  },
};
