'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileEdit, 
  ShoppingCart, 
  PackageCheck, 
  Receipt, 
  CreditCard,
  Boxes
} from 'lucide-react';

import CommandBar from './CommandBar';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, tcode: '/DB' },
    { label: 'Requisition', path: '/requisition', icon: <FileEdit size={20} />, tcode: 'ME51N' },
    { label: 'Orders', path: '/orders', icon: <ShoppingCart size={20} />, tcode: 'ME21N' },
    { label: 'Goods Receipt', path: '/goods-receipt', icon: <PackageCheck size={20} />, tcode: 'MIGO' },
    { label: 'Invoice', path: '/invoice', icon: <Receipt size={20} />, tcode: 'MIRO' },
    { label: 'Payment', path: '/payment', icon: <CreditCard size={20} />, tcode: 'F-53' },
  ];

  return (
    <>
    <aside className="hidden md:flex w-72 h-screen bg-slate-950 text-white flex-col fixed left-0 top-0 border-r border-white/10 shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/30">
            <Boxes size={22} />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-black tracking-tight">ProcureFlow</div>
            <div className="text-[10px] text-slate-400 font-mono tracking-[0.28em] uppercase">SAP P2P Lab</div>
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
            <span>System</span>
            <span className="text-emerald-300">Online</span>
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-200">PROD-100 Operations</div>
        </div>
      </div>
      <CommandBar />
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`group flex items-center justify-between rounded-lg px-3 py-3 transition-all ${
                isActive
                  ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/20'
                  : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              <span className={`rounded border px-1.5 py-0.5 text-[9px] font-mono ${
                isActive ? 'border-slate-900/15 text-slate-800' : 'border-white/10 text-slate-600 group-hover:text-slate-300'
              }`}>{item.tcode}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur md:hidden">
      <nav className="flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-label={item.label}
              className={`flex h-12 items-center justify-center rounded-lg transition-colors ${
                isActive ? 'bg-slate-950 text-cyan-300' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>
    </div>
    </>
  );
};

export default Sidebar;
