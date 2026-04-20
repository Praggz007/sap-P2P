'use client';

import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '@/components/NotificationProvider';
import { 
  FileText, 
  ShoppingCart, 
  Package, 
  CreditCard,
  RefreshCcw,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const { getStats, isHydrated, resetOrders } = useOrders();
  const { addNotification } = useNotification();
  
  if (!isHydrated) return null;

  const stats = getStats();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all simulation data?')) {
      resetOrders();
      addNotification('Simulation data reset successfully', 'info');
    }
  };

  const statCards = [
    { label: 'Requests', value: stats.Requested, icon: FileText, tone: 'slate', helper: 'Awaiting buyer review' },
    { label: 'Purchase Orders', value: stats.Ordered, icon: ShoppingCart, tone: 'sky', helper: 'Released to suppliers' },
    { label: 'Goods Received', value: stats.Received, icon: Package, tone: 'amber', helper: 'Ready for invoice match' },
    { label: 'Paid Items', value: stats.Paid, icon: CreditCard, tone: 'emerald', helper: 'Closed transactions' },
  ];

  const toneClasses = {
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  };

  const workflowSteps = [
    { label: 'Requisition', status: 'Requested', icon: FileText },
    { label: 'Order', status: 'Ordered', icon: ShoppingCart },
    { label: 'Goods Receipt', status: 'Received', icon: Package },
    { label: 'Invoice', status: 'Invoiced', icon: CircleDollarSign },
    { label: 'Payment', status: 'Paid', icon: CheckCircle2 },
  ];

  const activeSteps = workflowSteps.filter((step) => stats[step.status] > 0).length;
  const completionRate = stats.Total ? Math.round((stats.Paid / stats.Total) * 100) : 0;
  const invoiceRisk = stats.PendingInvoices + stats.Received;
  const openWork = stats.Total - stats.Paid;

  const vendorSpend = Object.entries(stats.spendByVendor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const insights = [
    { label: 'Open cycle items', value: openWork, icon: Clock, note: 'Need movement before close' },
    { label: 'Invoice exposure', value: invoiceRisk, icon: AlertTriangle, note: 'Received or invoiced items' },
    { label: 'Completion rate', value: `${completionRate}%`, icon: ShieldCheck, note: 'Paid against total requests' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl shadow-slate-300/40">
        <div className="grid gap-6 p-6 text-white lg:grid-cols-[1.45fr_0.55fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-200">
              <Factory size={14} />
              Procure-to-pay command center
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
              Procurement Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor request intake, purchase order conversion, goods receipts, invoice exposure, and payment closure from one operational view.
            </p>
            <div className="mt-6 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="text-2xl font-black">{stats.Total}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Total items</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="text-2xl font-black">${stats.TotalSpend.toLocaleString()}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Paid spend</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="text-2xl font-black">{activeSteps}/5</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Active stages</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.06] p-5">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-200">Cycle completion</p>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-black text-emerald-200">{completionRate}%</span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300" style={{ width: `${completionRate}%` }} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Paid transactions are measured against all created requisitions in this simulation.
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-red-300/20 bg-red-400/10 px-4 py-2.5 text-sm font-bold text-red-100 transition-colors hover:bg-red-400/20"
            >
              <RefreshCcw size={16} />
              Reset Simulation
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={stat.label} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ring-1 ${toneClasses[stat.tone]}`}>
                <stat.icon size={22} />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-500">{stat.helper}</span>
              <ArrowUpRight size={16} className="text-slate-300 transition-colors group-hover:text-cyan-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <TrendingUp size={20} className="text-cyan-600" />
              Workflow Status Tracking
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{activeSteps} active stages</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            {workflowSteps.map((step, i) => {
              const isActive = stats[step.status] > 0;
              return (
                <div key={step.status} className="relative">
                  {i < workflowSteps.length - 1 && (
                    <div className="absolute left-[calc(50%+1.75rem)] top-7 hidden h-px w-[calc(100%-3.5rem)] bg-slate-200 sm:block" />
                  )}
                  <div className="relative flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-center">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-all ${
                      isActive
                        ? 'border-cyan-200 bg-cyan-50 text-cyan-700 shadow-lg shadow-cyan-100'
                        : 'border-slate-200 bg-white text-slate-300'
                    }`}>
                      <step.icon size={22} />
                    </div>
                    <span className={`mt-3 text-sm font-black ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</span>
                    <span className="mt-1 text-xs font-semibold text-slate-400">{stats[step.status]} items</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-cyan-600 to-slate-900 p-6 text-white shadow-xl shadow-cyan-900/20">
          <h2 className="flex items-center gap-2 text-lg font-black">
            <CircleDollarSign size={20} />
            Financial Summary
          </h2>
          <div className="space-y-4">
            <div className="pt-2">
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-100/80">Total Spend Paid</p>
              <p className="mt-2 text-4xl font-black tracking-tight">${stats.TotalSpend.toLocaleString()}</p>
            </div>
            <div className="space-y-3 border-t border-white/15 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-cyan-50/80">
                  <Clock size={14} />
                  <span>Pending Orders</span>
                </div>
                <span className="font-bold">{stats.PendingOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-cyan-50/80">
                  <Clock size={14} />
                  <span>Pending Invoices</span>
                </div>
                <span className="font-bold">{stats.PendingInvoices}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 lg:col-span-2">
          <h2 className="text-lg font-black text-slate-900">Top Paid Suppliers</h2>
          <div className="mt-5 space-y-4">
            {vendorSpend.length > 0 ? vendorSpend.map(([vendor, spend]) => {
              const percent = stats.TotalSpend ? Math.round((spend / stats.TotalSpend) * 100) : 0;
              return (
                <div key={vendor}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700">{vendor}</span>
                    <span className="font-black text-slate-950">${spend.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-cyan-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-500">
                Paid supplier spend will appear here after invoices are settled.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <h2 className="text-lg font-black text-slate-900">Operational Signals</h2>
          <div className="mt-5 space-y-3">
            {insights.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-cyan-700 shadow-sm">
                  <item.icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-slate-800">{item.label}</p>
                    <p className="text-sm font-black text-slate-950">{item.value}</p>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
