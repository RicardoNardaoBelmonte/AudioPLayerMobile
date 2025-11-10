import React, { createContext, useState, useEffect, ReactNode } from "react"; 
import { AuthContextType, AuthProviderProps } from "../../../apiMusics/interfaces";

export const AuthContext = createContext<AuthContextType>({
  token: null,
  nome: "",
  setToken: () => {},
  setNome: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [nome, setNome] = useState<string>(localStorage.getItem("nome") || "");

  // Sincroniza token e nome se houver alterações no localStorage
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
      setNome(localStorage.getItem("nome") || "");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, nome, setToken, setNome }}>
      {children}
    </AuthContext.Provider>
  );
};
