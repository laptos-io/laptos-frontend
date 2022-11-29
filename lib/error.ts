export const getErrMsg = (error?: any) => {
  const message =
    error?.response?.data ||
    error?.response?.message ||
    error?.message ||
    JSON.stringify(error?.response);
  return typeof message === "string"
    ? message
    : typeof message === "object"
    ? JSON.stringify(message)
    : message?.toString();
};
