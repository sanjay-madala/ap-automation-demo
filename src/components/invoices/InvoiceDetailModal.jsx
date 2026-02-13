import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, Loader, XCircle, Circle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

const stepIconMap = {
  completed: { Icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', line: 'bg-green-300' },
  'in-progress': { Icon: Loader, color: 'text-amber-500', bg: 'bg-amber-100', line: 'bg-amber-300' },
  error: { Icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', line: 'bg-red-300' },
  pending: { Icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100', line: 'bg-gray-200' },
};

export default function InvoiceDetailModal({ invoice, onClose, isOpen }) {
  const { t } = useTranslation();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !invoice) return null;

  const tax = Math.round(invoice.amount * 0.07 * 100) / 100;
  const total = Math.round((invoice.amount + tax) * 100) / 100;
  const confidencePct = Math.round(invoice.confidence * 100);

  let confidenceColor = 'text-red-600';
  if (confidencePct >= 95) confidenceColor = 'text-green-600';
  else if (confidencePct >= 90) confidenceColor = 'text-amber-600';

  const lineItemsTotal = invoice.lineItems
    ? invoice.lineItems.reduce((sum, item) => sum + item.total, 0)
    : 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{invoice.id}</h2>
            <StatusBadge status={invoice.status} />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Two Columns: Invoice Info + Amount Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Invoice Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {t('invoices.details')}
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <InfoRow label={t('invoices.vendor')} value={invoice.vendorName} />
                <InfoRow label={t('invoices.date')} value={formatDate(invoice.date)} />
                <InfoRow label={t('invoices.dueDate')} value={formatDate(invoice.dueDate)} />
                <InfoRow label={t('invoices.poNumber')} value={invoice.poNumber} />
                <InfoRow
                  label={t('invoices.source')}
                  value={
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        invoice.source === 'email'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {t(`source.${invoice.source}`, invoice.source)}
                    </span>
                  }
                />
                <InfoRow
                  label={t('invoices.confidence')}
                  value={
                    <span className={`font-semibold ${confidenceColor}`}>
                      {confidencePct}%
                    </span>
                  }
                />
              </div>
            </div>

            {/* Right: Amount Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {t('invoices.amount')}
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('invoices.subtotal')}</span>
                  <span className="font-mono font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('invoices.tax')} (7%)</span>
                  <span className="font-mono font-medium text-gray-900">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    {t('invoices.totalAmount')}
                  </span>
                  <span className="font-mono font-bold text-lg text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Timeline */}
          {invoice.processingSteps && invoice.processingSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {t('invoices.processingTimeline')}
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="relative">
                  {invoice.processingSteps.map((step, index) => {
                    const isLast = index === invoice.processingSteps.length - 1;
                    const config = stepIconMap[step.status] || stepIconMap.pending;
                    const { Icon, color, bg, line } = config;

                    return (
                      <div key={index} className="flex gap-4 relative">
                        {/* Vertical line connector */}
                        {!isLast && (
                          <div
                            className={`absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-6px)] ${line}`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-[30px] h-[30px] rounded-full ${bg} flex items-center justify-center z-10`}
                        >
                          <Icon
                            className={`w-4 h-4 ${color} ${
                              step.status === 'in-progress' ? 'animate-spin' : ''
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className={`flex-1 ${!isLast ? 'pb-5' : ''}`}>
                          <p className="text-sm font-semibold text-gray-900">
                            {step.step}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDateTime(step.timestamp)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {step.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          {invoice.lineItems && invoice.lineItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {t('invoices.lineItems')}
              </h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('invoices.description')}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('invoices.quantity')}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('invoices.unitPrice')}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('invoices.total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.lineItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-right font-mono">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono font-medium">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-sm font-semibold text-gray-700 text-right"
                      >
                        {t('invoices.total')}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right font-mono">
                        {formatCurrency(lineItemsTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">
        {value}
      </span>
    </div>
  );
}
