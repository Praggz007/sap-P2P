'use client';

import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { FileCheck } from 'lucide-react';

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
    { key: 'itemName', label: 'Item Name' },
    { key: 'total', label: 'Total Value', render: (_, row) => `$${(row.price * row.quantity).toLocaleString()}` },
    { key: 'vendor', label: 'Vendor' },
    { key: 'status', label: 'Status' },
  ];

  const filteredItems = orders.filter(o => o.status === 'Received');

  const actions = (row) => (
    <button 
      onClick={() => handleVerify(row)}
      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md font-semibold hover:bg-purple-100 transition-colors border border-purple-200"
    >
      <FileCheck size={16} />
      Verify Invoice
    </button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Invoice Verification</h1>
        <p className="text-gray-500">Match supplier invoices with goods receipts.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredItems} 
        actions={actions}
      />
    </div>
  );
}
