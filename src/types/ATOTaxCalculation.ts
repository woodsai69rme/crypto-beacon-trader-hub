
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

// ATO Tax Settings for different financial years
export const ATOTaxCalculation = {
  // 2023-2024 tax year settings
  "2023-2024": {
    financialYear: "2023-2024",
    brackets: [
      { min: 0, max: 18200, rate: 0, base: 0 },
      { min: 18201, max: 45000, rate: 0.19, base: 0 },
      { min: 45001, max: 120000, rate: 0.325, base: 5092 },
      { min: 120001, max: 180000, rate: 0.37, base: 29467 },
      { min: 180001, max: null, rate: 0.45, base: 51667 }
    ],
    medicareLevyRate: 0.02,
    medicareLevyThreshold: 22801,
    medicareSurchargeRate: 0.01,
    medicareSurchargeThreshold: 90000,
    lowIncomeTaxOffset: 700,
    lowIncomeTaxOffsetThreshold: 66667
  },
  
  // 2022-2023 tax year settings
  "2022-2023": {
    financialYear: "2022-2023",
    brackets: [
      { min: 0, max: 18200, rate: 0, base: 0 },
      { min: 18201, max: 45000, rate: 0.19, base: 0 },
      { min: 45001, max: 120000, rate: 0.325, base: 5092 },
      { min: 120001, max: 180000, rate: 0.37, base: 29467 },
      { min: 180001, max: null, rate: 0.45, base: 51667 }
    ],
    medicareLevyRate: 0.02,
    medicareLevyThreshold: 22801,
    medicareSurchargeRate: 0.01,
    medicareSurchargeThreshold: 90000,
    lowIncomeTaxOffset: 700,
    lowIncomeTaxOffsetThreshold: 66667
  }
};
