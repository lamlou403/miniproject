import figlet from "figlet";
import standard from "figlet/importable-fonts/Standard";
import { useEffect, useState } from "react";
const SECURE_CHECK_LOGO = `
  /$$$$$$                                                     /$$$$$$  /$$                           /$$      
 /$$__  $$                                                   /$$__  $$| $$                          | $$      
| $$  \\__/  /$$$$$$   /$$$$$$$ /$$   /$$  /$$$$$$   /$$$$$$ | $$  \\__/| $$$$$$$   /$$$$$$   /$$$$$$$| $$   /$$
|  $$$$$$  /$$__  $$ /$$_____/| $$  | $$ /$$__  $$ /$$__  $$| $$      | $$__  $$ /$$__  $$ /$$_____/| $$  /$$/
 \\____  $$| $$$$$$$$| $$      | $$  | $$| $$  \\__/| $$$$$$$$| $$      | $$  \\ $$| $$$$$$$$| $$      | $$$$$$/ 
 /$$  \\ $$| $$_____/| $$      | $$  | $$| $$      | $$_____/| $$    $$| $$  | $$| $$_____/| $$      | $$_  $$ 
|  $$$$$$/|  $$$$$$$|  $$$$$$$|  $$$$$$/| $$      |  $$$$$$$|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \\  $$
 \\______/  \\_______/ \\_______/ \\______/ |__/       \\_______/ \\______/ |__/  |__/ \\_______/ \\_______/|__/  \\__/
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                            
`;
export default function Terminal() {
  const [ascii, setAscii] = useState<string>("");

  useEffect(() => {
    figlet.parseFont("Standard", standard);
    figlet.text("SecureCheck", { font: "Standard" }, (_err, data) => {
      setAscii(data || "");
    });
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none vt323-regular">
      <div className="w-full max-w-4xl h-[500px] bg-black/90 border-2 border-green-500 rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.3)] backdrop-blur-sm pointer-events-auto">
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
        <div className="h-[calc(100%-100px)]  p-4 font-mono text-sm flex justify-center items-center">
          <div className="text-green-400 vt323-regular mt-10">
            <pre
              style={{
                fontFamily: "monospace",
                lineHeight: "1.4",
                color: "#2ecc71", // Secure Green
                backgroundColor: "transparent",
                userSelect: "none", // Makes it feel more like a logo
              }}
            >
              {SECURE_CHECK_LOGO}
            </pre>
            <div className="w-full flex justify-center items-center -mt-10 ">
              <button className="vt323-regular cursor-pointer bg-black text-green-500 font-mono py-2 px-6 border-2 border-green-500 shadow-[inset_0_0_0_2px_black,0_0_20px_rgba(34,197,94,0.5)] uppercase tracking-widest hover:bg-green-500 hover:text-black  transition-all duration-100 active:translate-y-1">
                Commencer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
