import { useState, useEffect, useRef } from 'react';

const MAX_INPUT_LENGTH = 256;
const TELEMETRY_URL = import.meta.env.VITE_TELEMETRY_URL || '';

/** Strip control characters and limit length for safe display (XSS defense-in-depth). */
function sanitizeInput(raw) {
  const trimmed = String(raw).trim().slice(0, MAX_INPUT_LENGTH);
  return trimmed.replace(/[\x00-\x1f\x7f]/g, '');
}

/** Validate telemetry shape for safe display; never render raw API response. */
function safeTelemetry(data) {
  if (!data || typeof data !== 'object' || data.error) return null;
  const cpu = typeof data.cpu === 'number' ? Math.min(100, Math.max(0, data.cpu)) : null;
  const mem = typeof data.mem === 'number' ? Math.min(100, Math.max(0, data.mem)) : null;
  const uptime = typeof data.uptime === 'number' && data.uptime >= 0 ? data.uptime : null;
  if (cpu == null && mem == null && uptime == null) return null;
  return { cpu, mem, uptime };
}

const TerminalApp = () => {
  const [history, setHistory] = useState(['Colin Cherry Interactive Shell v2.4', 'Connected to Oracle Cloud Instance (Ubuntu)', "Type 'help' for commands."]);
  const [input, setInput] = useState('');
  const [telemetry, setTelemetry] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!TELEMETRY_URL) return;
    const fetchTelemetry = async () => {
      try {
        const response = await fetch(TELEMETRY_URL);
        if (!response.ok) throw new Error('Bad response');
        const data = await response.json();
        setTelemetry(safeTelemetry(data));
      } catch {
        setTelemetry({ error: true });
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const raw = input.trim().toLowerCase();
      const cmd = sanitizeInput(raw);
      const displayInput = sanitizeInput(input);
      let output = `guest@cherry-os:~$ ${displayInput}`;
      switch (cmd) {
        case 'help':
          output += '\nCommands: whoami, ls, clear, reboot, telemetry';
          break;
        case 'whoami':
          output += '\nColin Cherry | IT Pro | Producer | Gamer';
          break;
        case 'ls':
          output += '\nresume.pdf  beats/  projects/  anime_list.json';
          break;
        case 'telemetry':
          if (telemetry && !telemetry.error && (telemetry.cpu != null || telemetry.mem != null || telemetry.uptime != null)) {
            const cpu = telemetry.cpu != null ? `${telemetry.cpu}%` : '?';
            const mem = telemetry.mem != null ? `${telemetry.mem}%` : '?';
            const uptimeStr = telemetry.uptime != null ? `${Math.floor(telemetry.uptime / 3600)}h ${Math.floor((telemetry.uptime % 3600) / 60)}m` : '?';
            output += `\nCPU: ${cpu} | MEM: ${mem} | Uptime: ${uptimeStr}`;
          } else {
            output += '\nTelemetry data unavailable. Host unreachable or connection refused.';
          }
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'reboot':
          window.location.reload();
          return;
        default:
          if (cmd) output += `\nError: Command '${cmd}' not recognized.`;
      }
      setHistory((prev) => [...prev, output]);
      setInput('');
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="bg-[#0c0c0c] text-green-500 font-mono text-sm h-full p-4 flex flex-col cursor-text" onClick={(e) => e.stopPropagation()}>
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center mt-2 border-t border-gray-800 pt-2">
        <span className="mr-2 text-yellow-500">guest@cherry-os:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none flex-1 text-green-400 focus:ring-0"
          autoComplete="off"
          maxLength={MAX_INPUT_LENGTH}
          autoFocus
        />
      </div>
    </div>
  );
};

export default TerminalApp;
