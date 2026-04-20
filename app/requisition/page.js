'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { Database, Edit3, Settings } from 'lucide-react';

export default function Requisition() {
  const { orders, addOrder, isHydrated, masterData } = useOrders();
  const { addNotification } = useNotification();
  
  // SAP-like states: Stock Item vs Non-Stock (Free Text)
  const [isManualEntry, setIsManualEntry] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 1,
    vendor: '',
    price: 0,
    costCenter: '',
    itemCategory: 'Standard'
  });

  if (!isHydrated) return null;

  const handleMaterialChange = (e) => {
    const material = masterData.materials.find(m => m.name === e.target.value);
    if (material) {
      setFormData({
        ...formData,
        itemName: material.name,
        price: material.price,
        itemCategory: 'Stock'
      });
    } else {
      setFormData({ ...formData, itemName: '', price: 0 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.vendor) {
      addNotification('Missing mandatory fields (Item/Vendor)', 'error');
      return;
    }

    // SAP logic: Non-stock items MUST have a cost center
    if (isManualEntry && !formData.costCenter) {
      addNotification('Non-stock items require a Cost Center (Account Assignment K)', 'error');
      return;
    }
    
    const trId = addOrder({
      ...formData,
      itemCategory: isManualEntry ? 'Non-Stock (Text)' : 'Stock Material'
    });
    
    addNotification(`Requisition ${trId} created successfully`, 'success');
    
    // Reset form
    setFormData({
      itemName: '',
      quantity: 1,
      vendor: '',
      price: 0,
      costCenter: '',
      itemCategory: 'Standard'
    });
  };

  const columns = [
    { key: 'transactionId', label: 'PR ID' },
    { key: 'itemName', label: 'Item/Description' },
    { key: 'itemCategory', label: 'Cat.' },
    { key: 'costCenter', label: 'Cost Ctr.', render: (val) => val || '---' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'price', label: 'Price' },
    { key: 'status', label: 'Status' },
  ];

  const requestedItems = orders.filter(o => o.status === 'Requested');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Purchase Requisition (ME51N)</h1>
          <p className="text-gray-500">Create Stock or Non-Stock (Free-Text) requests.</p>
        </div>
        
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button 
            onClick={() => { setIsManualEntry(false); setFormData({...formData, itemName: '', price: 0, costCenter: ''}); }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${!isManualEntry ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Database size={14} />
            Stock Item
          </button>
          <button 
            onClick={() => { setIsManualEntry(true); setFormData({...formData, itemName: '', price: 0}); }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${isManualEntry ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Edit3 size={14} />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Settings size={16} />
          {isManualEntry ? 'Non-Stock Purchase (Account Assignment K)' : 'Standard Material Purchase'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Item Selection/Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              {isManualEntry ? 'Description (Free Text)' : 'Material Master'}
            </label>
            {isManualEntry ? (
              <input 
                required
                type="text"
                placeholder="Enter service or item description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.itemName}
                onChange={e => setFormData({...formData, itemName: e.target.value})}
              />
            ) : (
              <select 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                value={formData.itemName}
                onChange={handleMaterialChange}
              >
                <option value="">-- Select from Master --</option>
                {masterData.materials.map(m => (
                  <option key={m.id} value={m.name}>{m.id} - {m.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Quantity</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Unit Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input 
                  required
                  readOnly={!isManualEntry}
                  type="number" 
                  className={`w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${!isManualEntry ? 'bg-gray-50 text-gray-500' : ''}`}
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Vendor Master</label>
            <select 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              value={formData.vendor}
              onChange={e => setFormData({...formData, vendor: e.target.value})}
            >
              <option value="">-- Select Vendor --</option>
              {masterData.vendors.map(v => (
                <option key={v.id} value={v.name}>{v.id} - {v.name}</option>
              ))}
            </select>
          </div>

          {/* Account Assignment Field (Only for Manual Entry) */}
          <div className={`space-y-1 transition-all duration-300 ${isManualEntry ? 'opacity-100 scale-100' : 'opacity-30 grayscale pointer-events-none'}`}>
            <label className="text-xs font-bold text-gray-500 uppercase">Account Assignment (Cost Center)</label>
            <select 
              required={isManualEntry}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white outline-none"
              value={formData.costCenter}
              onChange={e => setFormData({...formData, costCenter: e.target.value})}
            >
              <option value="">-- Assign to Dept --</option>
              {masterData.costCenters.map(c => (
                <option key={c.id} value={c.name}>{c.id} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2 flex justify-end items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Total</p>
              <p className="text-xl font-black text-blue-900">${(formData.price * formData.quantity).toLocaleString()}</p>
            </div>
            <button 
              type="submit"
              className="px-10 py-3 bg-blue-600 text-white rounded-lg font-black hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              SAVE REQUISITION
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Requisition Register (PR Items)</h2>
        <DataTable 
          columns={columns} 
          data={requestedItems} 
        />
      </div>
    </div>
  );
}
