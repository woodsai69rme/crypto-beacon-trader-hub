
/**
 * Execute a function with retry logic
 * 
 * @param fn The function to execute
 * @param retriesLeft Number of retries remaining
 * @param retryDelay Time to wait before retrying in milliseconds
 * @param retryIf Function to determine if retry should happen
 * @param context Optional context information for better error logging
 * @returns The result of the function
 */
export const executeWithRetries = async <T>(
  fn: () => Promise<T>,
  retriesLeft: number,
  retryDelay: number = 1000,
  retryIf: (error: any) => boolean = () => true,
  context?: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const contextPrefix = context ? `[${context}] ` : "";
    
    // Check if we should retry
    if (retriesLeft > 0 && retryIf(error)) {
      console.log(`${contextPrefix}Retrying API call after error: ${errorMessage}. Attempts remaining: ${retriesLeft}`);
      
      // Apply exponential backoff to the retry delay
      const actualRetryDelay = retryDelay * (1 + (Math.random() * 0.2)); // Add jitter
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, actualRetryDelay));
      
      // Recursive retry
      return executeWithRetries(fn, retriesLeft - 1, retryDelay * 2, retryIf, context);
    }
    
    // No more retries, log a clear error message and propagate the error
    console.error(`${contextPrefix}Maximum retries reached. Last error: ${errorMessage}`);
    throw error;
  }
};
