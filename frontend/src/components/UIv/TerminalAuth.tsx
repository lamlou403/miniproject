import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// CSS animations with hacker aesthetic
const styles = `
  @keyframes glitchAuth {
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

  @keyframes titleGlow {
    0%, 100% { 
      text-shadow: 0 0 10px rgba(0, 255, 65, 0.8),
                   0 0 20px rgba(0, 255, 65, 0.6);
    }
    50% { 
      text-shadow: 0 0 20px rgba(0, 255, 65, 1),
                   0 0 40px rgba(0, 255, 65, 0.8);
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

  @keyframes formSlideIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes inputFocus {
    0%, 100% {
      box-shadow: 0 0 5px rgba(0, 255, 65, 0.5),
                  inset 0 0 5px rgba(0, 255, 65, 0.1);
    }
    50% {
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.8),
                  inset 0 0 10px rgba(0, 255, 65, 0.2);
    }
  }

  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 0_0_20px_rgba(0, 255, 65, 0.5), 
                  inset_0_0_0_2px_rgba(0, 255, 65, 0.5); 
    }
    50% { 
      box-shadow: 0_0_40px_rgba(0, 255, 65, 0.8), 
                  inset_0_0_0_2px_rgba(0, 255, 65, 0.8); 
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

  @keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  @keyframes matrixRain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  .title-glow {
    animation: titleGlow 2s ease-in-out infinite;
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

  .form-slide-in {
    animation: formSlideIn 0.8s ease-out forwards;
    opacity: 0;
  }

  .form-input {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(0, 255, 65, 0.5);
    color: #00ff41;
    padding: 10px 12px;
    font-family: monospace;
    font-size: 14px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    animation: inputFocus 1s ease-in-out infinite;
  }

  .form-input::placeholder {
    color: rgba(0, 255, 65, 0.4);
  }

  .button-glow {
    animation: pulse-glow 2.5s ease-in-out infinite;
  }

  .button-hover-active:hover {
    animation: buttonHover 0.6s ease-in-out infinite !important;
  }

  .error-message {
    animation: errorShake 0.5s ease-in-out;
  }

  .neon-text {
    text-shadow: 0 0 10px rgba(0, 255, 65, 0.8),
                 0 0 20px rgba(0, 255, 65, 0.6),
                 0 0 30px rgba(0, 255, 65, 0.4);
    letter-spacing: 2px;
  }

  .input-group {
    margin-bottom: 16px;
  }

  .input-label {
    display: block;
    font-size: 12px;
    color: #00ff41;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }
`;
import { login, signin } from "@/API/Auth";
import useStore from "@/store/store";
export default function TerminalAuth({ isLoginx }: { isLoginx: boolean }) {
  const store = useStore();
  const [isLogin, setIsLogin] = useState(isLoginx);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Add styles to document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Focus on username input
    inputRef.current?.focus();

    return () => {
      styleSheet.remove();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // Validation for login
      if (!email.trim()) {
        setError("Username required");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Invalid email format");
        return;
      }
      if (!password) {
        setError("Password required");
        return;
      }

      setIsLoading(true);
      try {
        const x = await login(email, password);
        console.log(x);
        store.setAccessToken(x.token);
        store.setUser(x.user);
        setIsLoading(false);
      } catch (e) {
        setError("Invalid credentials");
        setPassword("");
        setIsLoading(false);
      }
      // Simulate authentication
    } else {
      // Validation for signup
      if (!prenom.trim()) {
        setError("Prenom required");
        return;
      }
      if (!nom.trim()) {
        setError("Nom required");
        return;
      }
      if (!email.trim()) {
        setError("Email required");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Invalid email format");
        return;
      }
      if (!password) {
        setError("Password required");
        return;
      }
      if (!dateNaissance) {
        setError("Date of birth required");
        return;
      }

      setIsLoading(true);
      try {
        const x = await signin(nom, prenom, dateNaissance, email, password);
        setError("");
        setPrenom("");
        setNom("");
        setEmail("");
        setPassword("");
        setDateNaissance("");
        setIsLogin(true);
        setIsLoading(false);
      } catch (e) {
        setError("Error");
      }
    }
  };

  const toggleForm = () => {
    setError("");
    setUsername("");
    setPassword("");
    setEmail("");
    setPrenom("");
    setNom("");
    setDateNaissance("");
    if (isLogin) {
      navigate("/create");
      setIsLogin(false);
    } else {
      navigate("/login");
      setIsLogin(true);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none vt323-regular">
        <div className="terminal-container terminal-scanlines w-full max-w-2xl h-auto bg-black/90 border-2 border-green-500 rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.5)] backdrop-blur-sm pointer-events-auto relative overflow-hidden py-8 px-8">
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
          <div className="relative z-10 mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-500/50">
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
                auth@secure-system
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-green-400 title-glow mb-2">
                [{isLogin ? "SECURE LOGIN" : "CREATE ACCOUNT"}]
              </h1>
              <p className="text-green-500/70 text-xs tracking-widest">
                {isLogin ? "AUTHENTICATION REQUIRED" : "REGISTER NEW ACCOUNT"}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-4 mb-8 justify-center">
              <button
                type="button"
                onClick={() => isLogin || toggleForm()}
                className={`px-6 py-2 font-mono text-sm uppercase tracking-widest border-2 rounded transition-all ${
                  isLogin
                    ? "border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                    : "border-green-500/30 text-green-500/50 bg-transparent hover:border-green-500/50"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => !isLogin || toggleForm()}
                className={`px-6 py-2 font-mono text-sm uppercase tracking-widest border-2 rounded transition-all ${
                  !isLogin
                    ? "border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                    : "border-green-500/30 text-green-500/50 bg-transparent hover:border-green-500/50"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 max-w-sm mx-auto form-slide-in"
          >
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 border border-red-500/50 bg-red-500/10 rounded error-message">
                <p className="text-red-400 text-sm font-mono">❌ {error}</p>
              </div>
            )}

            {/* LOGIN FORM */}
            {isLogin ? (
              <>
                {/* Username Input */}
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="form-input w-full"
                    placeholder="Enter username..."
                  />
                </div>

                {/* Password Input */}
                <div className="input-group">
                  <label className="input-label">PassWord</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="form-input w-full"
                    placeholder="Enter password..."
                  />
                </div>
              </>
            ) : (
              <>
                {/* SIGNUP FORM */}
                {/* Prenom Input */}
                <div className="input-group">
                  <label className="input-label">Prenom</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    disabled={isLoading}
                    className="form-input w-full"
                    placeholder="Enter first name..."
                  />
                </div>

                {/* Nom Input */}
                <div className="input-group">
                  <label className="input-label">Nom</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    disabled={isLoading}
                    className="form-input w-full"
                    placeholder="Enter last name..."
                  />
                </div>

                {/* Email Input */}
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="form-input w-full"
                    placeholder="Enter email..."
                  />
                </div>

                {/* Password Input */}
                <div className="input-group">
                  <label className="input-label">PassWord</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="form-input w-full"
                    placeholder="Enter password..."
                  />
                </div>

                {/* Date of Birth Input */}
                <div className="input-group">
                  <label className="input-label">Date De Naissance</label>
                  <input
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                    disabled={isLoading}
                    className="form-input w-full"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full vt323-regular cursor-pointer bg-black text-green-400 font-mono py-3 px-6 border-2 border-green-500 uppercase tracking-widest transition-all duration-300 active:translate-y-1 button-glow button-hover-active disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span className="relative z-10">
                {isLoading
                  ? isLogin
                    ? "Authenticating..."
                    : "Creating..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 hover:opacity-20"
                style={{
                  transition: "opacity 0.3s",
                }}
              />
            </button>

            {/* Demo Credentials Hint */}
            <div className="mt-6 pt-6 border-t border-green-500/30"></div>
          </form>

          {/* Terminal Footer - Status bar */}
          <div className="absolute bottom-0 left-0 right-0 px-8 py-3 border-t border-green-500/50 bg-green-500/5 text-green-400/70 text-xs flex justify-between relative z-10">
            <span>SYSTEM: ONLINE</span>
            <span>PROTOCOL: SECURE</span>
          </div>
        </div>
      </div>
    </>
  );
}
