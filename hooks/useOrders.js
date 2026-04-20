'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sap_p2p_orders';

export const MASTER_DATA = {
  vendors: [
    { id: 'V100', name: 'Dell Technologies', terms: 'Net 30' },
    { id: 'V200', name: 'Microsoft Corporation', terms: 'Net 15' },
    { id: 'V300', name: 'Amazon Web Services', terms: 'Due on Receipt' },
    { id: 'V400', name: 'Apple Inc.', terms: 'Net 45' },
  ],
  materials: [
    { id: 'M001', name: 'Laptops - Latitude 5000', price: 1200 },
    { id: 'M002', name: 'Cloud Server Instance', price: 500 },
    { id: 'M003', name: 'Software License - ERP', price: 2500 },
    { id: 'M004', name: 'Peripheral - Monitor 4K', price: 350 },
  ],
  costCenters: [
    { id: '1000', name: 'IT Infrastructure' },
    { id: '2000', name: 'Finance & Accounts' },
    { id: '3000', name: 'Human Resources' },
    { id: '4000', name: 'Marketing & Sales' },
  ]
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse orders:', e);
        setOrders([]);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever orders change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  const addOrder = (orderData) => {
    const id = Date.now();
    const newOrder = {
      ...orderData,
      id: id,
      transactionId: `PR-${id.toString().slice(-4)}`,
      status: 'Requested',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder.transactionId;
  };

  const updateStatus = (id, newStatus, extraData = {}) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const updated = { ...order, status: newStatus, ...extraData };
          if (newStatus === 'Ordered') updated.transactionId = updated.transactionId.replace('PR', 'PO');
          if (newStatus === 'Received') updated.transactionId = updated.transactionId.replace('PO', 'GR');
          if (newStatus === 'Invoiced') updated.transactionId = updated.transactionId.replace('GR', 'INV');
          if (newStatus === 'Paid') updated.transactionId = updated.transactionId.replace('INV', 'PAY');
          return updated;
        }
        return order;
      })
    );
  };

  const resetOrders = () => {
    setOrders([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getStats = () => {
    const counts = {
      Requested: 0,
      Ordered: 0,
      Received: 0,
      Invoiced: 0,
      Paid: 0,
      Total: orders.length,
      TotalSpend: 0,
      PendingOrders: 0,
      PendingInvoices: 0,
      spendByVendor: {},
    };
    
    orders.forEach((o) => {
      counts[o.status]++;
      if (o.status === 'Paid') {
        const amount = (o.price * o.quantity);
        counts.TotalSpend += amount;
        counts.spendByVendor[o.vendor] = (counts.spendByVendor[o.vendor] || 0) + amount;
      }
      if (o.status === 'Requested') counts.PendingOrders++;
      if (o.status === 'Invoiced') counts.PendingInvoices++;
    });
    
    return counts;
  };

  return {
    orders,
    addOrder,
    updateStatus,
    resetOrders,
    getStats,
    isHydrated,
    masterData: MASTER_DATA,
  };
};
