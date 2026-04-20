'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Command } from 'lucide-react';
import { useNotification } from './NotificationProvider';

const T_CODES = {
  '/DB': '/dashboard',
  'ME51N': '/requisition',
  'ME21N': '/orders',
  'MIGO': '/goods-receipt',
  'MIRO': '/invoice',
  'F-53': '/payment',
};

const CommandBar = () => {
  const [input, setInput] = useState('');
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.toUpperCase().trim();
    
    if (T_CODES[cmd]) {
      router.push(T_CODES[cmd]);
      addNotification(`Navigating to ${cmd}`, 'info');
      setInput('');
    } else {
      addNotification(`Invalid T-Code: ${cmd}`, 'error');
    }
  };

  return (
    <div className="px-4 py-4 border-b border-white/10 bg-white/[0.03]">
      <form onSubmit={handleCommand} className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-cyan-300 transition-colors">
          <Terminal size={14} />
        </div>
        <input 
          type="text" 
          placeholder="Enter T-Code (e.g. ME51N)"
          className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-9 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15 placeholder:text-slate-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Command size={12} className="text-slate-600" />
        </div>
      </form>
    </div>
  );
};

export default CommandBar;
