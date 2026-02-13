import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, UploadCloud, CheckCircle, Loader2 } from 'lucide-react';
import { invoices, vendors } from '../data/mockData';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function VendorPortalPage() {
  const { t } = useTranslation();
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'success'
  const [progress, setProgress] = useState(0);

  const vendor = vendors[0];
  const vendorInvoices = invoices.filter((inv) => inv.vendorId === vendor.id);

  // Simulate upload progress
  useEffect(() => {
    if (uploadState !== 'uploading') return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        return next > 100 ? 100 : next;
      });
    }, 100);

    const successTimeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setUploadState('success');
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(successTimeout);
    };
  }, [uploadState]);

  // Auto-reset success state after 3 seconds
  useEffect(() => {
    if (uploadState !== 'success') return;
    const timeout = setTimeout(() => {
      setUploadState('idle');
      setProgress(0);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [uploadState]);

  const handleUploadClick = () => {
    if (uploadState === 'idle') {
      setUploadState('uploading');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('vendorPortal.title')}</h1>
      </div>

      {/* Vendor Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-primary-500 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-50 rounded-lg">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('vendorPortal.welcome')}, {vendor.name}
            </h2>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('vendorPortal.vendorId')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{vendor.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('vendorPortal.companyName')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{vendor.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('vendorPortal.contactEmail')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{vendor.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t('vendorPortal.paymentTerms')}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{vendor.paymentTerms}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Invoice Upload Zone */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('vendorPortal.uploadInvoice')}
            </h3>

            <div
              onClick={handleUploadClick}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                uploadState === 'idle'
                  ? 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/50'
                  : uploadState === 'uploading'
                  ? 'border-amber-400 bg-amber-50/50'
                  : 'border-green-400 bg-green-50/50'
              }`}
            >
              {uploadState === 'idle' && (
                <>
                  <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-700">
                    {t('vendorPortal.dragDrop')}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{t('vendorPortal.orBrowse')}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {t('vendorPortal.supportedFormats')}
                  </p>
                </>
              )}

              {uploadState === 'uploading' && (
                <>
                  <Loader2 className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-spin" />
                  <p className="text-sm font-medium text-amber-700">
                    {t('vendorPortal.uploading')}
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-amber-600 mt-2">{progress}%</p>
                </>
              )}

              {uploadState === 'success' && (
                <>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-sm font-medium text-green-700">
                    {t('vendorPortal.uploadSuccess')}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: My Submitted Invoices */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('vendorPortal.myInvoices')}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{t('vendorPortal.trackStatus')}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      {t('invoices.invoiceNo')}
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">
                      {t('invoices.amount')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      {t('invoices.date')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      {t('invoices.status')}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      {t('invoices.dueDate')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendorInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{inv.id}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(inv.date)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(inv.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {vendorInvoices.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>{t('invoices.noResults')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
