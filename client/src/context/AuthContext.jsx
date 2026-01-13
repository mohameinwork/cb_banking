import { createContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  setLoading: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
