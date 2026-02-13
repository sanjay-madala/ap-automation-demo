import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { invoices, vendors } from '../data/mockData';
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
  } = useInvoiceFilters(invoices);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('invoices.title')}
      </h1>

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
          <option value="">{t('invoices.all')} — {t('invoices.status')}</option>
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
          <option value="">{t('invoices.all')} — {t('invoices.vendor')}</option>
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
          <option value="">{t('invoices.all')} — {t('invoices.source')}</option>
          <option value="email">{t('source.email')}</option>
          <option value="portal">{t('source.portal')}</option>
        </select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {t('common.showing')} {filteredInvoices.length} {t('common.of')}{' '}
        {invoices.length} {t('common.results')}
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
      />
    </div>
  );
}
