import { useState } from 'react';
import { Search } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DataTable = ({ columns, data, actions }) => {
  const [search, setSearch] = useState('');

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {filteredData.length} records found
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-slate-200 bg-white">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-500">
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-cyan-50/40">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {col.key === 'status' ? (
                        <StatusBadge status={row[col.key]} />
                      ) : col.key === 'price' || col.key === 'total' ? (
                        `$${Number(row[col.key]).toLocaleString()}`
                      ) : col.render ? (
                        col.render(row[col.key], row)
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="bg-white px-6 py-12 text-center text-sm font-medium text-slate-400">
                  No records matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
