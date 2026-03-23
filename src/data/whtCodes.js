export const whtCodes = [
  { code: '01', description: '1% ค่าขนส่ง', rate: 1 },
  { code: '02', description: '1% ดอกเบี้ยจ่าย', rate: 1 },
  { code: '03', description: '1% ค่าเบี้ยประกันภัย', rate: 1 },
  { code: '04', description: '2% ค่าโฆษณา', rate: 2 },
  { code: '05', description: '3% ค่าจ้างทำของ', rate: 3 },
  { code: '08', description: '3% ค่าธรรมเนียม,ค่านายหน้า,ที่ปรึกษา', rate: 3 },
  { code: '09', description: '3% ค่าบริการ ค่าแรง ค่ารับเหมา', rate: 3 },
  { code: '11', description: '3% ส่วนลด ส่งเสริมการขาย', rate: 3 },
  { code: '12', description: '3% ค่าวิชาชีพอิสระ', rate: 3 },
  { code: '14', description: '5% ค่าเช่า', rate: 5 },
  { code: '17', description: '3% ค่าลิขสิทธิ์, ค่าความนิยม, กู๊ดวิลล์', rate: 3 },
  { code: '18', description: '15% ดอกเบี้ยจ่ายเงินกู้', rate: 15 },
  { code: '19', description: '10% เงินปันผล, ส่วนแบ่งกำไรอื่น', rate: 10 },
  { code: '20', description: '10% เงินปันผล, ส่วนแบ่งกำไรอื่น ภงด2', rate: 10 },
  { code: '21', description: '3% ค่าจ้างบุคคลภายนอก', rate: 3 },
  { code: '22', description: '3% ค่าธรรมเนียมธนาคาร', rate: 3 },
  { code: '23', description: '3% ค่ารางวัล การชิงโชค', rate: 3 },
  { code: '24', description: '1% ค่าบริการ (ส่วนราชการ, รัฐวิสาหกิจ)', rate: 1 },
  { code: '25', description: '10% ค่านายหน้า (บุคคลธรรมดา)', rate: 10 },
  { code: '26', description: '15% ค่าธรรมเนียม,ค่านายหน้า,ที่ปรึกษา(ตปท.)', rate: 15 },
  { code: '27', description: '15% ค่าลิขสิทธิ์,ค่าความนิยม(ตปท.)', rate: 15 },
  { code: '28', description: '15% ค่าเช่า (ต่างประเทศ)', rate: 15 },
  { code: '41', description: 'e-WHT 1% ค่าขนส่ง', rate: 1 },
  { code: '42', description: 'e-WHT 1% ดอกเบี้ยจ่าย', rate: 1 },
  { code: '43', description: 'e-WHT 1% ค่าเบี้ยประกันภัย', rate: 1 },
  { code: '44', description: 'e-WHT 2% ค่าโฆษณา', rate: 2 },
  { code: '45', description: 'e-WHT 3% ค่าจ้างทำของ', rate: 3 },
  { code: '48', description: 'e-WHT 3% ค่าธรรมเนียม,ค่านายหน้า,ที่ปรึกษา', rate: 3 },
  { code: '49', description: 'e-WHT 3% ค่าบริการ ค่าแรง ค่ารับเหมา', rate: 3 },
  { code: '51', description: 'e-WHT 3% ส่วนลด ส่งเสริมการขาย', rate: 3 },
  { code: '52', description: 'e-WHT 3% ค่าวิชาชีพอิสระ', rate: 3 },
  { code: '54', description: 'e-WHT 5% ค่าเช่า', rate: 5 },
  { code: '57', description: 'e-WHT 3% ค่าลิขสิทธิ์, ค่าความนิยม, กู๊ดวิลล์', rate: 3 },
  { code: '58', description: 'e-WHT 15% ดอกเบี้ยจ่ายเงินกู้', rate: 15 },
  { code: '59', description: 'e-WHT 10% เงินปันผล, ส่วนแบ่งกำไรอื่น', rate: 10 },
  { code: '60', description: 'e-WHT 10% เงินปันผล, ส่วนแบ่งกำไร ภงด.2', rate: 10 },
  { code: '61', description: 'e-WHT 3% ค่าจ้างบุคคลภายนอก', rate: 3 },
  { code: '62', description: 'e-WHT 3% ค่าธรรมเนียมธนาคาร', rate: 3 },
  { code: '63', description: 'e-WHT 3% ค่ารางวัล การชิงโชค', rate: 3 },
  { code: '64', description: 'e-WHT 1% ค่าบริการ (ส่วนราชการ, รัฐวิสาหกิจ)', rate: 1 },
  { code: '65', description: 'e-WHT 10% ค่านายหน้า (บุคคลธรรมดา)', rate: 10 },
];

export const whtCodeMap = Object.fromEntries(whtCodes.map((w) => [w.code, w]));

export function getWhtRate(code) {
  return whtCodeMap[code]?.rate || 0;
}

export function getWhtLabel(code) {
  const wht = whtCodeMap[code];
  if (!wht) return '-';
  return `${wht.code} - ${wht.description}`;
}
