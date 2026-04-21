'use client';

import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { FileCheck, ReceiptText, ShieldCheck, Banknote, HelpCircle, FileSearch } from 'lucide-react';

export default function Invoice() {
  const { orders, updateStatus, isHydrated } = useOrders();
  const { addNotification } = useNotification();

  if (!isHydrated) return null;

  const handleVerify = (row) => {
    updateStatus(row.id, 'Invoiced');
    addNotification(`Invoice ${row.transactionId.replace('GR', 'INV')} verified`, 'success');
  };

  const columns = [
    { key: 'transactionId', label: 'GR ID' },
    { key: 'itemName', label: 'Item Description' },
    { key: 'total', label: 'Total Value', render: (_, row) => (
      <span className="font-bold text-gray-900">${(row.price * row.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    )},
    { key: 'vendor', label: 'Vendor' },
    { key: 'status', label: 'Status' },
  ];

  const filteredItems = orders.filter(o => o.status === 'Received');

  const actions = (row) => (
    <button 
      onClick={() => handleVerify(row)}
      className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md active:scale-95 group"
    >
      <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
      Verify Invoice
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <ReceiptText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Invoice Verification</h1>
            <p className="text-gray-500 font-medium">Three-way matching (MIRO)</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100 flex items-center gap-3">
            <span className="text-purple-600 font-black text-2xl">{filteredItems.length}</span>
            <span className="text-purple-800 font-bold text-sm uppercase tracking-wider leading-tight">Awaiting<br/>Verification</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle size={18} className="text-purple-500" />
              <h3 className="font-bold text-gray-800">Verification Help</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Match the vendor's invoice with the purchase order and the goods receipt. This ensures you only pay for what was ordered and received.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-fuchsia-700 p-6 rounded-3xl shadow-lg shadow-purple-100 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Banknote size={20} />
              <h3 className="font-bold">Payment Trigger</h3>
            </div>
            <p className="text-xs text-purple-100">
              Verified invoices are automatically queued for the next payment run in the finance module.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 text-white rounded-lg">
              <FileSearch size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pending Invoices</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <DataTable 
              columns={columns} 
              data={filteredItems} 
              actions={actions}
            />
            {filteredItems.length === 0 && (
              <div className="p-20 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck size={32} className="text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No invoices to verify</h3>
                <p className="text-gray-500">Items must be received before they can be invoiced.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
