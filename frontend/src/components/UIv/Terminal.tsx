import React, { useState, useEffect, useRef } from "react";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    Array<{ type: "command" | "output"; text: string }>
  >([
    { type: "output", text: "SECURE TERMINAL v2.4.1" },
    { type: "output", text: 'Type "help" for available commands' },
    { type: "output", text: "" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    setHistory((prev) => [...prev, { type: "command", text: `$ ${cmd}` }]);

    let output = "";
    switch (command) {
      case "help":
        output = `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  status   - System status
  scan     - Run security scan
  whoami   - Display user info
  exit     - Close terminal`;
        break;
      case "clear":
        setHistory([]);
        return;
      case "status":
        output = `System Status: ONLINE
Security Level: MAXIMUM
Firewall: ACTIVE
Connections: 247 secured`;
        break;
      case "scan":
        output = `Initiating security scan...
[████████████████] 100%
Scan complete. No threats detected.`;
        break;
      case "whoami":
        output = `User: root@localhost
Access Level: Administrator
Session: Active`;
        break;
      case "exit":
        output = "Terminating session...";
        break;
      default:
        output = `Command not found: ${cmd}`;
    }

    setHistory((prev) => [
      ...prev,
      { type: "output", text: output },
      { type: "output", text: "" },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none vt323-regular">
      <div className="w-full max-w-3xl h-[500px] bg-black/90 border-2 border-green-500 rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.3)] backdrop-blur-sm pointer-events-auto">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-green-500/50 bg-green-500/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-green-400 text-sm vt323-regular ">
            root@secure-terminal
          </span>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="h-[calc(100%-100px)] overflow-y-auto p-4 font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === "command" ? "text-green-400" : "text-green-300/80"
              }
            >
              {line.text.split("\n").map((text, j) => (
                <div key={j}>{text || "\u00A0"}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Terminal Input */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-t border-green-500/50 bg-green-500/5"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-green-400 font-mono outline-none placeholder-green-600"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );
}
