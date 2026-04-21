'use client';

import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { PackageCheck, Truck, ClipboardList, Package, Info } from 'lucide-react';

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
    { key: 'itemName', label: 'Item Description' },
    { key: 'quantity', label: 'Qty' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'status', label: 'Status' },
  ];

  const filteredItems = orders.filter(o => o.status === 'Ordered');

  const actions = (row) => (
    <button 
      onClick={() => handleReceive(row)}
      className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-md active:scale-95 group"
    >
      <PackageCheck size={18} className="group-hover:scale-110 transition-transform" />
      Confirm Receipt
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
            <Truck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Goods Receipt</h1>
            <p className="text-gray-500 font-medium">Log incoming shipments (MIGO)</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
            <span className="text-orange-600 font-black text-2xl">{filteredItems.length}</span>
            <span className="text-orange-800 font-bold text-sm uppercase tracking-wider leading-tight">Pending<br/>Shipments</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Info size={18} className="text-blue-500" />
              <h3 className="font-bold text-gray-800">Process Help</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Verify the physical quantity against the purchase order. Confirming receipt will update inventory and prepare the item for invoicing.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-3xl shadow-lg shadow-orange-100 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Package size={20} />
              <h3 className="font-bold">Inventory Sync</h3>
            </div>
            <p className="text-xs text-orange-100">
              Receipts are processed in real-time. Stock levels will increase upon confirmation.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 text-white rounded-lg">
              <ClipboardList size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Open Deliveries</h2>
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
                  <Package size={32} className="text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No pending shipments</h3>
                <p className="text-gray-500">Wait for purchase orders to be released.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
