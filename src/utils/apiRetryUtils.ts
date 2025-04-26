
/**
 * Execute a function with retry logic
 * 
 * @param fn The function to execute
 * @param retriesLeft Number of retries remaining
 * @param retryDelay Time to wait before retrying in milliseconds
 * @param retryIf Function to determine if retry should happen
 * @returns The result of the function
 */
export const executeWithRetries = async <T>(
  fn: () => Promise<T>,
  retriesLeft: number,
  retryDelay: number = 1000,
  retryIf: (error: any) => boolean = () => true
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    // Check if we should retry
    if (retriesLeft > 0 && retryIf(error)) {
      console.log(`Retrying API call. Attempts remaining: ${retriesLeft}`);
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      
      // Recursive retry
      return executeWithRetries(fn, retriesLeft - 1, retryDelay, retryIf);
    }
    
    // No more retries, propagate the error
    throw error;
  }
};
