'use client';

import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { 
  CreditCard, 
  Landmark, 
  Wallet, 
  History, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck,
  CircleDollarSign
} from 'lucide-react';

export default function Payment() {
  const { orders, updateStatus, isHydrated, getStats } = useOrders();
  const { addNotification } = useNotification();
  const stats = getStats();

  if (!isHydrated) return null;

  const handlePay = (row, method) => {
    updateStatus(row.id, 'Paid', { paymentMethod: method });
    addNotification(`Payment ${row.transactionId.replace('INV', 'PAY')} processed via ${method}`, 'success');
  };

  const columns = [
    { key: 'transactionId', label: 'INV ID' },
    { key: 'itemName', label: 'Item Description' },
    { key: 'total', label: 'Amount', render: (_, row) => (
      <span className="font-bold text-gray-900">${(row.price * row.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    )},
    { key: 'vendor', label: 'Vendor' },
    { key: 'status', label: 'Status' },
  ];

  const filteredItems = orders.filter(o => o.status === 'Invoiced');
  const paidItems = orders.filter(o => o.status === 'Paid');

  const actions = (row) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => handlePay(row, 'Card')}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm active:scale-95 text-xs"
      >
        <CreditCard size={14} />
        Card
      </button>
      <button 
        onClick={() => handlePay(row, 'Bank')}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-sm active:scale-95 text-xs"
      >
        <Landmark size={14} />
        Bank
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Wallet size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payments</h1>
            <p className="text-gray-500 font-medium">F-53 Post Outgoing Payments</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-emerald-800 font-black uppercase tracking-widest">Total Settled</p>
              <p className="text-2xl font-black text-emerald-600 leading-none mt-1">${stats.TotalSpend.toLocaleString()}</p>
            </div>
            <TrendingUp size={24} className="text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} className="text-emerald-500" />
              <h3 className="font-bold text-gray-800">Security Note</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              All payments are encrypted and follow standard financial protocols. Once a payment is posted, it cannot be reversed through this portal.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl shadow-lg shadow-emerald-100 text-white">
            <div className="flex items-center gap-2 mb-2">
              <CircleDollarSign size={20} />
              <h3 className="font-bold">Treasury Sync</h3>
            </div>
            <p className="text-xs text-emerald-100">
              Payments are synced with the general ledger in real-time to maintain accurate cash flow statements.
            </p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="lg:col-span-3 space-y-12">
          {/* Pending Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Clock size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Awaiting Settlement</h2>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <DataTable 
                columns={columns} 
                data={filteredItems} 
                actions={actions}
              />
              {filteredItems.length === 0 && (
                <div className="p-16 text-center">
                  <p className="text-gray-400 font-medium">No pending invoices for payment.</p>
                </div>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <History size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Postings</h2>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden opacity-90">
              <DataTable 
                columns={[
                  ...columns.slice(0, 4),
                  { key: 'paymentMethod', label: 'Method', render: (val) => (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">{val}</span>
                  )},
                  { key: 'status', label: 'Status', render: () => (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle size={14} />
                      Paid
                    </div>
                  )},
                ]} 
                data={paidItems} 
              />
              {paidItems.length === 0 && (
                <div className="p-16 text-center">
                  <p className="text-gray-400 font-medium">No payment history yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
