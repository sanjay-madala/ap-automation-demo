// =============================================================================
// AP Invoice Automation Demo — Mock Data
// =============================================================================

// ---------------------------------------------------------------------------
// VENDORS
// ---------------------------------------------------------------------------
export const vendors = [
  {
    id: 'V001',
    name: 'Acme Supplies Co.',
    email: 'invoices@acmesupplies.com',
    address: '1200 Commerce Blvd, Suite 400, Dallas, TX 75201',
    phone: '(214) 555-0190',
    paymentTerms: 'Net 30',
    category: 'Office Supplies',
    totalSpend: 387250,
  },
  {
    id: 'V002',
    name: 'Global Tech Solutions',
    email: 'billing@globaltechsol.com',
    address: '800 Innovation Dr, San Jose, CA 95110',
    phone: '(408) 555-0234',
    paymentTerms: 'Net 45',
    category: 'IT Services',
    totalSpend: 524800,
  },
  {
    id: 'V003',
    name: 'Pacific Trading Ltd.',
    email: 'accounts@pacifictrading.com',
    address: '3500 Harbor Way, Long Beach, CA 90802',
    phone: '(562) 555-0178',
    paymentTerms: 'Net 30',
    category: 'Raw Materials',
    totalSpend: 412600,
  },
  {
    id: 'V004',
    name: 'Metro Industrial Corp.',
    email: 'ap@metroindustrial.com',
    address: '2100 Factory Rd, Detroit, MI 48201',
    phone: '(313) 555-0145',
    paymentTerms: 'Net 60',
    category: 'Manufacturing',
    totalSpend: 298450,
  },
  {
    id: 'V005',
    name: 'Summit Materials Inc.',
    email: 'invoicing@summitmaterials.com',
    address: '950 Mountain View Ave, Denver, CO 80202',
    phone: '(303) 555-0112',
    paymentTerms: 'Net 30',
    category: 'Raw Materials',
    totalSpend: 356900,
  },
  {
    id: 'V006',
    name: 'Precision Parts Mfg.',
    email: 'billing@precisionparts.com',
    address: '4400 Industrial Pkwy, Cleveland, OH 44114',
    phone: '(216) 555-0167',
    paymentTerms: 'Net 45',
    category: 'Manufacturing',
    totalSpend: 189750,
  },
  {
    id: 'V007',
    name: 'Elite Office Solutions',
    email: 'accounts@eliteoffice.com',
    address: '600 Corporate Center, Atlanta, GA 30301',
    phone: '(404) 555-0198',
    paymentTerms: 'Net 30',
    category: 'Office Supplies',
    totalSpend: 142300,
  },
  {
    id: 'V008',
    name: 'Coastal Logistics Group',
    email: 'invoices@coastallogistics.com',
    address: '1800 Port Authority Blvd, Houston, TX 77001',
    phone: '(713) 555-0156',
    paymentTerms: 'Net 45',
    category: 'Logistics',
    totalSpend: 267400,
  },
  {
    id: 'V009',
    name: 'Pinnacle Energy Services',
    email: 'billing@pinnacleenergy.com',
    address: '700 Energy Plaza, Oklahoma City, OK 73102',
    phone: '(405) 555-0189',
    paymentTerms: 'Net 60',
    category: 'Energy',
    totalSpend: 198550,
  },
  {
    id: 'V010',
    name: 'Frontier Chemical Supply',
    email: 'ap@frontierchemical.com',
    address: '3200 Chemical Ln, Baton Rouge, LA 70801',
    phone: '(225) 555-0134',
    paymentTerms: 'Net 30',
    category: 'Chemicals',
    totalSpend: 69500,
  },
];

// ---------------------------------------------------------------------------
// Helper: build processingSteps based on current status
// ---------------------------------------------------------------------------
const stepDefinitions = [
  'Ingestion',
  'Extraction',
  'Validation',
  'Approval',
  'ERP Posting',
  'Payment',
];

function buildSteps(status, baseTimestamp) {
  const statusToStepCount = {
    received: 1,
    extracting: 2,
    validating: 3,
    approved: 4,
    posted: 5,
    paid: 6,
    error: null, // handled separately
  };

  const base = new Date(baseTimestamp);
  const steps = [];

  if (status === 'error') {
    // Error occurs at a random step (2-4)
    const errorAt = 2 + Math.floor(Math.random() * 3); // steps 2, 3, or 4
    for (let i = 0; i < errorAt; i++) {
      const ts = new Date(base.getTime() + i * 3600000);
      if (i === errorAt - 1) {
        steps.push({
          step: stepDefinitions[i],
          status: 'error',
          timestamp: ts.toISOString(),
          details: `Error during ${stepDefinitions[i].toLowerCase()}: validation mismatch or missing data`,
        });
      } else {
        steps.push({
          step: stepDefinitions[i],
          status: 'completed',
          timestamp: ts.toISOString(),
          details: `${stepDefinitions[i]} completed successfully`,
        });
      }
    }
    return steps;
  }

  const count = statusToStepCount[status];
  for (let i = 0; i < count; i++) {
    const ts = new Date(base.getTime() + i * 3600000);
    const isLast = i === count - 1;
    const inProgress =
      (status === 'extracting' && isLast) ||
      (status === 'validating' && isLast);
    steps.push({
      step: stepDefinitions[i],
      status: inProgress ? 'in-progress' : 'completed',
      timestamp: ts.toISOString(),
      details: inProgress
        ? `${stepDefinitions[i]} in progress`
        : `${stepDefinitions[i]} completed successfully`,
    });
  }
  return steps;
}

// ---------------------------------------------------------------------------
// INVOICES — 50 invoices
// ---------------------------------------------------------------------------
const invoiceDefinitions = [
  // ---- received (8) ----
  { idx: 1, vendorId: 'V001', amount: 4250.00, date: '2025-01-10', dueDate: '2025-02-09', status: 'received', source: 'email', po: 'PO-2025-1001', confidence: 0.94 },
  { idx: 2, vendorId: 'V003', amount: 18750.00, date: '2025-01-12', dueDate: '2025-02-11', status: 'received', source: 'portal', po: 'PO-2025-1002', confidence: 0.97 },
  { idx: 3, vendorId: 'V005', amount: 32100.00, date: '2025-01-14', dueDate: '2025-02-13', status: 'received', source: 'email', po: 'PO-2025-1003', confidence: 0.91 },
  { idx: 4, vendorId: 'V007', amount: 1875.50, date: '2025-01-15', dueDate: '2025-02-14', status: 'received', source: 'email', po: 'PO-2025-1004', confidence: 0.96 },
  { idx: 5, vendorId: 'V002', amount: 67500.00, date: '2025-01-16', dueDate: '2025-03-02', status: 'received', source: 'portal', po: 'PO-2025-1005', confidence: 0.93 },
  { idx: 6, vendorId: 'V008', amount: 12400.00, date: '2025-01-17', dueDate: '2025-03-03', status: 'received', source: 'email', po: 'PO-2025-1006', confidence: 0.88 },
  { idx: 7, vendorId: 'V010', amount: 5600.00, date: '2025-01-18', dueDate: '2025-02-17', status: 'received', source: 'email', po: 'PO-2025-1007', confidence: 0.95 },
  { idx: 8, vendorId: 'V004', amount: 28900.00, date: '2025-01-19', dueDate: '2025-03-20', status: 'received', source: 'portal', po: 'PO-2025-1008', confidence: 0.92 },

  // ---- extracting (6) ----
  { idx: 9, vendorId: 'V002', amount: 45200.00, date: '2025-01-08', dueDate: '2025-02-22', status: 'extracting', source: 'email', po: 'PO-2025-1009', confidence: 0.89 },
  { idx: 10, vendorId: 'V006', amount: 8750.00, date: '2025-01-09', dueDate: '2025-02-23', status: 'extracting', source: 'portal', po: 'PO-2025-1010', confidence: 0.93 },
  { idx: 11, vendorId: 'V001', amount: 3150.00, date: '2025-01-10', dueDate: '2025-02-09', status: 'extracting', source: 'email', po: 'PO-2025-1011', confidence: 0.87 },
  { idx: 12, vendorId: 'V009', amount: 22600.00, date: '2025-01-11', dueDate: '2025-03-12', status: 'extracting', source: 'email', po: 'PO-2025-1012', confidence: 0.91 },
  { idx: 13, vendorId: 'V003', amount: 14300.00, date: '2025-01-12', dueDate: '2025-02-11', status: 'extracting', source: 'portal', po: 'PO-2025-1013', confidence: 0.96 },
  { idx: 14, vendorId: 'V005', amount: 51750.00, date: '2025-01-13', dueDate: '2025-02-12', status: 'extracting', source: 'email', po: 'PO-2025-1014', confidence: 0.90 },

  // ---- validating (6) ----
  { idx: 15, vendorId: 'V004', amount: 37800.00, date: '2025-01-05', dueDate: '2025-03-06', status: 'validating', source: 'portal', po: 'PO-2025-1015', confidence: 0.94 },
  { idx: 16, vendorId: 'V008', amount: 9200.00, date: '2025-01-06', dueDate: '2025-02-20', status: 'validating', source: 'email', po: 'PO-2025-1016', confidence: 0.97 },
  { idx: 17, vendorId: 'V001', amount: 6475.00, date: '2025-01-07', dueDate: '2025-02-06', status: 'validating', source: 'email', po: 'PO-2025-1017', confidence: 0.92 },
  { idx: 18, vendorId: 'V010', amount: 11250.00, date: '2025-01-08', dueDate: '2025-02-07', status: 'validating', source: 'portal', po: 'PO-2025-1018', confidence: 0.95 },
  { idx: 19, vendorId: 'V006', amount: 15600.00, date: '2025-01-09', dueDate: '2025-02-23', status: 'validating', source: 'email', po: 'PO-2025-1019', confidence: 0.88 },
  { idx: 20, vendorId: 'V002', amount: 89500.00, date: '2025-01-10', dueDate: '2025-02-24', status: 'validating', source: 'portal', po: 'PO-2025-1020', confidence: 0.99 },

  // ---- approved (8) ----
  { idx: 21, vendorId: 'V003', amount: 24350.00, date: '2024-12-20', dueDate: '2025-01-19', status: 'approved', source: 'email', po: 'PO-2025-1021', confidence: 0.96 },
  { idx: 22, vendorId: 'V005', amount: 41200.00, date: '2024-12-22', dueDate: '2025-01-21', status: 'approved', source: 'portal', po: 'PO-2025-1022', confidence: 0.98 },
  { idx: 23, vendorId: 'V009', amount: 17850.00, date: '2024-12-23', dueDate: '2025-02-21', status: 'approved', source: 'email', po: 'PO-2025-1023', confidence: 0.93 },
  { idx: 24, vendorId: 'V001', amount: 2980.00, date: '2024-12-25', dueDate: '2025-01-24', status: 'approved', source: 'email', po: 'PO-2025-1024', confidence: 0.97 },
  { idx: 25, vendorId: 'V007', amount: 5640.00, date: '2024-12-26', dueDate: '2025-01-25', status: 'approved', source: 'portal', po: 'PO-2025-1025', confidence: 0.95 },
  { idx: 26, vendorId: 'V004', amount: 62700.00, date: '2024-12-28', dueDate: '2025-02-26', status: 'approved', source: 'email', po: 'PO-2025-1026', confidence: 0.91 },
  { idx: 27, vendorId: 'V008', amount: 8350.00, date: '2024-12-29', dueDate: '2025-02-12', status: 'approved', source: 'portal', po: 'PO-2025-1027', confidence: 0.94 },
  { idx: 28, vendorId: 'V002', amount: 134500.00, date: '2024-12-30', dueDate: '2025-02-13', status: 'approved', source: 'email', po: 'PO-2025-1028', confidence: 0.99 },

  // ---- posted (10) ----
  { idx: 29, vendorId: 'V005', amount: 27600.00, date: '2024-11-15', dueDate: '2024-12-15', status: 'posted', source: 'portal', po: 'PO-2025-1029', confidence: 0.96 },
  { idx: 30, vendorId: 'V001', amount: 7890.00, date: '2024-11-18', dueDate: '2024-12-18', status: 'posted', source: 'email', po: 'PO-2025-1030', confidence: 0.93 },
  { idx: 31, vendorId: 'V003', amount: 56200.00, date: '2024-11-20', dueDate: '2024-12-20', status: 'posted', source: 'email', po: 'PO-2025-1031', confidence: 0.98 },
  { idx: 32, vendorId: 'V006', amount: 13450.00, date: '2024-11-22', dueDate: '2025-01-06', status: 'posted', source: 'portal', po: 'PO-2025-1032', confidence: 0.95 },
  { idx: 33, vendorId: 'V009', amount: 31200.00, date: '2024-11-25', dueDate: '2025-01-24', status: 'posted', source: 'email', po: 'PO-2025-1033', confidence: 0.92 },
  { idx: 34, vendorId: 'V002', amount: 78400.00, date: '2024-11-27', dueDate: '2025-01-11', status: 'posted', source: 'portal', po: 'PO-2025-1034', confidence: 0.97 },
  { idx: 35, vendorId: 'V004', amount: 19850.00, date: '2024-11-28', dueDate: '2025-01-27', status: 'posted', source: 'email', po: 'PO-2025-1035', confidence: 0.94 },
  { idx: 36, vendorId: 'V008', amount: 42300.00, date: '2024-11-30', dueDate: '2025-01-14', status: 'posted', source: 'portal', po: 'PO-2025-1036', confidence: 0.91 },
  { idx: 37, vendorId: 'V007', amount: 3250.00, date: '2024-12-02', dueDate: '2025-01-01', status: 'posted', source: 'email', po: 'PO-2025-1037', confidence: 0.96 },
  { idx: 38, vendorId: 'V010', amount: 16700.00, date: '2024-12-04', dueDate: '2025-01-03', status: 'posted', source: 'email', po: 'PO-2025-1038', confidence: 0.90 },

  // ---- paid (8) ----
  { idx: 39, vendorId: 'V001', amount: 5430.00, date: '2024-09-10', dueDate: '2024-10-10', status: 'paid', source: 'email', po: 'PO-2025-1039', confidence: 0.97 },
  { idx: 40, vendorId: 'V002', amount: 92300.00, date: '2024-09-15', dueDate: '2024-10-30', status: 'paid', source: 'portal', po: 'PO-2025-1040', confidence: 0.99 },
  { idx: 41, vendorId: 'V003', amount: 34500.00, date: '2024-09-20', dueDate: '2024-10-20', status: 'paid', source: 'email', po: 'PO-2025-1041', confidence: 0.95 },
  { idx: 42, vendorId: 'V005', amount: 67800.00, date: '2024-10-01', dueDate: '2024-10-31', status: 'paid', source: 'portal', po: 'PO-2025-1042', confidence: 0.98 },
  { idx: 43, vendorId: 'V004', amount: 15200.00, date: '2024-10-05', dueDate: '2024-12-04', status: 'paid', source: 'email', po: 'PO-2025-1043', confidence: 0.93 },
  { idx: 44, vendorId: 'V006', amount: 8900.00, date: '2024-10-10', dueDate: '2024-11-24', status: 'paid', source: 'email', po: 'PO-2025-1044', confidence: 0.96 },
  { idx: 45, vendorId: 'V008', amount: 23750.00, date: '2024-10-15', dueDate: '2024-11-29', status: 'paid', source: 'portal', po: 'PO-2025-1045', confidence: 0.94 },
  { idx: 46, vendorId: 'V009', amount: 148500.00, date: '2024-10-20', dueDate: '2024-12-19', status: 'paid', source: 'email', po: 'PO-2025-1046', confidence: 0.99 },

  // ---- error (4) ----
  { idx: 47, vendorId: 'V010', amount: 7250.00, date: '2025-01-05', dueDate: '2025-02-04', status: 'error', source: 'email', po: 'PO-2025-1047', confidence: 0.86 },
  { idx: 48, vendorId: 'V004', amount: 53100.00, date: '2025-01-07', dueDate: '2025-03-08', status: 'error', source: 'portal', po: 'PO-2025-1048', confidence: 0.85 },
  { idx: 49, vendorId: 'V001', amount: 2100.00, date: '2025-01-09', dueDate: '2025-02-08', status: 'error', source: 'email', po: 'PO-2025-1049', confidence: 0.87 },
  { idx: 50, vendorId: 'V007', amount: 950.00, date: '2025-01-11', dueDate: '2025-02-10', status: 'error', source: 'email', po: 'PO-2025-1050', confidence: 0.88 },
];

// Line item templates per vendor category
const lineItemTemplates = {
  V001: [
    { description: 'Copy Paper, 10-Ream Case', unitPrice: 54.99 },
    { description: 'Ballpoint Pens, Box of 60', unitPrice: 18.50 },
    { description: 'File Folders, 100-Pack', unitPrice: 32.00 },
    { description: 'Desk Organizer Set', unitPrice: 45.00 },
    { description: 'Sticky Notes, 12-Pack', unitPrice: 12.75 },
  ],
  V002: [
    { description: 'Cloud Hosting Services — Monthly', unitPrice: 4500.00 },
    { description: 'Software License Renewal', unitPrice: 12000.00 },
    { description: 'IT Consulting — Per Diem', unitPrice: 1800.00 },
    { description: 'Network Security Audit', unitPrice: 7500.00 },
    { description: 'Data Backup Service — Annual', unitPrice: 3600.00 },
  ],
  V003: [
    { description: 'Aluminum Sheet Stock, 4x8 ft', unitPrice: 285.00 },
    { description: 'Copper Wire, 500 ft Spool', unitPrice: 420.00 },
    { description: 'Steel Tubing, 20 ft Length', unitPrice: 175.00 },
    { description: 'Rubber Gasket Material, Roll', unitPrice: 95.00 },
    { description: 'Fiberglass Insulation, Bundle', unitPrice: 132.00 },
  ],
  V004: [
    { description: 'CNC Machining Services — Batch', unitPrice: 3200.00 },
    { description: 'Welding Assemblies, Per Unit', unitPrice: 875.00 },
    { description: 'Sheet Metal Fabrication', unitPrice: 1450.00 },
    { description: 'Quality Inspection Services', unitPrice: 600.00 },
    { description: 'Custom Tooling Setup', unitPrice: 2800.00 },
  ],
  V005: [
    { description: 'Portland Cement, 50 lb Bag', unitPrice: 12.50 },
    { description: 'Structural Steel Beam, 12 ft', unitPrice: 345.00 },
    { description: 'Plywood, 4x8 ft Sheet', unitPrice: 48.00 },
    { description: 'Rebar, #5, 20 ft Length', unitPrice: 22.00 },
    { description: 'Concrete Mix, Pallet', unitPrice: 890.00 },
  ],
  V006: [
    { description: 'Precision Bearing Assembly', unitPrice: 245.00 },
    { description: 'Hydraulic Cylinder', unitPrice: 780.00 },
    { description: 'Gear Set, Custom Spec', unitPrice: 1200.00 },
    { description: 'Linear Guide Rail', unitPrice: 340.00 },
    { description: 'Drive Shaft, Machined', unitPrice: 560.00 },
  ],
  V007: [
    { description: 'Ergonomic Office Chair', unitPrice: 425.00 },
    { description: 'Standing Desk, Electric', unitPrice: 650.00 },
    { description: 'Monitor Arm, Dual', unitPrice: 189.00 },
    { description: 'Desk Lamp, LED', unitPrice: 75.00 },
    { description: 'Whiteboard, 4x6 ft', unitPrice: 210.00 },
  ],
  V008: [
    { description: 'Freight Shipping — Full Truckload', unitPrice: 3800.00 },
    { description: 'Warehousing — Monthly Fee', unitPrice: 2200.00 },
    { description: 'Last-Mile Delivery, Per Shipment', unitPrice: 145.00 },
    { description: 'Customs Brokerage Fee', unitPrice: 850.00 },
    { description: 'Pallet Storage, Per Pallet/Month', unitPrice: 18.00 },
  ],
  V009: [
    { description: 'Natural Gas Supply — Monthly', unitPrice: 8500.00 },
    { description: 'Electricity — Peak Usage (kWh)', unitPrice: 0.12 },
    { description: 'Solar Panel Lease — Monthly', unitPrice: 1200.00 },
    { description: 'Energy Audit Service', unitPrice: 4500.00 },
    { description: 'Generator Fuel Supply', unitPrice: 3.85 },
  ],
  V010: [
    { description: 'Industrial Solvent, 55 gal Drum', unitPrice: 425.00 },
    { description: 'Epoxy Resin, 5 gal Pail', unitPrice: 189.00 },
    { description: 'Lubricant Oil, Case of 12', unitPrice: 96.00 },
    { description: 'Cleaning Agent, 20 gal', unitPrice: 78.00 },
    { description: 'Adhesive Compound, 10 lb', unitPrice: 145.00 },
  ],
};

function generateLineItems(vendorId, totalAmount) {
  const templates = lineItemTemplates[vendorId] || lineItemTemplates['V001'];
  const items = [];
  let remaining = totalAmount;
  const count = 2 + Math.floor(Math.random() * 3); // 2 to 4 line items

  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const isLast = i === count - 1;
    const portion = isLast ? remaining : Math.round(remaining * (0.3 + Math.random() * 0.3) * 100) / 100;
    const quantity = Math.max(1, Math.round(portion / template.unitPrice));
    const lineTotal = Math.round(quantity * template.unitPrice * 100) / 100;

    if (isLast) {
      // Adjust last item to make totals match
      const adjustedQuantity = Math.max(1, Math.round(remaining / template.unitPrice));
      const adjustedTotal = Math.round(adjustedQuantity * template.unitPrice * 100) / 100;
      items.push({
        description: template.description,
        quantity: adjustedQuantity,
        unitPrice: template.unitPrice,
        total: adjustedTotal,
      });
    } else {
      items.push({
        description: template.description,
        quantity,
        unitPrice: template.unitPrice,
        total: lineTotal,
      });
      remaining -= lineTotal;
    }
  }
  return items;
}

const vendorNameMap = {};
vendors.forEach((v) => {
  vendorNameMap[v.id] = v.name;
});

export const invoices = invoiceDefinitions.map((def) => {
  const id = `INV-2025-${String(def.idx).padStart(4, '0')}`;
  return {
    id,
    vendorId: def.vendorId,
    vendorName: vendorNameMap[def.vendorId],
    amount: def.amount,
    date: def.date,
    dueDate: def.dueDate,
    status: def.status,
    source: def.source,
    poNumber: def.po,
    confidence: def.confidence,
    lineItems: generateLineItems(def.vendorId, def.amount),
    processingSteps: buildSteps(def.status, def.date + 'T09:00:00Z'),
  };
});

// ---------------------------------------------------------------------------
// KPI DATA
// ---------------------------------------------------------------------------
export const kpiData = {
  totalInvoices: 1247,
  avgProcessingTime: 4.2,
  automationRate: 78,
  pendingApprovals: 23,
  totalSpend: 2847500,
};

// ---------------------------------------------------------------------------
// MONTHLY VOLUME — last 6 months (growth trend)
// ---------------------------------------------------------------------------
export const monthlyVolume = [
  { month: 'Aug', invoices: 180, automated: 138 },
  { month: 'Sep', invoices: 195, automated: 152 },
  { month: 'Oct', invoices: 205, automated: 163 },
  { month: 'Nov', invoices: 218, automated: 174 },
  { month: 'Dec', invoices: 224, automated: 182 },
  { month: 'Jan', invoices: 235, automated: 192 },
];

// ---------------------------------------------------------------------------
// PROCESSING TIME TREND — last 6 months (improvement / decreasing)
// ---------------------------------------------------------------------------
export const processingTimeTrend = [
  { month: 'Aug', time: 8.5 },
  { month: 'Sep', time: 7.2 },
  { month: 'Oct', time: 6.1 },
  { month: 'Nov', time: 5.4 },
  { month: 'Dec', time: 4.8 },
  { month: 'Jan', time: 4.2 },
];

// ---------------------------------------------------------------------------
// SPEND BY VENDOR — top 8
// ---------------------------------------------------------------------------
export const spendByVendor = [
  { vendor: 'Global Tech Solutions', spend: 524800 },
  { vendor: 'Pacific Trading Ltd.', spend: 412600 },
  { vendor: 'Acme Supplies Co.', spend: 387250 },
  { vendor: 'Summit Materials Inc.', spend: 356900 },
  { vendor: 'Metro Industrial Corp.', spend: 298450 },
  { vendor: 'Coastal Logistics Group', spend: 267400 },
  { vendor: 'Pinnacle Energy Services', spend: 198550 },
  { vendor: 'Precision Parts Mfg.', spend: 189750 },
];

// ---------------------------------------------------------------------------
// STATUS DISTRIBUTION
// ---------------------------------------------------------------------------
export const statusDistribution = [
  { name: 'Received', value: 8, color: '#3B82F6' },
  { name: 'Processing', value: 12, color: '#F59E0B' },
  { name: 'Approved', value: 8, color: '#8B5CF6' },
  { name: 'Posted', value: 10, color: '#10B981' },
  { name: 'Paid', value: 8, color: '#059669' },
  { name: 'Error', value: 4, color: '#EF4444' },
];

// ---------------------------------------------------------------------------
// EMAIL INBOX — 12 emails
// ---------------------------------------------------------------------------
export const emailInbox = [
  {
    id: 'EM-001',
    from: 'invoices@acmesupplies.com',
    fromName: 'Acme Supplies Co.',
    subject: 'Invoice #INV-2025-0001 for PO-2025-1001',
    receivedAt: '2025-01-10T08:23:00Z',
    attachments: [{ name: 'INV-2025-0001.pdf', size: '245 KB', type: 'application/pdf' }],
    status: 'processed',
    invoiceId: 'INV-2025-0001',
    confidence: 0.94,
    extractedData: { invoiceNumber: 'INV-2025-0001', vendor: 'Acme Supplies Co.', amount: 4250.00, date: '2025-01-10' },
  },
  {
    id: 'EM-002',
    from: 'billing@globaltechsol.com',
    fromName: 'Global Tech Solutions',
    subject: 'Invoice #INV-2025-0009 for PO-2025-1009',
    receivedAt: '2025-01-08T10:45:00Z',
    attachments: [{ name: 'INV-2025-0009.pdf', size: '312 KB', type: 'application/pdf' }],
    status: 'processing',
    invoiceId: 'INV-2025-0009',
    confidence: 0.89,
    extractedData: { invoiceNumber: 'INV-2025-0009', vendor: 'Global Tech Solutions', amount: 45200.00, date: '2025-01-08' },
  },
  {
    id: 'EM-003',
    from: 'invoices@acmesupplies.com',
    fromName: 'Acme Supplies Co.',
    subject: 'Invoice #INV-2025-0011 for PO-2025-1011',
    receivedAt: '2025-01-10T14:12:00Z',
    attachments: [{ name: 'INV-2025-0011.pdf', size: '198 KB', type: 'application/pdf' }],
    status: 'processing',
    invoiceId: 'INV-2025-0011',
    confidence: 0.87,
    extractedData: { invoiceNumber: 'INV-2025-0011', vendor: 'Acme Supplies Co.', amount: 3150.00, date: '2025-01-10' },
  },
  {
    id: 'EM-004',
    from: 'accounts@eliteoffice.com',
    fromName: 'Elite Office Solutions',
    subject: 'Invoice #INV-2025-0004 for PO-2025-1004',
    receivedAt: '2025-01-15T09:30:00Z',
    attachments: [
      { name: 'INV-2025-0004.pdf', size: '156 KB', type: 'application/pdf' },
      { name: 'PO-confirmation.pdf', size: '89 KB', type: 'application/pdf' },
    ],
    status: 'processed',
    invoiceId: 'INV-2025-0004',
    confidence: 0.96,
    extractedData: { invoiceNumber: 'INV-2025-0004', vendor: 'Elite Office Solutions', amount: 1875.50, date: '2025-01-15' },
  },
  {
    id: 'EM-005',
    from: 'ap@frontierchemical.com',
    fromName: 'Frontier Chemical Supply',
    subject: 'Invoice #INV-2025-0047 for PO-2025-1047',
    receivedAt: '2025-01-05T11:08:00Z',
    attachments: [{ name: 'INV-2025-0047.pdf', size: '278 KB', type: 'application/pdf' }],
    status: 'error',
    invoiceId: 'INV-2025-0047',
    confidence: 0.86,
    extractedData: { invoiceNumber: 'INV-2025-0047', vendor: 'Frontier Chemical Supply', amount: 7250.00, date: '2025-01-05' },
  },
  {
    id: 'EM-006',
    from: 'invoices@coastallogistics.com',
    fromName: 'Coastal Logistics Group',
    subject: 'Invoice #INV-2025-0006 for PO-2025-1006',
    receivedAt: '2025-01-17T07:55:00Z',
    attachments: [{ name: 'INV-2025-0006.pdf', size: '334 KB', type: 'application/pdf' }],
    status: 'processed',
    invoiceId: 'INV-2025-0006',
    confidence: 0.88,
    extractedData: { invoiceNumber: 'INV-2025-0006', vendor: 'Coastal Logistics Group', amount: 12400.00, date: '2025-01-17' },
  },
  {
    id: 'EM-007',
    from: 'billing@pinnacleenergy.com',
    fromName: 'Pinnacle Energy Services',
    subject: 'Invoice #INV-2025-0012 for PO-2025-1012',
    receivedAt: '2025-01-11T13:20:00Z',
    attachments: [
      { name: 'INV-2025-0012.pdf', size: '267 KB', type: 'application/pdf' },
      { name: 'usage-report.xlsx', size: '145 KB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    ],
    status: 'processing',
    invoiceId: 'INV-2025-0012',
    confidence: 0.91,
    extractedData: { invoiceNumber: 'INV-2025-0012', vendor: 'Pinnacle Energy Services', amount: 22600.00, date: '2025-01-11' },
  },
  {
    id: 'EM-008',
    from: 'invoices@acmesupplies.com',
    fromName: 'Acme Supplies Co.',
    subject: 'Invoice #INV-2025-0049 for PO-2025-1049',
    receivedAt: '2025-01-09T16:40:00Z',
    attachments: [{ name: 'INV-2025-0049.pdf', size: '134 KB', type: 'application/pdf' }],
    status: 'error',
    invoiceId: 'INV-2025-0049',
    confidence: 0.87,
    extractedData: { invoiceNumber: 'INV-2025-0049', vendor: 'Acme Supplies Co.', amount: 2100.00, date: '2025-01-09' },
  },
  {
    id: 'EM-009',
    from: 'invoicing@summitmaterials.com',
    fromName: 'Summit Materials Inc.',
    subject: 'Invoice #INV-2025-0003 for PO-2025-1003',
    receivedAt: '2025-01-14T10:05:00Z',
    attachments: [{ name: 'INV-2025-0003.pdf', size: '421 KB', type: 'application/pdf' }],
    status: 'processed',
    invoiceId: 'INV-2025-0003',
    confidence: 0.91,
    extractedData: { invoiceNumber: 'INV-2025-0003', vendor: 'Summit Materials Inc.', amount: 32100.00, date: '2025-01-14' },
  },
  {
    id: 'EM-010',
    from: 'ap@metroindustrial.com',
    fromName: 'Metro Industrial Corp.',
    subject: 'Invoice #INV-2025-0048 for PO-2025-1048',
    receivedAt: '2025-01-07T12:30:00Z',
    attachments: [
      { name: 'INV-2025-0048.pdf', size: '389 KB', type: 'application/pdf' },
      { name: 'delivery-receipt.pdf', size: '67 KB', type: 'application/pdf' },
    ],
    status: 'needs-review',
    invoiceId: 'INV-2025-0048',
    confidence: 0.85,
    extractedData: { invoiceNumber: 'INV-2025-0048', vendor: 'Metro Industrial Corp.', amount: 53100.00, date: '2025-01-07' },
  },
  {
    id: 'EM-011',
    from: 'accounts@eliteoffice.com',
    fromName: 'Elite Office Solutions',
    subject: 'Invoice #INV-2025-0050 for PO-2025-1050',
    receivedAt: '2025-01-11T08:15:00Z',
    attachments: [{ name: 'INV-2025-0050.pdf', size: '176 KB', type: 'application/pdf' }],
    status: 'needs-review',
    invoiceId: 'INV-2025-0050',
    confidence: 0.88,
    extractedData: { invoiceNumber: 'INV-2025-0050', vendor: 'Elite Office Solutions', amount: 950.00, date: '2025-01-11' },
  },
  {
    id: 'EM-012',
    from: 'ap@frontierchemical.com',
    fromName: 'Frontier Chemical Supply',
    subject: 'Invoice #INV-2025-0007 for PO-2025-1007',
    receivedAt: '2025-01-18T15:50:00Z',
    attachments: [{ name: 'INV-2025-0007.pdf', size: '203 KB', type: 'application/pdf' }],
    status: 'processed',
    invoiceId: 'INV-2025-0007',
    confidence: 0.95,
    extractedData: { invoiceNumber: 'INV-2025-0007', vendor: 'Frontier Chemical Supply', amount: 5600.00, date: '2025-01-18' },
  },
];

// ---------------------------------------------------------------------------
// RECENT ACTIVITY — 10 items
// ---------------------------------------------------------------------------
export const recentActivity = [
  {
    id: 'ACT-001',
    type: 'invoice_received',
    message: 'Invoice INV-2025-0001 received from Acme Supplies Co. via email',
    timestamp: '2025-01-19T14:32:00Z',
    icon: 'inbox',
  },
  {
    id: 'ACT-002',
    type: 'invoice_posted',
    message: 'Invoice INV-2025-0038 posted to ERP for Frontier Chemical Supply',
    timestamp: '2025-01-19T13:15:00Z',
    icon: 'check-circle',
  },
  {
    id: 'ACT-003',
    type: 'error_flagged',
    message: 'Validation error on INV-2025-0047 — amount mismatch with PO-2025-1047',
    timestamp: '2025-01-19T12:48:00Z',
    icon: 'alert-triangle',
  },
  {
    id: 'ACT-004',
    type: 'payment_made',
    message: 'Payment of $148,500.00 processed for INV-2025-0046 to Pinnacle Energy Services',
    timestamp: '2025-01-19T11:20:00Z',
    icon: 'dollar-sign',
  },
  {
    id: 'ACT-005',
    type: 'vendor_submitted',
    message: 'Global Tech Solutions submitted invoice INV-2025-0005 via vendor portal',
    timestamp: '2025-01-19T10:45:00Z',
    icon: 'upload',
  },
  {
    id: 'ACT-006',
    type: 'invoice_received',
    message: 'Invoice INV-2025-0008 received from Metro Industrial Corp. via portal',
    timestamp: '2025-01-19T09:30:00Z',
    icon: 'inbox',
  },
  {
    id: 'ACT-007',
    type: 'payment_made',
    message: 'Payment of $92,300.00 processed for INV-2025-0040 to Global Tech Solutions',
    timestamp: '2025-01-18T16:55:00Z',
    icon: 'dollar-sign',
  },
  {
    id: 'ACT-008',
    type: 'error_flagged',
    message: 'Extraction failed on INV-2025-0049 — unable to parse line items',
    timestamp: '2025-01-18T15:10:00Z',
    icon: 'alert-triangle',
  },
  {
    id: 'ACT-009',
    type: 'invoice_posted',
    message: 'Invoice INV-2025-0037 posted to ERP for Elite Office Solutions',
    timestamp: '2025-01-18T14:22:00Z',
    icon: 'check-circle',
  },
  {
    id: 'ACT-010',
    type: 'vendor_submitted',
    message: 'Pacific Trading Ltd. submitted invoice INV-2025-0002 via vendor portal',
    timestamp: '2025-01-18T11:05:00Z',
    icon: 'upload',
  },
];
