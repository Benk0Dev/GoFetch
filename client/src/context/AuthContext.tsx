import { createContext, useContext, useState, useEffect } from "react";
import { editUser, getUserByIdWithPictures } from "../services/Registry";
import { getUserId, clearUser, setUserId as storeUser } from "../utils/StorageManager";
import { login as performLogin } from "../services/Registry";
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
        const fetchedUser = await getUserByIdWithPictures(id);
        setUser(fetchedUser);
        setRole(fetchedUser.currentRole);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const loginUser = (user: any) => {
    setUser(user);
    setRole(user.currentRole);
  }

  const refreshUser = async () => {
    if (!user) return;
    setLoading(true);
    const fetchedUser = await getUserByIdWithPictures(user.userDetails.id);
    setUser(fetchedUser);
    setRole(fetchedUser.currentRole);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const returnedUser = await performLogin(email, password);
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
    if (!user) return;

    setLoading(true);

    if (user.roles.length === 1) {
      await editUser(user.userDetails.id, { roles: [Role.MINDER, Role.OWNER] });
      setUser((prev: any) => ({
        ...prev,
        roles: [Role.MINDER, Role.OWNER]
      }));
    }
  
    const newRole = role === Role.MINDER ? Role.OWNER : Role.MINDER;
    setRole(newRole);
    setUser((prev: any) => ({
      ...prev,
      currentRole: newRole
    }));
  
    await editUser(user.userDetails.id, { currentRole: newRole });
    setLoading(false);
  };
  

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshUser, setUser, setRole, loginUser, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
