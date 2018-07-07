import axios from 'axios';

import apiUrl from 'utils/apiUrl';
import { formatError } from 'utils/axios';

export default {
  async fetchComments(logUuids) {
    try {
      const response = await axios.post(`${apiUrl}/api/comments/search`, {
        logUuids,
      });
      return { comments: response.data };
    } catch (error) {
      return { error: formatError(error) };
    }
  },

  async saveComment(logUuid, comment) {
    try {
      const response = await axios.post(`${apiUrl}/api/comments`, {
        logUuid,
        content: comment,
      });
      return { comment: response.data };
    } catch (error) {
      return { error: formatError(error) };
    }
  },
};
