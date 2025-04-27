
import { useContext } from 'react';
import CurrencyContext from '@/contexts/CurrencyContext';

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export default useCurrency;
