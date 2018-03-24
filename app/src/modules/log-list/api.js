import axios from 'axios';

export default {
  async createLog({ title, content }) {
    try {
      await axios.post('http://127.0.0.1:9091/api/logs', { title, content });
      return {};
    } catch (error) {
      console.error('error getting logs', error);
      return { error };
    }
  },
  async fetchLogs() {
    try {
      const response = await axios.get('http://127.0.0.1:9091/api/logs');
      return { logs: response.data };
    } catch (error) {
      console.error('error getting logs', error);
      return { error };
    }
  },
};
