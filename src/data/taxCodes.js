export const taxCodes = [
  { code: 'D0', description: 'Input Deferred Tax 0%', rate: 0 },
  { code: 'D1', description: 'Input Deferred Tax 7%', rate: 7 },
  { code: 'D2', description: 'Input Deferred Tax 10%', rate: 10 },
  { code: 'V0', description: 'Input VAT 0%', rate: 0 },
  { code: 'V1', description: 'Input VAT 7%', rate: 7 },
  { code: 'V2', description: 'Input VAT 10%', rate: 10 },
  { code: 'VX', description: 'Input VAT Exempt Purchase', rate: 0 },
  { code: 'U1', description: 'Unclaimed Purchase Tax Rate 7% (incl.Assets & exp.)', rate: 7 },
];

export const taxCodeMap = Object.fromEntries(taxCodes.map((t) => [t.code, t]));

export function getTaxRate(code) {
  return taxCodeMap[code]?.rate || 0;
}

export function getTaxLabel(code) {
  const tax = taxCodeMap[code];
  if (!tax) return '-';
  return `${tax.code} - ${tax.description}`;
}
