'use client';

import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { CreditCard, Landmark } from 'lucide-react';

export default function Payment() {
  const { orders, updateStatus, isHydrated } = useOrders();
  const { addNotification } = useNotification();

  if (!isHydrated) return null;

  const handlePay = (row, method) => {
    updateStatus(row.id, 'Paid', { paymentMethod: method });
    addNotification(`Payment ${row.transactionId.replace('INV', 'PAY')} processed via ${method}`, 'success');
  };

  const columns = [
    { key: 'transactionId', label: 'ID' },
    { key: 'itemName', label: 'Item Name' },
    { key: 'total', label: 'Amount', render: (_, row) => `$${(row.price * row.quantity).toLocaleString()}` },
    { key: 'vendor', label: 'Vendor' },
    { key: 'status', label: 'Status' },
  ];

  const filteredItems = orders.filter(o => o.status === 'Invoiced');
  const paidItems = orders.filter(o => o.status === 'Paid');

  const actions = (row) => (
    <div className="flex items-center gap-2 justify-end">
      <button 
        onClick={() => handlePay(row, 'Card')}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md font-semibold hover:bg-green-100 transition-colors border border-green-200"
      >
        <CreditCard size={16} />
        Card
      </button>
      <button 
        onClick={() => handlePay(row, 'UPI')}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md font-semibold hover:bg-green-100 transition-colors border border-green-200"
      >
        <Landmark size={16} />
        UPI
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-500">Process final payments for verified invoices.</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-orange-600 flex items-center gap-2">
          <Clock size={18} />
          Pending Payments
        </h2>
        <DataTable 
          columns={columns} 
          data={filteredItems} 
          actions={actions}
        />
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-green-600 flex items-center gap-2">
          <CheckCircle size={18} />
          Payment History
        </h2>
        <DataTable 
          columns={[
            ...columns.slice(0, 4),
            { key: 'paymentMethod', label: 'Method' },
            { key: 'status', label: 'Status' },
          ]} 
          data={paidItems} 
        />
      </section>
    </div>
  );
}

import { Clock, CheckCircle } from 'lucide-react';
