import axios from 'axios';

import apiUrl from 'utils/apiUrl';
import { formatError } from 'utils/axios';

export default {
  async createLog({ title, content }) {
    try {
      await axios.post(`${apiUrl}/api/logs`, { title, content });
      return {};
    } catch (error) {
      return { error: formatError(error) };
    }
  },
};
