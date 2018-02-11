import { CREATE_LOG, FETCH_LOGS } from './events';

export const createLog = ({ title, content }) => ({
  type: CREATE_LOG,
  title,
  content,
});

export const fetchLogs = () => ({ type: FETCH_LOGS });
