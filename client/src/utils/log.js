//TODO with proper logging features
function logInfo(...str) {
  if (process.env.REACT_APP_DEBUG === "true") console.info(str);
}

function logError(...str) {
  console.error(str);
}
export { logInfo, logError }
