'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import DataTable from '@/components/DataTable';
import { 
  Database, 
  Edit3, 
  Settings, 
  Package, 
  Truck, 
  DollarSign, 
  CreditCard,
  PlusCircle,
  FileText
} from 'lucide-react';

export default function Requisition() {
  const { orders, addOrder, isHydrated, masterData } = useOrders();
  const { addNotification } = useNotification();
  
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

    if (isManualEntry && !formData.costCenter) {
      addNotification('Non-stock items require a Cost Center (Account Assignment K)', 'error');
      return;
    }
    
    const trId = addOrder({
      ...formData,
      itemCategory: isManualEntry ? 'Non-Stock (Text)' : 'Stock Material'
    });
    
    addNotification(`Requisition ${trId} created successfully`, 'success');
    
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
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Requisition</h1>
              <p className="text-gray-500 font-medium">Transaction Code: ME51N</p>
            </div>
          </div>
        </div>
        
        <div className="inline-flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200">
          <button 
            onClick={() => { setIsManualEntry(false); setFormData({...formData, itemName: '', price: 0, costCenter: ''}); }}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!isManualEntry ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Database size={18} />
            Stock Material
          </button>
          <button 
            onClick={() => { setIsManualEntry(true); setFormData({...formData, itemName: '', price: 0}); }}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isManualEntry ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Edit3 size={18} />
            Free Text Entry
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Item Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Package size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Item Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">
                  {isManualEntry ? 'Description (Free Text)' : 'Select Material'}
                </label>
                {isManualEntry ? (
                  <input 
                    required
                    type="text"
                    placeholder="e.g., Office Supplies, Consulting Services..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                    value={formData.itemName}
                    onChange={e => setFormData({...formData, itemName: e.target.value})}
                  />
                ) : (
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.itemName}
                    onChange={handleMaterialChange}
                  >
                    <option value="">-- Choose from Master Data --</option>
                    {masterData.materials.map(m => (
                      <option key={m.id} value={m.name}>{m.id} - {m.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Quantity</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vendor & Pricing */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                <Truck size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Vendor & Pricing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Vendor Source</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.vendor}
                  onChange={e => setFormData({...formData, vendor: e.target.value})}
                >
                  <option value="">-- Select Vendor --</option>
                  {masterData.vendors.map(v => (
                    <option key={v.id} value={v.name}>{v.id} - {v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Net Unit Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input 
                    required
                    readOnly={!isManualEntry}
                    type="number" 
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${!isManualEntry ? 'text-gray-500 cursor-not-allowed' : ''}`}
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Account Assignment & Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Assignment</h2>
            </div>
            
            <div className={`space-y-4 transition-all duration-500 ${isManualEntry ? 'opacity-100 translate-y-0' : 'opacity-40 grayscale pointer-events-none -translate-y-2'}`}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Cost Center (Account K)</label>
                <select 
                  required={isManualEntry}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.costCenter}
                  onChange={e => setFormData({...formData, costCenter: e.target.value})}
                >
                  <option value="">-- Assign Dept --</option>
                  {masterData.costCenters.map(c => (
                    <option key={c.id} value={c.name}>{c.id} - {c.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 px-1">Required for non-stock items</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-200 text-white space-y-8">
            <div className="space-y-1">
              <h3 className="text-blue-100 text-sm font-bold uppercase tracking-wider">Estimated Total</h3>
              <p className="text-4xl font-black tabular-nums">
                ${(formData.price * formData.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <PlusCircle size={22} />
              Save Requisition
            </button>
            
            <p className="text-xs text-blue-200 text-center font-medium">
              System will generate a unique PR ID upon successful validation.
            </p>
          </div>
        </div>
      </form>

      {/* Register Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 text-white rounded-lg">
            <Settings size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Requisition Register</h2>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={requestedItems} 
          />
        </div>
      </div>
    </div>
  );
}
