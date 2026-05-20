import { useState } from "react";
import { supabase } from "./supabase";

const DARK = {
  bg: "#131917", bgCard: "#1A2420", ink: "#E8F5EF",
  inkL: "#C8DDD5", inkLL: "#5A7A6A", ghost: "#2D4438",
  border: "#1E2B25", amber: "#F0C060",
};
const mono = { fontFamily: "'DM Mono','Courier New',monospace" };
const serif = { fontFamily: "'Fraunces','Georgia',serif" };

export default function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError(""); setSuccess(""); setLoading(true);

    if (!email || !password) {
      setError("Preencha email e senha."); setLoading(false); return;
    }
    if (password.length < 6) {
      setError("Senha precisa ter ao menos 6 caracteres."); setLoading(false); return;
    }

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (err) { setError(err.message); setLoading(false); return; }
      setSuccess("Conta criada! Verifique seu email para confirmar.");
    } else {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError("Email ou senha incorretos."); setLoading(false); return; }
      onLogin(data.user);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    background: DARK.bgCard, border: `1px solid ${DARK.border}`,
    borderRadius: 4, color: DARK.ink, outline: "none",
    boxSizing: "border-box", fontSize: 14,
    ...mono, marginBottom: 10,
  };

  return (
    <div style={{
      background: DARK.bg, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "DM Mono, monospace"
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ ...serif, fontSize: 36, color: "#5ECBA0", fontStyle: "italic", fontWeight: 300 }}>
            Enxoval
          </div>
          <div style={{ ...mono, fontSize: 9, color: DARK.inkLL, letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>
            Setembro · São Paulo
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: DARK.bgCard, border: `1px solid ${DARK.border}`,
          borderRadius: 8, padding: "24px 22px"
        }}>
          {/* Toggle */}
          <div style={{
            display: "flex", marginBottom: 22,
            border: `1px solid ${DARK.border}`, borderRadius: 4, overflow: "hidden"
          }}>
            {[["login", "Entrar"], ["signup", "Criar conta"]].map(([id, lbl]) => (
              <button key={id} onClick={() => { setMode(id); setError(""); setSuccess(""); }} style={{
                flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
                background: mode === id ? "#5ECBA0" : "transparent",
                color: mode === id ? "#111" : DARK.inkLL,
                ...mono, fontSize: 9, letterSpacing: 1, textTransform: "uppercase",
                fontWeight: mode === id ? 700 : 400, transition: "all .15s"
              }}>{lbl}</button>
            ))}
          </div>

          {/* Fields */}
          {mode === "signup" && (
            <input
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ ...inputStyle, marginBottom: 16 }}
          />

          {/* Error / Success */}
          {error && (
            <div style={{
              ...mono, fontSize: 10, color: "#F07070",
              background: "#2A1818", border: "1px solid #F0707033",
              borderRadius: 3, padding: "8px 10px", marginBottom: 12
            }}>{error}</div>
          )}
          {success && (
            <div style={{
              ...mono, fontSize: 10, color: "#5ECBA0",
              background: "#0A2018", border: "1px solid #5ECBA033",
              borderRadius: 3, padding: "8px 10px", marginBottom: 12
            }}>{success}</div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", padding: "12px",
            background: loading ? DARK.ghost : "#5ECBA0",
            color: "#111", border: "none", borderRadius: 4,
            ...mono, fontSize: 10, letterSpacing: 1.2,
            textTransform: "uppercase", fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all .2s"
          }}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </div>

        <div style={{ ...mono, fontSize: 8, color: DARK.ghost, textAlign: "center", marginTop: 16, letterSpacing: .5 }}>
          Seus dados ficam salvos na nuvem e sincronizam entre dispositivos
        </div>
      </div>
    </div>
  );
}