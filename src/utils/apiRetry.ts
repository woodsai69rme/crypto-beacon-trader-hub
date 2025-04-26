
export const executeWithRetries = async <T>(
  fn: () => Promise<T>,
  retriesLeft: number,
  retryDelay: number = 1000,
  retryIf: (error: any) => boolean = () => true
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft > 0 && retryIf(error)) {
      console.log(`Retrying API call. Attempts remaining: ${retriesLeft}`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return executeWithRetries(fn, retriesLeft - 1, retryDelay, retryIf);
    }
    throw error;
  }
};
