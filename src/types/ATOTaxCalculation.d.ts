
export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  base: number;
}

export interface ATOTaxSettings {
  financialYear: string;
  brackets: TaxBracket[];
  medicareLevyRate: number;
  medicareLevyThreshold: number;
  medicareSurchargeRate: number;
  medicareSurchargeThreshold: number;
  lowIncomeTaxOffset: number;
  lowIncomeTaxOffsetThreshold: number;
}

export interface TaxCalculationInput {
  income: number;
  capitalGains: number;
  deductions: number;
  cryptoTrades: number;
  financialYear: string;
}

export interface TaxCalculationResult {
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  medicareSurcharge: number;
  totalTax: number;
  effectiveTaxRate: number;
  afterTaxIncome: number;
  taxOnCryptoGains: number;
  marginalTaxRate: number;
  taxBracket: string;
  taxBreakdown: {
    [key: string]: number;
  };
}
