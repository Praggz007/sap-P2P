'use client';

import { useOrders } from '@/hooks/useOrders';
import PurchaseOrderDocument from '@/components/PurchaseOrderDocument';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ChevronLeft } from 'lucide-react';

export default function PODocumentPage() {
  const { id } = useParams();
  const { orders, isHydrated } = useOrders();
  const router = useRouter();

  if (!isHydrated) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const order = orders.find(o => o.id.toString() === id);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Document Not Found</h1>
        <p className="text-gray-500 mb-6">The requested document could not be located in the system.</p>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          <ChevronLeft size={20} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/50 py-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold transition-colors"
        >
          <ChevronLeft size={20} />
          Back to System
        </button>
        
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#111827] text-white rounded-lg font-bold hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <Printer size={18} />
          PRINT DOCUMENT
        </button>
      </div>
      
      <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200">
        <PurchaseOrderDocument order={order} />
      </div>
      
      <div className="max-w-4xl mx-auto mt-8 text-center no-print">
        <p className="text-xs text-gray-400 font-medium">
          ProcureFlow SAP P2P Lab • Secure Document Generation • Internal Use Only
        </p>
      </div>
    </div>
  );
}
