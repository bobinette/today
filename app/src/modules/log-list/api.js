import axios from 'axios';
import qs from 'qs';

import apiUrl from 'utils/apiUrl';

export default {
  async fetchLogs(q) {
    try {
      const response = await axios.get(
        `${apiUrl}/api/logs${qs.stringify(
          { q },
          { skipNulls: true, indices: false, addQueryPrefix: true },
        )}`,
      );
      return { logs: response.data };
    } catch (error) {
      console.error('error getting logs', error);
      return { error };
    }
  },

  async updateLog(uuid, content) {
    try {
      const response = await axios.post(`${apiUrl}/api/logs/${uuid}`, {
        content,
      });
      return { log: response.data };
    } catch (error) {
      console.log('error updating log', error);
      return { error };
    }
  },
};
