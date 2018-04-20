export const formatError = error => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.error,
    };
  }
  return {
    status: 500,
    message: error.message,
  };
};
