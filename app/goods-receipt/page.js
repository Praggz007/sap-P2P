'use client';

import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { PackageCheck } from 'lucide-react';

export default function GoodsReceipt() {
  const { orders, updateStatus, isHydrated } = useOrders();
  const { addNotification } = useNotification();

  if (!isHydrated) return null;

  const handleReceive = (row) => {
    updateStatus(row.id, 'Received');
    addNotification(`Goods Receipt ${row.transactionId.replace('PO', 'GR')} confirmed`, 'success');
  };

  const columns = [
    { key: 'transactionId', label: 'PO ID' },
    { key: 'itemName', label: 'Item Name' },
    { key: 'quantity', label: 'Qty' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'status', label: 'Status' },
  ];

  const filteredItems = orders.filter(o => o.status === 'Ordered');

  const actions = (row) => (
    <button 
      onClick={() => handleReceive(row)}
      className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-md font-semibold hover:bg-orange-100 transition-colors border border-orange-200"
    >
      <PackageCheck size={16} />
      Confirm Receipt
    </button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Goods Receipt</h1>
        <p className="text-gray-500">Log incoming shipments and verify items.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredItems} 
        actions={actions}
      />
    </div>
  );
}
