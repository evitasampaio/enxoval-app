import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import AuthScreen from "./AuthScreen";
import EnxovalApp from "./EnxovalApp";

export default function AppWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div style={{
        background: "#131917", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          fontFamily: "DM Mono, monospace", fontSize: 10,
          color: "#3D5A4A", letterSpacing: 2, textTransform: "uppercase"
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return <EnxovalApp user={user} onLogout={handleLogout} />;
}