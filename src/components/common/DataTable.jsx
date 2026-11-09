import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  filterKey = 'status',
  onRowClick,
  actionButton,
  exportFilename = 'export.csv'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Tab filter
      if (activeFilter !== 'ALL' && item[filterKey] !== activeFilter) {
        return false;
      }
      // Text search across string fields
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return Object.values(item).some(val => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(q);
        }
        return false;
      });
    });
  }, [data, activeFilter, searchQuery, filterKey]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const exportCols = columns.filter(c => c.key);
    const headers = exportCols.map(c => c.label).join(',');
    const rows = sortedData.map(item => {
      return exportCols.map(c => {
        const val = item[c.key];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val ?? '';
      }).join(',');
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + '\n' + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search, Filters, Export, Actions */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#161616] border border-[#2A2A2A] rounded-lg text-[#F2F2F2] placeholder-[#666666] focus:outline-none focus:border-[#E8590C] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {filterOptions.length > 0 && (
            <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-lg border border-[#2A2A2A]">
              <button
                onClick={() => { setActiveFilter('ALL'); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeFilter === 'ALL'
                    ? 'bg-[#E8590C] text-white'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
                }`}
              >
                All ({data.length})
              </button>
              {filterOptions.map(opt => {
                const count = data.filter(d => d[filterKey] === opt.value).length;
                return (
                  <button
                    key={opt.value}
                    onClick={() => { setActiveFilter(opt.value); setCurrentPage(1); }}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      activeFilter === opt.value
                        ? 'bg-[#E8590C] text-white'
                        : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
                    }`}
                  >
                    {opt.label} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#161616] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2] hover:border-[#3A3A3A] rounded-lg transition-colors whitespace-nowrap"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {actionButton}
        </div>
      </div>

      {/* Table Box */}
      <div className="overflow-x-auto rounded-lg border border-[#2A2A2A] bg-[#161616]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-[#9A9A9A] text-xs uppercase tracking-wider select-none font-semibold">
              {columns.map(col => (
                <th
                  key={col.key || col.label}
                  onClick={() => col.sortable !== false && col.key && handleSort(col.key)}
                  className={`px-4 py-3 ${col.sortable !== false && col.key ? 'cursor-pointer hover:text-[#F2F2F2]' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {col.sortable !== false && col.key && sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#E8590C]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#E8590C]" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242424]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-[#1E1E1E]' : 'hover:bg-[#1A1A1A]'
                  }`}
                >
                  {columns.map(col => (
                    <td key={col.key || col.label} className={`px-4 py-3 text-sm text-[#F2F2F2] ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row) : (row[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#9A9A9A]">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9A9A9A] px-1">
        <div>
          Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-[#2A2A2A] bg-[#161616] text-[#9A9A9A] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#F2F2F2] hover:border-[#3A3A3A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-[#2A2A2A] bg-[#161616] text-[#9A9A9A] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#F2F2F2] hover:border-[#3A3A3A] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

