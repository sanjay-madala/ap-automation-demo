import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, Plus, Trash2, Sparkles } from 'lucide-react';
import MockInvoicePreview from './MockInvoicePreview';
import { formatCurrency } from '../../utils/formatters';

export default function InvoiceReviewScreen({ invoice, onSubmit, onCancel }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    vendorName: invoice.vendorName,
    date: invoice.date,
    dueDate: invoice.dueDate,
    poNumber: invoice.poNumber,
    amount: invoice.amount,
    lineItems: invoice.lineItems.map((li) => ({ ...li })),
  });

  const confidencePct = Math.round(invoice.confidence * 100);

  function handleFieldChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleLineItemChange(index, field, value) {
    setFormData((prev) => {
      const items = [...prev.lineItems];
      items[index] = { ...items[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        items[index].total =
          Math.round(items[index].quantity * items[index].unitPrice * 100) / 100;
      }
      if (field === 'quantity' || field === 'unitPrice' || field === 'whtRate') {
        const rate = items[index].whtRate || 0;
        items[index].whtAmount = Math.round(items[index].total * rate / 100 * 100) / 100;
      }
      return { ...prev, lineItems: items };
    });
  }

  function addLineItem() {
    setFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { description: '', quantity: 1, unitPrice: 0, total: 0, whtRate: 3, whtAmount: 0 },
      ],
    }));
  }

  function removeLineItem(index) {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  }

  const lineItemsTotal = formData.lineItems.reduce((sum, li) => sum + li.total, 0);
  const tax = Math.round(lineItemsTotal * 0.07 * 100) / 100;
  const whtTotal = formData.lineItems.reduce((sum, li) => sum + (li.whtAmount || 0), 0);
  const grandTotal = Math.round((lineItemsTotal + tax - whtTotal) * 100) / 100;

  function handleSubmit() {
    onSubmit({
      ...invoice,
      vendorName: formData.vendorName,
      date: formData.date,
      dueDate: formData.dueDate,
      poNumber: formData.poNumber,
      amount: lineItemsTotal,
      lineItems: formData.lineItems,
    });
  }

  // Build a preview invoice that reflects current form edits
  const previewInvoice = {
    ...invoice,
    vendorName: formData.vendorName,
    date: formData.date,
    dueDate: formData.dueDate,
    poNumber: formData.poNumber,
    amount: lineItemsTotal,
    lineItems: formData.lineItems,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('invoices.backToList')}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('invoices.reviewInvoice')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-gray-500">{t('invoices.aiConfidence')}:</span>
          <span
            className={`text-sm font-bold ${
              confidencePct >= 95
                ? 'text-green-600'
                : confidencePct >= 90
                  ? 'text-amber-600'
                  : 'text-red-600'
            }`}
          >
            {confidencePct}%
          </span>
        </div>
      </div>

      {/* Side-by-side panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Invoice Document Preview */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {t('invoices.uploadedDocument')}
          </h3>
          <div className="bg-gray-100 rounded-xl p-6 overflow-y-auto max-h-[calc(100vh-220px)]">
            <MockInvoicePreview invoice={previewInvoice} />
          </div>
        </div>

        {/* RIGHT: Extracted Data (editable) */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {t('invoices.extractedData')}
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-y-auto max-h-[calc(100vh-220px)]">
            {/* Form Fields */}
            <div className="p-5 space-y-4 border-b border-gray-100">
              <FormField
                label={t('invoices.vendor')}
                value={formData.vendorName}
                onChange={(v) => handleFieldChange('vendorName', v)}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label={t('invoices.date')}
                  type="date"
                  value={formData.date}
                  onChange={(v) => handleFieldChange('date', v)}
                />
                <FormField
                  label={t('invoices.dueDate')}
                  type="date"
                  value={formData.dueDate}
                  onChange={(v) => handleFieldChange('dueDate', v)}
                />
              </div>
              <FormField
                label={t('invoices.poNumber')}
                value={formData.poNumber}
                onChange={(v) => handleFieldChange('poNumber', v)}
              />
            </div>

            {/* Line Items */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  {t('invoices.lineItems')}
                </h4>
                <button
                  onClick={addLineItem}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('invoices.addLineItem')}
                </button>
              </div>

              <div className="space-y-3">
                {formData.lineItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-3 relative group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleLineItemChange(idx, 'description', e.target.value)
                          }
                          placeholder={t('invoices.description')}
                          className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      {formData.lineItems.length > 1 && (
                        <button
                          onClick={() => removeLineItem(idx)}
                          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={t('invoices.removeItem')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">
                          {t('invoices.quantity')}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleLineItemChange(
                              idx,
                              'quantity',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">
                          {t('invoices.unitPrice')}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleLineItemChange(
                              idx,
                              'unitPrice',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">
                          {t('invoices.total')}
                        </label>
                        <div className="text-sm font-mono font-medium text-gray-900 bg-gray-100 border border-gray-200 rounded px-2.5 py-1.5">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">
                          {t('invoices.whtRate')}
                        </label>
                        <select
                          value={item.whtRate || 0}
                          onChange={(e) =>
                            handleLineItemChange(
                              idx,
                              'whtRate',
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value={0}>0%</option>
                          <option value={1}>1%</option>
                          <option value={2}>2%</option>
                          <option value={3}>3%</option>
                          <option value={5}>5%</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">
                          {t('invoices.whtAmount')}
                        </label>
                        <div className="text-sm font-mono font-medium text-red-600 bg-gray-100 border border-gray-200 rounded px-2.5 py-1.5">
                          {formatCurrency(item.whtAmount || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-5 border-b border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('invoices.subtotal')}</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(lineItemsTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('invoices.tax')} (7%)</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(tax)}
                  </span>
                </div>
                {whtTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('invoices.whtTotal')}</span>
                    <span className="font-mono font-medium text-red-600">
                      -{formatCurrency(whtTotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200">
                  <span>{t('invoices.totalAmount')}</span>
                  <span className="font-mono text-lg">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 flex items-center justify-between">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                {t('invoices.submitForProcessing')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
  );
}
