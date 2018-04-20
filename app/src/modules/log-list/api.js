import axios from 'axios';
import qs from 'qs';

import apiUrl from 'utils/apiUrl';
import { formatError } from 'utils/axios';

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
      return { error: formatError(error) };
    }
  },

  async updateLog(uuid, content) {
    try {
      const response = await axios.post(`${apiUrl}/api/logs/${uuid}`, {
        content,
      });
      return { log: response.data };
    } catch (error) {
      return { error: formatError(error) };
    }
  },

  async deleteLog(uuid) {
    try {
      await axios.delete(`${apiUrl}/api/logs/${uuid}`);
      return {};
    } catch (error) {
      return { error: formatError(error) };
    }
  },
};
