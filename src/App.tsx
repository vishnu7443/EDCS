import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  GitBranch, 
  Box, 
  BarChart3, 
  ScrollText, 
  Settings, 
  Bell, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Play
} from 'lucide-react';
import { AppState, WorkflowStage, LogEntry, EventModule } from './types';

// --- Components ---

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid credentials. Access Denied.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 space-y-8 border-red-900/50 shadow-[0_0_30px_rgba(255,0,0,0.1)]"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-red-700 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,0,0,0.4)]">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight uppercase italic text-red-600 flicker-text">System Authentication</h2>
          <p className="text-zinc-500 text-sm">Enter administrative credentials to proceed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/60 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-600 text-xs font-medium text-center">{error}</div>}
          <button 
            type="submit"
            className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 uppercase tracking-widest"
          >
            Authorize Access
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const menuItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'WORKFLOW', icon: GitBranch, label: 'Workflow' },
    { id: 'MODULES', icon: Box, label: 'Modules' },
    { id: 'ANALYTICS', icon: BarChart3, label: 'Analytics' },
    { id: 'LOGS', icon: ScrollText, label: 'Logs' },
    { id: 'SETTINGS', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 border-r border-red-900/30 h-full flex flex-col bg-black/40 backdrop-blur-md">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-red-700 rounded flex items-center justify-center shadow-[0_0_10px_rgba(255,0,0,0.3)]">
          <Cpu size={20} className="text-white" />
        </div>
        <span className="font-bold tracking-tight text-sm uppercase text-red-600 flicker-text">EDC System</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              activeTab === item.id 
                ? 'bg-red-700/20 text-red-500 border border-red-600/30' 
                : 'text-zinc-500 hover:text-red-400 hover:bg-red-900/10'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-red-900/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-700 to-black border border-red-600/30" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-red-500">Admin User</span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">Authorized Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopBar = () => (
  <div className="h-16 border-b border-red-900/30 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
        <span className="text-[10px] uppercase tracking-widest text-red-500/70">System Status: Operational</span>
      </div>
      <div className="h-4 w-[1px] bg-red-900/30" />
      <div className="flex items-center gap-2">
        <ShieldCheck size={14} className="text-red-500" />
        <span className="text-[10px] uppercase tracking-widest text-red-500/70">Security: Level 4</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-red-900 hover:text-red-500 transition-colors">
        <Bell size={18} />
      </button>
      <div className="h-8 w-8 rounded-lg bg-red-950/20 flex items-center justify-center border border-red-900/30">
        <span className="text-xs font-mono text-red-500">01</span>
      </div>
    </div>
  </div>
);

const DashboardHome = () => (
  <div className="p-8 space-y-8 h-full overflow-y-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-red-600 flicker-text uppercase italic">System Overview</h1>
        <p className="text-zinc-600 text-sm">Real-time deployment monitoring and control.</p>
      </div>
      <div className="flex gap-3">
        <div className="px-4 py-2 glass-panel flex items-center gap-2 border-red-900/30">
          <Activity size={16} className="text-red-500" />
          <span className="text-xs font-mono text-red-400">CPU: 12%</span>
        </div>
        <div className="px-4 py-2 glass-panel flex items-center gap-2 border-red-900/30">
          <Box size={16} className="text-red-700" />
          <span className="text-xs font-mono text-red-400">MEM: 4.2GB</span>
        </div>
      </div>
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-red-950/20 border border-red-600/30 rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(255,0,0,0.05)]"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="text-red-600" />
        <span className="text-sm font-medium text-red-500 uppercase tracking-tight">Event Deployment Authorization Required</span>
      </div>
      <button className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all uppercase tracking-widest">
        Review Workflow
      </button>
    </motion.div>

    <div className="grid grid-cols-3 gap-6">
      <div className="glass-panel p-6 space-y-4 border-red-900/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Pending Requests</span>
          <ChevronRight size={14} className="text-red-900" />
        </div>
        <div className="text-3xl font-mono text-red-500">03</div>
        <div className="h-1 w-full bg-red-950/30 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-red-600" />
        </div>
      </div>
      <div className="glass-panel p-6 space-y-4 border-red-900/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Active Modules</span>
          <ChevronRight size={14} className="text-red-900" />
        </div>
        <div className="text-3xl font-mono text-red-500">00</div>
        <div className="h-1 w-full bg-red-950/30 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-red-600" />
        </div>
      </div>
      <div className="glass-panel p-6 space-y-4 border-red-900/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">System Health</span>
          <ChevronRight size={14} className="text-red-900" />
        </div>
        <div className="text-3xl font-mono text-red-600 flicker-text">99.9%</div>
        <div className="h-1 w-full bg-red-950/30 rounded-full overflow-hidden">
          <div className="h-full w-[99%] bg-red-600" />
        </div>
      </div>
    </div>
  </div>
);

const WorkflowPanel = ({ onAuthorize }: { onAuthorize: () => void }) => {
  const stages: WorkflowStage[] = [
    { id: '1', label: 'Idea Submission', status: 'completed' },
    { id: '2', label: 'Review Process', status: 'completed' },
    { id: '3', label: 'Admin Authorization', status: 'pending' },
    { id: '4', label: 'Module Activation', status: 'locked' },
    { id: '5', label: 'Event Deployment', status: 'locked' },
  ];

  return (
    <div className="p-8 space-y-12 h-full flex flex-col items-center justify-center">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-red-600 flicker-text uppercase italic">Deployment Workflow</h2>
        <p className="text-zinc-600">Authorize the automated sequence to activate event modules.</p>
      </div>

      <div className="relative flex items-center gap-4 w-full max-w-5xl">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                stage.status === 'completed' ? 'bg-red-900/20 border-red-600 text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.2)]' :
                stage.status === 'pending' ? 'bg-red-700/20 border-red-500 text-red-500 animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.4)]' :
                'bg-black/40 border-red-900/20 text-zinc-700'
              }`}>
                {stage.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="font-mono text-lg">{index + 1}</span>}
              </div>
              <div className="text-center">
                <div className={`text-xs font-bold uppercase tracking-wider ${
                  stage.status === 'completed' ? 'text-red-500' :
                  stage.status === 'pending' ? 'text-red-600' :
                  'text-zinc-700'
                }`}>{stage.label}</div>
                <div className="text-[10px] text-zinc-600 mt-1">
                  {stage.status === 'completed' ? 'Verified' : stage.status === 'pending' ? 'Awaiting Action' : 'Locked'}
                </div>
              </div>
            </div>
            {index < stages.length - 1 && (
              <div className={`h-[2px] flex-1 -mt-10 transition-all duration-500 ${
                stage.status === 'completed' ? 'bg-red-600' : 'bg-red-900/10'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAuthorize}
        className="mt-8 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(255,0,0,0.3)] flex items-center gap-3 transition-all uppercase tracking-widest"
      >
        <Play size={20} fill="currentColor" />
        Authorize Deployment
      </motion.button>
    </div>
  );
};

const ExecutingWorkflow = ({ onComplete }: { onComplete: () => void }) => {
  const [activeStage, setActiveStage] = useState(2); // Start at Admin Authorization
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const stages = [
    'Idea Submission',
    'Review Process',
    'Admin Authorization',
    'Module Activation',
    'Event Deployment'
  ];

  const addLog = (text: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }]);
  };

  useEffect(() => {
    const sequence = async () => {
      addLog('> Authorization verified');
      await new Promise(r => setTimeout(r, 1000));
      addLog('> Workflow execution started');
      setActiveStage(3);
      await new Promise(r => setTimeout(r, 1500));
      addLog('> Preparing event modules');
      setActiveStage(4);
      await new Promise(r => setTimeout(r, 1000));
      addLog('> Modules detected: 3');
      addLog('> Finalizing deployment sequence...');
      await new Promise(r => setTimeout(r, 1500));
      onComplete();
    };
    sequence();
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-8 h-full flex gap-8">
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative flex items-center gap-4 w-full">
          {stages.map((label, index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  index <= activeStage ? 'bg-red-900/20 border-red-600 text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)]' :
                  'bg-black/40 border-red-900/20 text-zinc-700'
                }`}>
                  {index <= activeStage ? <CheckCircle2 size={24} /> : <span className="font-mono text-lg">{index + 1}</span>}
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider text-center ${
                  index <= activeStage ? 'text-red-500' : 'text-zinc-700'
                }`}>{label}</div>
              </div>
              {index < stages.length - 1 && (
                <div className={`h-[2px] flex-1 -mt-10 transition-all duration-500 ${
                  index < activeStage ? 'bg-red-600' : 'bg-red-900/10'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between text-xs font-mono text-red-900">
            <span>DEPLOYMENT PROGRESS</span>
            <span>{Math.round((activeStage + 1) / stages.length * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-red-950/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '60%' }}
              animate={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
              className="h-full bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)]"
            />
          </div>
        </div>
      </div>

      <div className="w-80 glass-panel flex flex-col overflow-hidden border-red-900/30">
        <div className="p-4 border-b border-red-900/30 flex items-center gap-2">
          <ScrollText size={16} className="text-red-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">System Logs</span>
        </div>
        <div ref={logContainerRef} className="flex-1 p-4 font-mono text-[10px] space-y-2 overflow-y-auto scrollbar-hide">
          {logs.map(log => (
            <div key={log.id} className="flex gap-2">
              <span className="text-red-900">[{log.timestamp}]</span>
              <span className="text-red-400">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TerminalReveal = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>(['System ready. Awaiting commands...', 'Available commands: execute module_01, execute module_02, execute module_03']);
  const [revealedModules, setRevealedModules] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const modules: EventModule[] = [
    { id: '01', title: 'PROMPTLY', type: 'TECHNICAL', tagline: 'Master the Art of Prompting', status: 'ACTIVE', description: 'A challenge to solve complex problems using LLMs and advanced prompt engineering techniques.' },
    { id: '02', title: 'DEBUG DETECTIVE', type: 'TECHNICAL', tagline: 'Uncover the Hidden Bugs', status: 'ACTIVE', description: 'A race against time to find and fix critical system vulnerabilities and code defects.' },
    { id: '03', title: 'THINK TANK THROWDOWN', type: 'NON-TECHNICAL', tagline: 'The Ultimate Brainstorming Battle', status: 'ACTIVE', description: 'A high-energy competition of strategy, innovation, and persuasive pitching.' },
  ];

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !inputValue.trim()) return;

    const cmd = inputValue.trim().toLowerCase();
    setLines(prev => [...prev, `> ${inputValue}`]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate processing
    await new Promise(r => setTimeout(r, 600));

    if (cmd === 'execute module_01' && revealedModules === 0) {
      setLines(prev => [...prev, 'Initializing Module 01...', 'Loading event configuration...', 'Module Activated.']);
      setRevealedModules(1);
    } else if (cmd === 'execute module_02' && revealedModules === 1) {
      setLines(prev => [...prev, 'Creative engagement module detected.', 'Loading event interface...', 'Module Activated.']);
      setRevealedModules(2);
    } else if (cmd === 'execute module_03' && revealedModules === 2) {
      setLines(prev => [...prev, 'Expression module detected.', 'Initializing participation system...', 'Module Activated.']);
      setRevealedModules(3);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setLines(prev => [...prev, 'Error: Invalid command or sequence. Check module status.']);
    }
    setIsProcessing(false);
  };

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center space-y-8">
      <div className="w-full max-w-3xl glass-panel bg-black/80 border-red-900/50 shadow-[0_0_40px_rgba(255,0,0,0.2)] overflow-hidden">
        <div className="h-8 bg-red-950/20 border-b border-red-900/30 flex items-center px-4 gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600/50" />
          <div className="w-2 h-2 rounded-full bg-red-800/50" />
          <div className="w-2 h-2 rounded-full bg-red-900/50" />
          <span className="text-[10px] font-mono text-red-900 ml-2">system_terminal_v2.0.sh</span>
        </div>
        <div className="p-6 font-mono text-sm min-h-[250px] max-h-[350px] overflow-y-auto scrollbar-hide flex flex-col">
          <div className="flex-1 space-y-1">
            {lines.map((line, i) => (
              <div key={i} className={line.startsWith('>') ? 'text-red-500' : line.startsWith('Error') ? 'text-red-700' : 'text-red-600'}>
                {line}
              </div>
            ))}
          </div>
          <form onSubmit={handleCommand} className="mt-4 flex items-center text-red-500">
            <span className="mr-2">{`> `}</span>
            <input 
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isProcessing}
              className="bg-transparent border-none outline-none flex-1 text-red-500"
              placeholder={isProcessing ? "Processing..." : "Type command..."}
            />
            {!isProcessing && <span className="inline-block w-2 h-4 bg-red-600 ml-1 cursor-blink" />}
          </form>
        </div>
      </div>

      <div className="flex gap-6 w-full max-w-5xl justify-center">
        <AnimatePresence>
          {modules.slice(0, revealedModules).map((module, idx) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex-1 glass-panel p-6 border-red-900/30 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-2">
                <div className="text-[10px] font-mono text-red-900/50">MOD_{module.id}</div>
              </div>
              <div className="space-y-4">
                <div className="inline-block px-2 py-1 bg-red-950/20 border border-red-900/30 rounded text-[10px] font-bold text-red-600">
                  {module.type}
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight group-hover:text-red-500 transition-colors uppercase italic">{module.title}</h3>
                  <p className="text-xs text-zinc-600 italic mt-1">{module.tagline}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
                  <span className="text-[10px] font-bold text-red-600">STATUS: ACTIVE</span>
                </div>
                {idx === 2 && (
                  <div className="pt-4 border-t border-red-900/20 space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-600">
                      <span>PARTICIPATION</span>
                      <span className="text-red-600">84%</span>
                    </div>
                    <div className="h-1 w-full bg-red-950/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '84%' }}
                        transition={{ duration: 2 }}
                        className="h-full bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FinalSummary = () => {
  const modules: EventModule[] = [
    { id: '01', title: 'PROMPTLY', type: 'TECHNICAL', tagline: 'Master the Art of Prompting', status: 'ACTIVE', description: 'A challenge to solve complex problems using LLMs and advanced prompt engineering techniques.' },
    { id: '02', title: 'DEBUG DETECTIVE', type: 'TECHNICAL', tagline: 'Uncover the Hidden Bugs', status: 'ACTIVE', description: 'A race against time to find and fix critical system vulnerabilities and code defects.' },
    { id: '03', title: 'THINK TANK THROWDOWN', type: 'NON-TECHNICAL', tagline: 'The Ultimate Brainstorming Battle', status: 'ACTIVE', description: 'A high-energy competition of strategy, innovation, and persuasive pitching.' },
  ];

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center space-y-12 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.05),transparent)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/20 border border-red-600/30 rounded-full text-red-500 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,0,0.2)]">
          <CheckCircle2 size={14} />
          System Status: Fully Deployed
        </div>
        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-red-600 flicker-text">Event Deployment Complete</h1>
        <p className="text-zinc-500 max-w-2xl mx-auto">All modules have been successfully authorized and activated. The registration portal is now live for all authorized departments.</p>
      </motion.div>

      <div className="flex gap-6 w-full max-w-6xl">
        {modules.map((module, idx) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="flex-1 glass-panel p-8 border-red-900/20 relative group hover:border-red-600/50 transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.05)]"
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40 border border-red-600/30">
              <span className="font-mono font-bold text-lg text-white">{module.id}</span>
            </div>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{module.type}</div>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-red-500 transition-colors uppercase italic">{module.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{module.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-red-900/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
                  <span className="text-[10px] font-bold text-red-600">LIVE</span>
                </div>
                <button className="text-[10px] font-bold text-red-700 hover:text-red-500 transition-colors uppercase tracking-widest">View Details</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-6xl grid grid-cols-4 gap-8 pt-12 border-t border-red-900/30"
      >
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Registration Portal</div>
          <div className="text-sm font-bold text-red-600 flicker-text">OPEN</div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Department</div>
          <div className="text-sm font-bold text-zinc-400">Computer Science & Engineering</div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">College</div>
          <div className="text-sm font-bold text-zinc-400">Institute of Technology</div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Event Date</div>
          <div className="text-sm font-bold text-zinc-400">March 13-14, 2026</div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<AppState>('INITIALIZING');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (state === 'INITIALIZING') {
      const timer = setTimeout(() => {
        setState('LOGIN_FORM');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleLogin = () => {
    setShowNotification(true);
    setTimeout(() => {
      setState('DASHBOARD');
      setShowNotification(false);
    }, 2000);
  };

  const renderContent = () => {
    switch (state) {
      case 'LOGIN_FORM':
        return <LoginForm onLogin={handleLogin} />;
      case 'DASHBOARD':
        return <DashboardHome />;
      case 'WORKFLOW':
        return <WorkflowPanel onAuthorize={() => setState('EXECUTING')} />;
      case 'EXECUTING':
        return <ExecutingWorkflow onComplete={() => setState('TERMINAL')} />;
      case 'TERMINAL':
        return <TerminalReveal onComplete={() => setState('SUMMARY')} />;
      case 'SUMMARY':
        return <FinalSummary />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#050000] selection:bg-red-600/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-950/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-6 right-6 z-50 glass-panel px-6 py-4 flex items-center gap-4 border-red-600/30 shadow-[0_0_20px_rgba(255,0,0,0.2)]"
          >
            <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-red-500">Access Granted</div>
              <div className="text-xs text-zinc-500">Admin Authorized</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {state === 'INITIALIZING' ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-red-700 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.4)] border border-red-600/30">
              <Cpu size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter uppercase italic text-red-600 flicker-text">EDC System</h1>
              <p className="text-zinc-600 text-sm font-mono uppercase">Initializing secure connection...</p>
            </div>
            <div className="w-48 h-1 bg-red-950/30 rounded-full mx-auto overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-1/2 h-full bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)]"
              />
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {state !== 'LOGIN_FORM' && (
            <Sidebar activeTab={state === 'DASHBOARD' ? 'DASHBOARD' : 'WORKFLOW'} onTabChange={(tab) => {
              if (tab === 'DASHBOARD') setState('DASHBOARD');
              if (tab === 'WORKFLOW') setState('WORKFLOW');
            }} />
          )}
          <div className="flex-1 flex flex-col relative">
            {state !== 'LOGIN_FORM' && <TopBar />}
            <main className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
