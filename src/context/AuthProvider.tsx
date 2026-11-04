"use client";
import { createContext, useContext, useState } from "react";

export interface AuthContextType {
  joined: Record<string, boolean>;
  setJoined: (
    value:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>),
  ) => void;
}

export const AuthContext = createContext<AuthContextType>({
  joined: {},
  setJoined: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const sharedData: AuthContextType = {
    joined,
    setJoined,
  };

  return (
    <AuthContext.Provider value={sharedData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
