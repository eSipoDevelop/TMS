// src/AuthContext.jsx
import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { email, rol, token }

  async function login(email, password) {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }
      const data = await response.json();
      setUser({
        email: data.user.email,
        rol: data.user.rol,
        token: data.token
      });
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }

  function logout() {
    setUser(null);
    navigate("/login");
  }

  const isAuthenticated = !!user?.token;
  const rol = user?.rol || "invitado";

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
