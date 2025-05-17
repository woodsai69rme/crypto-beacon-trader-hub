
/**
 * Handle errors in a consistent way throughout the application
 * @param error The error object or message
 * @param type The type of error (error, warning, info)
 * @param context Where the error occurred (component/function name)
 */
export const handleError = (
  error: unknown, 
  type: 'error' | 'warning' | 'info' = 'error',
  context: string = 'Application'
): void => {
  // Extract error message
  let message: string;
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Unknown error occurred';
  }
  
  // Log the error with context
  const logPrefix = `[${context}]`;
  
  switch (type) {
    case 'error':
      console.error(`${logPrefix} ${message}`, error);
      break;
    case 'warning':
      console.warn(`${logPrefix} ${message}`, error);
      break;
    case 'info':
      console.info(`${logPrefix} ${message}`, error);
      break;
    default:
      console.error(`${logPrefix} ${message}`, error);
  }
  
  // Here you could also add notifications, error reporting services, etc.
};

export default {
  handleError
};
