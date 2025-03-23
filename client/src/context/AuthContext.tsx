import { createContext, useContext, useState, useEffect } from "react";
import { editUser, getUserById } from "../services/Registry";
import { getUserId, clearUser, setUserId as storeUser } from "../utils/StorageManager";
import { login as loginUser } from "../services/Registry";
import { Role } from "../models/IUser";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const id = getUserId();
      if (id) {
        const fetchedUser = await getUserById(id);
        setUser(fetchedUser);
        setRole(fetchedUser.currentRole);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const returnedUser = await loginUser(email, password);
    if (returnedUser) {
      storeUser(returnedUser.userDetails.id);
      setUser(returnedUser);
      setRole(returnedUser.currentRole);
      setLoading(false);
      return true;
    } else {
      setLoading(false);
      return false;
    }
  };
  

  const logout = () => {
    clearUser();
    setUser(null);
    setRole(null);
  };

  const switchRole = async () => {
    if (!user || user.roles.length === 1) return;
  
    const newRole = role === Role.MINDER ? Role.OWNER : Role.MINDER;
    setLoading(true);
    setRole(newRole);
    setUser((prev: any) => ({
      ...prev,
      currentRole: newRole
    }));
  
    await editUser(user.userDetails.id, { currentRole: newRole });
    setLoading(false);
  };
  

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, setRole, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
