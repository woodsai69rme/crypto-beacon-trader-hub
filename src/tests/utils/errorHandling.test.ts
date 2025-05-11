
import { vi } from 'vitest';
import { handleError, validateRequiredFields, handleValidationError, tryCatch } from '@/utils/errorHandling';
import { toast } from '@/components/ui/use-toast';

// Mock the toast function
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}));

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
  });

  describe('handleError', () => {
    it('logs error level messages correctly', () => {
      const testError = new Error('Test error message');
      
      handleError(testError, { level: 'error' });
      
      expect(console.error).toHaveBeenCalledWith(
        'Test error message',
        expect.objectContaining({ error: testError })
      );
      
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          description: 'Test error message',
          variant: 'destructive'
        })
      );
    });

    it('logs warning level messages correctly', () => {
      handleError('Test warning', { level: 'warning' });
      
      expect(console.warn).toHaveBeenCalledWith(
        'Test warning',
        expect.any(Object)
      );
      
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Warning',
          variant: 'default'
        })
      );
    });

    it('includes context in the message when provided', () => {
      handleError('Contextual error', { context: 'TestContext' });
      
      expect(console.error).toHaveBeenCalledWith(
        '[TestContext] Contextual error',
        expect.any(Object)
      );
      
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: '[TestContext] Contextual error'
        })
      );
    });

    it('includes retry action when retry is true and retryFn is provided', () => {
      const retryFn = vi.fn();
      
      handleError('Retry error', { retry: true, retryFn });
      
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            label: 'Retry',
            onClick: retryFn
          })
        })
      );
    });

    it('does not show toast when showToast is false', () => {
      handleError('Silent error', { showToast: false });
      
      expect(console.error).toHaveBeenCalled();
      expect(toast).not.toHaveBeenCalled();
    });
  });

  describe('validateRequiredFields', () => {
    it('returns valid when all required fields are present', () => {
      const data = { name: 'Test', email: 'test@example.com', age: 30 };
      const result = validateRequiredFields(data, ['name', 'email']);
      
      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('returns invalid with missing fields when some are missing', () => {
      const data = { name: 'Test', email: '', age: null };
      const result = validateRequiredFields(data, ['name', 'email', 'age']);
      
      expect(result.valid).toBe(false);
      expect(result.missing).toEqual(['email', 'age']);
    });

    it('handles edge cases like empty strings and null values', () => {
      const data = { a: 0, b: '', c: null, d: undefined, e: false };
      const result = validateRequiredFields(data, ['a', 'b', 'c', 'd', 'e']);
      
      expect(result.valid).toBe(false);
      // 0 and false are valid values, but empty string, null, and undefined are not
      expect(result.missing).toEqual(['b', 'c', 'd']);
    });
  });

  describe('handleValidationError', () => {
    it('returns false when validation passed', () => {
      const validationResult = { valid: true, missing: [] };
      const result = handleValidationError(validationResult);
      
      expect(result).toBe(false);
      expect(toast).not.toHaveBeenCalled();
    });

    it('returns true and shows toast when validation failed', () => {
      const validationResult = { valid: false, missing: ['name', 'email'] };
      const result = handleValidationError(validationResult);
      
      expect(result).toBe(true);
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Validation Error',
          description: 'Missing required fields: name, email'
        })
      );
    });

    it('includes form name in context when provided', () => {
      const validationResult = { valid: false, missing: ['price'] };
      handleValidationError(validationResult, 'Trading');
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/\[Trading Form\]/),
        expect.any(Object)
      );
    });
  });

  describe('tryCatch', () => {
    it('returns the function result when it succeeds', async () => {
      const fn = async () => 'success';
      const result = await tryCatch(fn);
      
      expect(result).toBe('success');
    });

    it('handles errors and returns undefined when function fails', async () => {
      const fn = async () => {
        throw new Error('Test failure');
      };
      
      const result = await tryCatch(fn);
      
      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalled();
      expect(toast).toHaveBeenCalled();
    });

    it('passes options to handleError', async () => {
      const fn = async () => {
        throw new Error('Custom error');
      };
      
      await tryCatch(fn, { 
        context: 'CustomContext', 
        level: 'warning' 
      });
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/\[CustomContext\]/),
        expect.any(Object)
      );
      
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Warning'
        })
      );
    });
  });
});
