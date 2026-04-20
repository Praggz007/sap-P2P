'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import DocumentModal from '@/components/DocumentModal';
import { ShoppingCart, Eye } from 'lucide-react';

export default function Orders() {
  const { orders, updateStatus, isHydrated } = useOrders();
  const { addNotification } = useNotification();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!isHydrated) return null;

  const handleConvert = (row) => {
    updateStatus(row.id, 'Ordered');
    addNotification(`Purchase Order ${row.transactionId.replace('PR', 'PO')} created successfully`, 'success');
  };

  const columns = [
    { key: 'transactionId', label: 'PO ID' },
    { key: 'itemName', label: 'Item Name' },
    { key: 'quantity', label: 'Qty' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'status', label: 'Status' },
  ];

  const filteredItems = orders.filter(o => o.status === 'Requested');
  const confirmedOrders = orders.filter(o => o.status === 'Ordered' || o.status === 'Received');

  const actions = (row) => (
    <button 
      onClick={() => handleConvert(row)}
      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
    >
      <ShoppingCart size={16} />
      Convert to PO
    </button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Purchase Orders (ME21N)</h1>
        <p className="text-gray-500">Approve and convert requisitions to official orders.</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart size={18} className="text-blue-500" />
          Pending Requisitions
        </h2>
        <DataTable 
          columns={columns} 
          data={filteredItems} 
          actions={actions}
        />
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Eye size={18} className="text-gray-500" />
          Purchase Order Register
        </h2>
        <DataTable 
          columns={columns} 
          data={confirmedOrders} 
          actions={(row) => (
            <button 
              onClick={() => setSelectedOrder(row)}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs font-bold"
            >
              <Eye size={14} />
              View PO
            </button>
          )}
        />
      </section>

      <DocumentModal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
      />
    </div>
  );
}
