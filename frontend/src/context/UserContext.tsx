// src/context/UserContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  height: string;
  weight: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("useUser must be used within UserProvider");
  return context;
};
