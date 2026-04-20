'use client';

import React from 'react';

const PurchaseOrderDocument = ({ order }) => {
  if (!order) return null;

  // Format date to DD/MM/YYYY as seen in the image
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // en-GB uses DD/MM/YYYY
  };

  return (
    <div className="bg-white p-8 md:p-12 font-serif max-w-4xl mx-auto" id="printable-doc">
      {/* Document Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#1e3a8a] leading-none mb-1">SAP P2P CORP</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-sans font-bold">Enterprise Procurement Division</p>
          <div className="pt-8 text-sm text-gray-600 font-sans leading-relaxed">
            <p>123 ERP Avenue, Tech City</p>
            <p>Digital State, 56789</p>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <div className="bg-[#111827] text-white px-5 py-1.5 text-xs font-black mb-6 uppercase tracking-[0.25em] font-sans rounded-sm">
            {order.status === 'Ordered' ? 'ORDERED' : order.status.toUpperCase()}
          </div>
          <div className="space-y-1 font-sans text-sm text-gray-500">
            <p><span className="font-semibold text-gray-400">Date:</span> {formatDate(order.createdAt)}</p>
            <p><span className="font-semibold text-gray-400">Doc #:</span> {order.id}</p>
          </div>
        </div>
      </div>

      {/* Ship To / Vendor Section */}
      <div className="grid grid-cols-2 gap-12 mb-10 border-t border-b border-gray-100 py-10">
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 font-sans tracking-widest">Ship To:</h4>
          <div className="text-sm text-gray-800 leading-relaxed font-sans">
            <p className="font-bold text-base mb-1">Central Warehouse A1</p>
            <p>Unit 45, Logi-Park</p>
            <p>Sector 9, Digital Hub</p>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 font-sans tracking-widest">Vendor:</h4>
          <div className="text-sm text-gray-800 leading-relaxed font-sans">
            <p className="font-bold text-base mb-1">{order.vendor}</p>
            <p>Approved SAP Partner</p>
            <p>Certified Supplier Network</p>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="py-3 text-[10px] font-black uppercase font-sans tracking-widest">Description</th>
              <th className="py-3 text-[10px] font-black uppercase font-sans tracking-widest text-right">Quantity</th>
              <th className="py-3 text-[10px] font-black uppercase font-sans tracking-widest text-right">Price</th>
              <th className="py-3 text-[10px] font-black uppercase font-sans tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            <tr>
              <td className="py-8 text-sm font-bold text-gray-900">{order.itemName}</td>
              <td className="py-8 text-sm text-right text-gray-700">{order.quantity}</td>
              <td className="py-8 text-sm text-right text-gray-700">${order.price.toLocaleString()}</td>
              <td className="py-8 text-sm text-right font-bold text-gray-900">${(order.price * order.quantity).toLocaleString()}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-800">
              <td colSpan="3" className="py-6 text-[10px] font-black text-right uppercase font-sans tracking-widest pr-10">Grand Total</td>
              <td className="py-6 text-xl font-black text-right text-gray-900 font-sans">${(order.price * order.quantity).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="bg-gray-50/50 p-8 rounded-lg text-[11px] text-gray-500 font-sans space-y-2 leading-relaxed border border-gray-100">
        <p>1. This is a computer-generated document for SAP Simulation purposes.</p>
        <p>2. Subject to standard ERP procurement terms and conditions.</p>
        <p>3. Electronic verification ID: <span className="font-mono text-gray-400">{order.transactionId}-{order.id}</span></p>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-doc, #printable-doc * {
            visibility: visible;
          }
          #printable-doc {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PurchaseOrderDocument;
