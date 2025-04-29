
import { useState, useCallback } from 'react';

export function useToggle(initialState: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback(() => {
    setState(prevState => !prevState);
  }, []);

  const setValue = useCallback((value: boolean) => {
    setState(value);
  }, []);

  return [state, toggle, setValue];
}
