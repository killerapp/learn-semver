'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  FolderOpen, 
  Settings, 
  GitBranch,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  FileCode,
  Package,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  title: string;
  icon?: React.ReactNode;
  active: boolean;
}

interface IDELayoutProps {
  children: React.ReactNode;
}

export default function IDELayout({ children }: IDELayoutProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: 'semver', 
      title: 'semver.tsx', 
      icon: <FileCode className="w-3 h-3" />,
      active: true 
    }
  ]);
  
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-[#0a0a0f] text-gray-100 flex flex-col font-mono overflow-hidden">
      {/* Top Bar - IDE Style */}
      <div className="h-8 bg-[#1a1a2e] border-b border-gray-800 flex items-center px-3 text-xs flex-shrink-0">
        <div className="flex items-center gap-2 text-emerald-400">
          <GitBranch className="w-3.5 h-3.5" />
          <span className="font-bold">agenticinsights</span>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">learn-semver</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            ~/projects/semver
          </span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="h-9 bg-[#16162a] border-b border-gray-800 flex items-center flex-shrink-0">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "h-9 px-4 flex items-center gap-2 border-r border-gray-800 cursor-pointer transition-all",
                tab.active 
                  ? "bg-[#0a0a0f] text-emerald-400 border-t-2 border-t-emerald-400" 
                  : "bg-[#1a1a2e] text-gray-400 hover:bg-[#16162a] hover:text-gray-300"
              )}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.title}</span>
              <button className="ml-2 hover:bg-gray-700 rounded p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {/* Add Tab Button */}
          <button className="h-9 px-3 flex items-center justify-center hover:bg-[#1a1a2e] transition-colors">
            <span className="text-gray-500">+</span>
          </button>
        </div>

        {/* Tab Actions */}
        <div className="ml-auto flex items-center gap-1 px-2">
          <a 
            href="https://agenticinsights.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200 block"
          >
            <X className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden min-h-0">
        {/* Optional Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-[#16162a] border-r border-gray-800 p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Explorer</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-800 p-1 rounded cursor-pointer">
                <ChevronRight className="w-3 h-3" />
                <FolderOpen className="w-4 h-4 text-emerald-400" />
                <span>src</span>
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 bg-[#0a0a0f] relative flex flex-col min-h-0">
          {/* Breadcrumb */}
          <div className="h-7 bg-[#0d0d1a] border-b border-gray-800 flex items-center px-4 text-xs text-gray-400 flex-shrink-0">
            <span className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              <span>src</span>
              <ChevronRight className="w-3 h-3" />
              <span>components</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-emerald-400">semver.tsx</span>
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-gray-500">TypeScript React</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">UTF-8</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Terminal/Bottom Bar */}
      <div className={cn(
        "bg-[#0d0d1a] border-t border-gray-800 transition-all duration-300 flex-shrink-0",
        terminalOpen ? "h-48" : "h-7"
      )}>
        {terminalOpen ? (
          <div className="flex flex-col h-full">
            {/* Terminal Header */}
            <div className="h-8 bg-[#16162a] border-b border-gray-800 flex items-center px-3">
              <div className="flex items-center gap-2 text-xs">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-gray-300">Terminal</span>
                <span className="text-gray-500">- bash</span>
              </div>
              <button
                onClick={() => setTerminalOpen(false)}
                className="ml-auto p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
            
            {/* Terminal Content */}
            <div className="flex-1 p-2 font-mono text-xs overflow-auto">
              <div className="text-gray-400">
                <span className="text-emerald-400">❯</span> npm run dev
              </div>
              <div className="text-gray-500 mt-1">
                <div>   ▲ Next.js 15.4.6</div>
                <div>   - Local:        http://localhost:3000</div>
                <div>   - Network:      http://192.168.1.100:3000</div>
                <div className="mt-1">✓ Ready in 2.1s</div>
              </div>
              <div className="text-gray-400 mt-2">
                <span className="text-emerald-400">❯</span> 
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        ) : (
          /* Status Bar */
          <div className="h-full flex items-center px-3 text-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTerminalOpen(true)}
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors text-gray-400"
              >
                <Terminal className="w-3.5 h-3.5" />
                Terminal
              </button>
              
              <span className="text-gray-500">UTF-8</span>
              <span className="text-gray-500">LF</span>
              <span className="text-gray-500">TypeScript React</span>
            </div>
            
            <div className="ml-auto flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Ready</span>
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                main
              </span>
              <span className="text-emerald-400">● Port 30020</span>
              <span className="text-gray-500">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}