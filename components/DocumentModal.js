'use client';

import { X, Printer, Maximize2 } from 'lucide-react';
import PurchaseOrderDocument from './PurchaseOrderDocument';
import Link from 'next/link';

const DocumentModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const isPO = order.status === 'Ordered' || order.status === 'Received';
  const isInvoice = order.status === 'Invoiced' || order.status === 'Paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800">
              {isPO ? 'Purchase Order' : isInvoice ? 'Commercial Invoice' : 'Document View'}
            </h3>
            <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {order.transactionId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href={`/po-document/${order.id}`}
              target="_blank"
              className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
              title="Open in Full Screen"
            >
              <Maximize2 size={18} />
            </Link>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100/30 p-4 md:p-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
            <PurchaseOrderDocument order={order} />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Printer size={16} />
            Print
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
