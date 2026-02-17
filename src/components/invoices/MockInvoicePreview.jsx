import { formatCurrency } from '../../utils/formatters';

export default function MockInvoicePreview({ invoice }) {
  if (!invoice) return null;

  const tax = Math.round(invoice.amount * 0.07 * 100) / 100;
  const whtTotal = (invoice.lineItems || []).reduce((sum, item) => sum + (item.whtAmount || 0), 0);
  const total = Math.round((invoice.amount + tax - whtTotal) * 100) / 100;

  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded-sm p-8 font-serif text-gray-800 max-w-[600px] mx-auto relative">
      {/* Subtle "scanned" overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-gray-100/20 pointer-events-none rounded-sm" />

      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {invoice.vendorName}
          </h2>
          {invoice.vendorAddress && (
            <p className="text-xs text-gray-500 mt-1 max-w-[200px] leading-relaxed">
              {invoice.vendorAddress}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 tracking-tight">INVOICE</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-semibold">No:</span> {invoice.id}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 relative">
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-sans font-semibold tracking-wider">
            Invoice Date
          </p>
          <p className="text-sm mt-0.5">{invoice.date}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-sans font-semibold tracking-wider">
            Due Date
          </p>
          <p className="text-sm mt-0.5">{invoice.dueDate}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-sans font-semibold tracking-wider">
            PO Number
          </p>
          <p className="text-sm mt-0.5">{invoice.poNumber}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-6 relative">
        <p className="text-[10px] uppercase text-gray-400 font-sans font-semibold tracking-wider mb-1">
          Bill To
        </p>
        <p className="text-sm font-semibold">SCG Corporation</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          1 Siam Cement Rd, Bang Sue<br />
          Bangkok 10800, Thailand
        </p>
      </div>

      {/* Line Items Table */}
      <div className="mb-6 relative">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2 font-semibold text-gray-700">Description</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-16">Qty</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-24">Unit Price</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-24">Amount</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-16">WHT%</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-24">WHT</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.lineItems || []).map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-2 pr-2">{item.description}</td>
                <td className="py-2 text-right tabular-nums">{item.quantity}</td>
                <td className="py-2 text-right tabular-nums">{formatCurrency(item.unitPrice)}</td>
                <td className="py-2 text-right tabular-nums">{formatCurrency(item.total)}</td>
                <td className="py-2 text-right tabular-nums">{item.whtRate != null ? `${item.whtRate}%` : '-'}</td>
                <td className="py-2 text-right tabular-nums text-red-600">{item.whtAmount ? formatCurrency(item.whtAmount) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end relative">
        <div className="w-56">
          <div className="flex justify-between text-sm py-1">
            <span className="text-gray-500">Subtotal</span>
            <span className="tabular-nums">{formatCurrency(invoice.amount)}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-gray-500">Tax (7%)</span>
            <span className="tabular-nums">{formatCurrency(tax)}</span>
          </div>
          {whtTotal > 0 && (
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-500">WHT Total</span>
              <span className="tabular-nums text-red-600">-{formatCurrency(whtTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm py-2 border-t-2 border-gray-800 mt-1 font-bold">
            <span>Total Due</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center relative">
        <p className="text-[10px] text-gray-400 font-sans">
          Payment Terms: {invoice.paymentTerms || 'Net 30'} &bull; Thank you for your business
        </p>
      </div>
    </div>
  );
}
