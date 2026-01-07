import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Columns,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { cn } from './lib/utils';
import { MultiSelect } from './components/ui/MultiSelect';

// Types
// @ts-ignore
const hrDataRaw = window.hrData || { data: [], meta: { columns: [] } };
type HRData = typeof hrDataRaw.data[0];

// Excel Date Converter
const excelDateToJSDate = (serial: number | string) => {
  if (!serial || typeof serial !== 'number') return serial;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toLocaleDateString('zh-CN');
};

const columnHelper = createColumnHelper<HRData>();

// UI Components
const Button = ({ className, variant = 'primary', size = 'md', ...props }: any) => {
  const variants: any = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm',
    ghost: 'text-gray-600 hover:bg-gray-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  const sizes: any = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

const Input = ({ className, ...props }: any) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all",
      className
    )}
    {...props}
  />
);

const Badge = ({ children, variant = 'default' }: any) => {
  const variants: any = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant])}>
      {children}
    </span>
  );
};

// Main App Component
function App() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Dynamic Columns Configuration
  const columns = useMemo(() => {
    // Basic Fixed Columns
    const baseCols = [
      columnHelper.accessor('序号_', {
        header: 'ID',
        cell: info => <span className="text-gray-500 font-mono text-xs">#{info.getValue()}</span>,
        size: 60,
      }),
      columnHelper.accessor('姓名_', {
        header: '姓名',
        cell: info => <span className="font-semibold text-gray-900">{info.getValue() as string}</span>,
      }),
      columnHelper.accessor('部门_', {
        header: '部门',
        cell: info => <Badge variant="indigo">{info.getValue() as string}</Badge>,
        filterFn: 'arrIncludes',
      }),
      columnHelper.accessor('岗位_', {
        header: '岗位',
        cell: info => <span className="text-gray-600">{info.getValue() as string}</span>,
        filterFn: 'arrIncludes',
      }),
      columnHelper.accessor('区域_', {
        header: '区域',
        filterFn: 'arrIncludes',
      }),
      columnHelper.accessor('组别_', {
        header: '组别',
        filterFn: 'arrIncludes',
      }),
      columnHelper.accessor('入职日期_', {
        header: '入职日期',
        cell: info => <span className="text-gray-500">{excelDateToJSDate(info.getValue() as number)}</span>,
      }),
    ];

    return baseCols;
  }, []);

  // Default Visibility: Hide most columns except key ones
  useState(() => {
    // No-op for now, just to match original structure I want to replace
  });

  // Set initial visibility state logic
  const initialVisibility = useMemo(() => {
    const vis: VisibilityState = {};
    hrDataRaw.meta.columns.forEach((col: string) => {
      const isDefault = ['序号_', '姓名_', '部门_', '岗位_', '入职日期_', '区域_', '组别_', '剩余年假', '剩余调休'].includes(col);
      vis[col] = isDefault;
    });
    return vis;
  }, []);

  // Create Table Instance
  const table = useReactTable({
    data: hrDataRaw.data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    initialState: {
      columnVisibility: initialVisibility
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Global filter function
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    },
    filterFns: {
      arrIncludes: (row, columnId, filterValue) => {
        const cellValue = String(row.getValue(columnId));
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(cellValue);
      }
    }
  });

  // Calculate Stats
  const stats = useMemo(() => {
    const totalEmployees = hrDataRaw.data.length;
    const depts = new Set(hrDataRaw.data.map((d: any) => d['部门_'])).size;
    const areas = new Set(hrDataRaw.data.map((d: any) => d['区域_'])).size;
    const groups = new Set(hrDataRaw.data.map((d: any) => d['组别_'])).size;
    const positions = new Set(hrDataRaw.data.map((d: any) => d['岗位_'])).size;
    return { totalEmployees, depts, areas, groups, positions };
  }, []);

  const [showFilters, setShowFilters] = useState(false);

  const facets = useMemo(() => {
    const data = hrDataRaw.data;
    const getOptions = (key: string) =>
      Array.from(new Set(data.map((d: any) => d[key]))).filter(Boolean).sort() as string[];

    return {
      departments: getOptions('部门_'),
      positions: getOptions('岗位_'),
      areas: getOptions('区域_'),
      groups: getOptions('组别_'),
    };
  }, []);

  // Helper to update column filter
  const setColumnFilter = (columnId: string, value: string[]) => {
    table.getColumn(columnId)?.setFilterValue(value.length ? value : undefined);
  };

  const getColumnFilter = (columnId: string) => {
    return (table.getColumn(columnId)?.getFilterValue() as string[]) || [];
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">HR</span>
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              DataVision
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Generated: {new Date(hrDataRaw.meta.generatedAt).toLocaleDateString()}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Employees</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalEmployees}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Departments</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.depts}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Areas</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.areas}</div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={globalFilter ?? ''}
              onChange={(e: any) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="secondary" className="gap-2" onClick={() => setShowColumnSelector(!showColumnSelector)}>
                <Columns className="w-4 h-4" /> Columns
              </Button>
              <AnimatePresence>
                {showColumnSelector && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-2"
                  >
                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase">Toggle Columns</div>
                    {table.getAllLeafColumns().map(column => {
                      return (
                        <div key={column.id} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={column.getToggleVisibilityHandler()}>
                          <input
                            {...{
                              type: 'checkbox',
                              checked: column.getIsVisible(),
                              onChange: column.getToggleVisibilityHandler(),
                              className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            }}
                          />
                          <span className="text-sm text-gray-700 truncate" title={column.id}>{column.columnDef.header as string}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button variant={showFilters ? 'primary' : 'secondary'} className="gap-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', transitionEnd: { overflow: 'visible' } }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              className="relative z-30"
            >
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Department', id: '部门_', options: facets.departments },
                  { label: 'Position', id: '岗位_', options: facets.positions },
                  { label: 'Area', id: '区域_', options: facets.areas },
                  { label: 'Group', id: '组别_', options: facets.groups },
                ].map(filter => (
                  <MultiSelect
                    key={filter.id}
                    label={filter.label}
                    options={filter.options}
                    selected={getColumnFilter(filter.id)}
                    onChange={(val) => setColumnFilter(filter.id, val)}
                    placeholder={`Select ${filter.label}...`}
                  />
                ))}

                <div className="col-span-full flex justify-end mt-2 pt-2 border-t border-gray-50">
                  <Button variant="ghost" size="sm" onClick={() => setColumnFilters([])} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <X className="w-4 h-4 mr-1" /> Clear All Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn("flex items-center gap-2 cursor-pointer select-none", header.column.getCanSort() ? "hover:text-indigo-600" : "")}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() ? (
                              header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓'
                            ) : null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      key={row.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-3 whitespace-nowrap text-gray-600">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, hrDataRaw.data.length)} of {hrDataRaw.data.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
