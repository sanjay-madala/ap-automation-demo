import { useState, useMemo } from 'react';

export default function useInvoiceFilters(invoices = []) {
  const [statusFilter, setStatusFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Filter by status
      if (statusFilter && invoice.status !== statusFilter) {
        return false;
      }

      // Filter by vendor
      if (vendorFilter && invoice.vendorId !== vendorFilter) {
        return false;
      }

      // Filter by source
      if (sourceFilter && invoice.source !== sourceFilter) {
        return false;
      }

      // Filter by search query (matches id, vendorName, or poNumber)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId =
          invoice.id &&
          invoice.id.toLowerCase().includes(query);
        const matchesPO =
          invoice.poNumber &&
          invoice.poNumber.toLowerCase().includes(query);
        const matchesVendorName =
          invoice.vendorName &&
          invoice.vendorName.toLowerCase().includes(query);

        if (!matchesId && !matchesPO && !matchesVendorName) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, statusFilter, vendorFilter, sourceFilter, searchQuery]);

  return {
    filteredInvoices,
    statusFilter,
    setStatusFilter,
    vendorFilter,
    setVendorFilter,
    sourceFilter,
    setSourceFilter,
    searchQuery,
    setSearchQuery,
  };
}
