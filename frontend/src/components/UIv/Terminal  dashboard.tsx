//@ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { getAllLinks, addLink } from "@/API/Links";
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

// Add CSS animations with modern hacker aesthetic
const styles = `
  @keyframes typing {
    from { width: 0; }
    to { width: 100%; }
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  @keyframes glitch {
    0% {
      text-shadow: -3px 0 #00ff41, 3px 0 #ff006e;
      transform: translate(0);
    }
    20% {
      text-shadow: 3px 0 #00ff41, -3px 0 #ff006e;
      transform: translate(-2px, 2px);
    }
    40% {
      text-shadow: -3px 0 #00ff41, 3px 0 #ff006e;
      transform: translate(2px, -2px);
    }
    60% {
      text-shadow: 3px 0 #ff006e, -3px 0 #00ff41;
      transform: translate(-2px, 2px);
    }
    80% {
      text-shadow: -3px 0 #ff006e, 3px 0 #00ff41;
      transform: translate(2px, -2px);
    }
    100% {
      text-shadow: 3px 0 #00ff41, -3px 0 #ff006e;
      transform: translate(0);
    }
  }

  @keyframes glitchIntro {
    0% {
      opacity: 0;
      text-shadow: -3px 0 #00ff41, 3px 0 #ff006e;
      transform: translate(-10px, 0);
    }
    50% {
      text-shadow: 3px 0 #ff006e, -3px 0 #00ff41;
      transform: translate(5px, -5px);
    }
    100% {
      opacity: 1;
      text-shadow: 0 0 10px rgba(0, 255, 65, 0.8);
      transform: translate(0);
    }
  }

  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(10px); }
  }

  @keyframes scanlineMove {
    0% { top: -100%; }
    100% { top: 100%; }
  }

  @keyframes flicker {
    0%, 18%, 22%, 25%, 54%, 56%, 100% { opacity: 1; }
    19%, 24%, 55% { opacity: 0.8; }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0_0_20px_rgba(0, 255, 65, 0.5),
                  0_0_40px_rgba(0, 255, 65, 0.3),
                  inset_0_0_0_2px_rgba(0, 255, 65, 0.5);
    }
    50% {
      box-shadow: 0_0_40px_rgba(0, 255, 65, 0.8),
                  0_0_60px_rgba(0, 255, 65, 0.5),
                  inset_0_0_0_2px_rgba(0, 255, 65, 0.8);
    }
  }

  @keyframes buttonReveal {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes buttonHover {
    0%, 100% {
      transform: translateY(0) scale(1);
      box-shadow: 0_0_20px_rgba(0, 255, 65, 0.5), inset_0_0_0_2px_rgba(0, 255, 65, 0.5);
    }
    50% {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0_0_30px_rgba(0, 255, 65, 0.8), inset_0_0_0_2px_rgba(0, 255, 65, 0.8);
    }
  }

  @keyframes float-text {
    0% {
      transform: translateY(0px) scale(1);
      opacity: 0;
    }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% {
      transform: translateY(-50px) scale(0.8);
      opacity: 0;
    }
  }

  @keyframes terminalEnter {
    0% {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      filter: blur(10px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
      filter: blur(0);
    }
  }

  @keyframes contentFade {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes matrixRain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  .logo-glitch {
    animation: glitchIntro 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .terminal-glitch {
    animation: glitch 0.3s infinite;
  }

  .terminal-container {
    animation: terminalEnter 0.8s ease-out forwards;
  }

  .terminal-scanlines {
    position: relative;
  }

  .terminal-scanlines::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 65, 0.05),
      rgba(0, 255, 65, 0.05) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    animation: scanlines 8s linear infinite;
    z-index: 1;
  }

  .terminal-scanlines::after {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 255, 65, 0.1) 50%,
      transparent 100%
    );
    pointer-events: none;
    animation: scanlineMove 6s linear infinite;
  }

  .terminal-flicker {
    animation: flicker 3s infinite;
  }

  .button-glow {
    animation: pulse-glow 2.5s ease-in-out infinite;
  }

  .button-enter {

  }

  .button-hover-active:hover {
    transform:scale(1.1);
  }

  .float-text {
    animation: float-text 3s ease-in-out;
  }

  .content-fade {
    animation: contentFade 1s ease-out forwards;
  }

  /* Neon text glow effect */
  .neon-text {
    text-shadow: 0 0 10px rgba(0, 255, 65, 0.8),
                 0 0 20px rgba(0, 255, 65, 0.6),
                 0 0 30px rgba(0, 255, 65, 0.4);
    letter-spacing: 2px;
  }
`;
function Addlink() {
  const navigate = useNavigate();
  const [link, setlink] = useState("");
  const [error, setError] = useState(false); // New error state

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  const submit = () => {
    if (link && isValidUrl(link)) {
      setError(false);
      addLink(link)
        .then(() => {
          console.log("Link added successfully");
          navigate("/dashboard/link");
        })
        .catch((error) => {
          console.error("Error adding link:", error);
        });
      console.log("Valid URL");
    } else {
      setError(true);
      console.log("error");
    }
  };

  return (
    <div className="flex flex-col w-2/3 mb-64">
      {/* INPUT FIELD */}
      <input
        onChange={(e) => {
          setlink(e.target.value);
          if (error) setError(false); // Clear error when typing
        }}
        type="url"
        style={{
          color: "#00ff41",
          borderColor: error ? "#ff3131" : "#00ff41", // Turns red on error
          textShadow: "0 0 5px rgba(0, 255, 65, 0.5)",
        }}
        className="h-16 w-full mt-10 px-8 bg-black border-2 vt323-regular text-2xl focus:outline-none transition-all duration-300"
        placeholder="enter link"
      />

      {/* ERROR MESSAGE DIV */}
      {error && (
        <div
          style={{
            color: "#ff3131",
            textShadow: "0 0 10px rgba(255, 49, 49, 0.8)",
            borderColor: "#ff3131",
          }}
          className="mt-4 p-4 border-2 bg-black vt323-regular text-xl uppercase tracking-tighter animate-pulse"
        >
          {">"} SYSTEM_ERROR: INVALID_URL_FORMAT...
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={submit}
        style={{
          color: "#00ff41",
          borderColor: "#00ff41",
          textShadow: "0 0 10px rgba(0, 255, 65, 0.8)",
        }}
        className="h-16 mt-6 w-full bg-black px-8 border-2 uppercase tracking-widest vt323-regular text-2xl transition-all duration-300 active:translate-y-1 hover:bg-[#00ff41] hover:text-black"
      >
        Add Links
      </button>
    </div>
  );
}
interface Linkdata {
  id: number;
  url: string;
  score: number;
  done: boolean;
}
const AllLinks = () => {
  const [Links, setLinks] = useState<Linkdata[]>([]);
  useEffect(() => {
    getAllLinks()
      .then((data) => {
        setLinks(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  const displayLinks = Links;
  return (
    <div className="w-full mt-10 overflow-hidden">
      <table className="w-full border-collapse vt323-regular">
        <thead>
          <tr className="border-b-2 border-[#00ff41] text-[#00ff41] uppercase tracking-widest text-2xl">
            <th className="p-4 text-left font-normal">Link_Path</th>
            <th className="p-4 text-left font-normal">Score</th>
            <th className="p-4 text-center font-normal">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[#00ff41] text-xl">
          {displayLinks.map((link: Linkdata, index) => (
            <tr
              key={index}
              className="border-b border-[#00ff41]/30 hover:bg-[#00ff41]/5 transition-colors duration-200"
            >
              <td className="p-4 truncate max-w-xs md:max-w-md">
                <span className="opacity-70 mr-2">{">"}</span>
                {link.url}
              </td>
              <td
                className="p-4 font-bold"
                style={{ textShadow: "0 0 8px rgba(0, 255, 65, 0.6)" }}
              >
                {link.data ? link.data.security_score + "%" : "N/A"}
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-4">
                  {/* DOWNLOAD BUTTON */}
                  <button
                    disabled={!link.done}
                    className="disabled:opacity-50 px-3 py-1 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all duration-300 uppercase text-sm tracking-tighter"
                    onClick={() => console.log("Downloading...", link.id)}
                  >
                    [ DL ]
                  </button>

                  {/* DELETE BUTTON */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {displayLinks.length === 0 && (
        <div className="text-[#00ff41] p-10 text-center vt323-regular text-2xl animate-pulse">
          NO_DATA_FOUND_IN_DATABASE
        </div>
      )}
    </div>
  );
};
import useStore from "@/store/store";
export default function Terminal() {
  const store = useStore();
  const navigate = useNavigate();
  const [displayedLogo, setDisplayedLogo] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: number; text: string }[]
  >([]);

  useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Typing animation for logo
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= SECURE_CHECK_LOGO.length) {
        setDisplayedLogo(SECURE_CHECK_LOGO.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Show button after logo animation completes
        setTimeout(() => setShowButton(true), 300);
      }
    }, 10);

    return () => clearInterval(typingInterval);
  }, []);

  const handleButtonClick = () => {
    // Add floating text effect
    const newText = { id: Date.now(), text: "ACCESS GRANTED" };
    setFloatingTexts([...floatingTexts, newText]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newText.id));
    }, 3000);

    // Navigate after effect
    setTimeout(() => navigate("/login"), 500);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none vt323-regular">
        <div className="terminal-container terminal-scanlines w-full max-w-8xl h-full bg-black/90 border-2 border-green-500 rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.5)] backdrop-blur-sm pointer-events-auto relative overflow-hidden">
          {/* Floating particles background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400 rounded-full opacity-50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `matrixRain ${
                    2 + Math.random() * 3
                  }s ease-in infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-green-500/50 bg-green-500/10 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <div
                className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-green-400 text-sm vt323-regular neon-text">
              root@secure-terminal
            </span>
          </div>

          {/* Terminal Body */}
          <div className="h-[calc(100%-100px)] p-4 font-mono text-sm flex justify-center items-center relative z-10">
            <div className="text-green-400 vt323-regular mt-10">
              <pre
                className="logo-glitch"
                style={{
                  fontFamily: "monospace",
                  lineHeight: "1.4",
                  color: "#00ff41",
                  backgroundColor: "transparent",
                  userSelect: "none",
                  textShadow: "0 0 10px rgba(0, 255, 65, 0.8)",
                  minHeight: "200px",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {displayedLogo}
              </pre>

              {/* Floating text overlay */}
              {floatingTexts.map((text) => (
                <div
                  key={text.id}
                  className="float-text absolute left-1/2 bottom-20 text-green-400"
                  style={{
                    transform: "translateX(-50%)",
                    textShadow: "0 0 20px rgba(0, 255, 65, 0.8)",
                    fontSize: "14px",
                    fontWeight: "bold",
                    letterSpacing: "3px",
                  }}
                >
                  {text.text}
                </div>
              ))}

              <div className="w-full flex justify-center items-center  mt-8 ">
                <Routes>
                  <Route
                    index
                    element={
                      <>
                        {showButton ? (
                          <div className="flex flex-col w-2/3 mb-64 ">
                            <button
                              style={{
                                color: "#00ff41",
                                borderColor: "#00ff41",
                                backgroundColor: "transparent",
                                textShadow: "0 0 10px rgba(0, 255, 65, 0.8)",
                              }}
                              className="h-16 size-32 mt-10 w-full button-enter vt323-regular cursor-pointer bg-black  vt323-regular px-8 border-2  uppercase tracking-widest transition-all duration-300 active:translate-y-1 button-glow button-hover-active"
                              onClick={() => navigate("/dashboard/add")}
                            >
                              Add Links
                            </button>

                            <button
                              style={{
                                color: "#00ff41",
                                borderColor: "#00ff41",
                                backgroundColor: "transparent",
                                textShadow: "0 0 10px rgba(0, 255, 65, 0.8)",
                              }}
                              onClick={() => navigate("/dashboard/link")}
                              className="h-16 size-32 mt-10 w-full button-enter vt323-regular cursor-pointer bg-black  vt323-regular px-8 border-2  uppercase tracking-widest transition-all duration-300 active:translate-y-1 button-glow button-hover-active"
                            >
                              Links
                            </button>
                            <button
                              style={{
                                color: "#00ff41",
                                borderColor: "#00ff41",
                                backgroundColor: "transparent",
                                textShadow: "0 0 10px rgba(0, 255, 65, 0.8)",
                              }}
                              onClick={store.clearAuth}
                              className="h-16 size-32 mt-10 w-full button-enter vt323-regular cursor-pointer bg-black  vt323-regular px-8 border-2  uppercase tracking-widest transition-all duration-300 active:translate-y-1 button-glow button-hover-active"
                            >
                              Logout
                            </button>
                          </div>
                        ) : null}
                      </>
                    }
                  />
                  <Route
                    path="add/"
                    element={<>{showButton ? <Addlink /> : null}</>}
                  />
                  <Route
                    path="link/"
                    element={<>{showButton ? <AllLinks /> : null}</>}
                  />
                  <Route path="*" element={<Navigate to="/dashboard" />} />{" "}
                </Routes>
              </div>
            </div>
          </div>

          {/* Terminal Footer - Status bar */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 border-t border-green-500/50 bg-green-500/5 text-green-400/70 text-xs flex justify-between relative z-10">
            <span>STATUS: ONLINE</span>
            <span>SECURITY LEVEL: MAXIMUM</span>
          </div>
        </div>
      </div>
    </>
  );
}
