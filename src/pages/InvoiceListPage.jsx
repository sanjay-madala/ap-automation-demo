import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Upload,
  ChevronDown,
  ChevronUp,
  FileUp,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import { invoices as initialInvoices, vendors } from '../data/mockData';
import StatusBadge from '../components/common/StatusBadge';
import DataTable from '../components/common/DataTable';
import useInvoiceFilters from '../hooks/useInvoiceFilters';
import { formatCurrency, formatDate } from '../utils/formatters';
import InvoiceDetailModal from '../components/invoices/InvoiceDetailModal';

const statusOptions = [
  'received',
  'extracting',
  'validating',
  'approved',
  'posted',
  'paid',
  'error',
];

export default function InvoiceListPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoiceList, setInvoiceList] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    filteredInvoices,
    statusFilter,
    setStatusFilter,
    vendorFilter,
    setVendorFilter,
    sourceFilter,
    setSourceFilter,
    searchQuery,
    setSearchQuery,
  } = useInvoiceFilters(invoiceList);

  // Handle highlight param from Email Bot navigation
  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      const inv = invoiceList.find((i) => i.id === highlightId);
      if (inv) {
        setSelectedInvoice(inv);
      }
      setSearchParams({}, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Callbacks for InvoiceDetailModal
  const handleUpdate = useCallback((invoiceId, editData) => {
    setInvoiceList((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, ...editData } : inv
      )
    );
    setSelectedInvoice((prev) =>
      prev && prev.id === invoiceId ? { ...prev, ...editData } : prev
    );
  }, []);

  const handleApprove = useCallback((invoiceId) => {
    setInvoiceList((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'approved' } : inv
      )
    );
    setSelectedInvoice((prev) =>
      prev && prev.id === invoiceId ? { ...prev, status: 'approved' } : prev
    );
  }, []);

  // Upload handlers
  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((f) =>
      ['application/pdf', 'image/png', 'image/jpeg'].includes(f.type)
    );
    if (validFiles.length > 0) {
      setUploadFiles(validFiles);
      setUploadState('idle');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const simulateUpload = () => {
    setUploadState('uploading');
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');

          // Add new invoices to the list
          const newInvoices = uploadFiles.map((file, idx) => {
            const randomVendor =
              vendors[Math.floor(Math.random() * vendors.length)];
            const now = new Date();
            const id = `INV-${String(invoiceList.length + idx + 1).padStart(3, '0')}`;
            return {
              id,
              vendorId: randomVendor.id,
              vendorName: randomVendor.name,
              amount: Math.round(Math.random() * 50000 + 1000),
              date: now.toISOString().split('T')[0],
              dueDate: new Date(now.getTime() + 30 * 86400000)
                .toISOString()
                .split('T')[0],
              status: 'received',
              source: 'portal',
              poNumber: `PO-${10000 + Math.floor(Math.random() * 90000)}`,
              confidence: 0,
              fileName: file.name,
              lineItems: [],
              processingSteps: [
                {
                  step: 'Ingestion',
                  status: 'completed',
                  timestamp: now.toISOString(),
                },
              ],
            };
          });

          setInvoiceList((prev) => [...newInvoices, ...prev]);

          // Reset after a short delay
          setTimeout(() => {
            setUploadFiles([]);
            setUploadState('idle');
            setUploadProgress(0);
          }, 2000);

          return 100;
        }
        return Math.min(prev + Math.random() * 15 + 5, 100);
      });
    }, 200);
  };

  const columns = [
    {
      key: 'id',
      label: t('invoices.invoiceNo'),
      sortable: true,
      render: (value) => (
        <span className="text-blue-600 font-medium">{value}</span>
      ),
    },
    {
      key: 'vendorName',
      label: t('invoices.vendor'),
      sortable: true,
    },
    {
      key: 'amount',
      label: t('invoices.amount'),
      sortable: true,
      render: (value) => (
        <span className="font-mono font-medium text-right block">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'date',
      label: t('invoices.date'),
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'dueDate',
      label: t('invoices.dueDate'),
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: t('invoices.status'),
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'source',
      label: t('invoices.source'),
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            value === 'email'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-purple-50 text-purple-700'
          }`}
        >
          {t(`source.${value}`, value)}
        </span>
      ),
    },
    {
      key: 'confidence',
      label: t('invoices.confidence'),
      render: (value) => {
        const pct = Math.round(value * 100);
        let colorClass = 'text-red-600';
        if (pct >= 95) colorClass = 'text-green-600';
        else if (pct >= 90) colorClass = 'text-amber-600';
        return <span className={`font-medium ${colorClass}`}>{pct}%</span>;
      },
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('invoices.title')}
        </h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {t('invoices.uploadInvoices')}
          {showUpload ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          {uploadState === 'success' ? (
            <div className="flex flex-col items-center py-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              <p className="text-green-700 font-medium">
                {t('invoices.uploadSuccess')}
              </p>
            </div>
          ) : uploadState === 'uploading' ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-3" />
              <p className="text-gray-600 font-medium mb-3">
                {t('invoices.uploading')}
              </p>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              >
                <FileUp
                  className={`w-10 h-10 mx-auto mb-3 ${
                    isDragging ? 'text-primary-500' : 'text-gray-400'
                  }`}
                />
                <p className="text-gray-700 font-medium">
                  {t('invoices.dragDrop')}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {t('invoices.orBrowse')}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {t('invoices.supportedFormats')}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* Selected files list */}
              {uploadFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">
                      {uploadFiles.length} {t('invoices.filesSelected')}
                    </p>
                    <button
                      onClick={() => setUploadFiles([])}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {uploadFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded"
                      >
                        <FileUp className="w-3.5 h-3.5 text-gray-400" />
                        {file.name}
                        <span className="text-gray-400 ml-auto">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={simulateUpload}
                    className="mt-3 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    {t('invoices.uploadInvoices')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('invoices.search')}
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">
            {t('invoices.all')} — {t('invoices.status')}
          </option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {t(`status.${status}`, status)}
            </option>
          ))}
        </select>

        {/* Vendor Filter */}
        <select
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">
            {t('invoices.all')} — {t('invoices.vendor')}
          </option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">
            {t('invoices.all')} — {t('invoices.source')}
          </option>
          <option value="email">{t('source.email')}</option>
          <option value="portal">{t('source.portal')}</option>
        </select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {t('common.showing')} {filteredInvoices.length} {t('common.of')}{' '}
        {invoiceList.length} {t('common.results')}
      </p>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredInvoices}
        onRowClick={(invoice) => setSelectedInvoice(invoice)}
        emptyMessage={t('invoices.noResults')}
      />

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onUpdate={handleUpdate}
        onApprove={handleApprove}
      />
    </div>
  );
}
