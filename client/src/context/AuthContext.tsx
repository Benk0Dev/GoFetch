import { createContext, useContext, useState, useEffect } from "react";
import { editUser, getUserByIdWithPictures, login as performLogin } from "@client/services/UserRegistry";
import { getUserId, clearUser, setUserId as storeUser } from "@client/utils/StorageManager";
import { Role } from "@gofetch/models/IUser";

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

  const loginUser = async (userId: number) => {
    setLoading(true);
    const fetchedUser = await getUserByIdWithPictures(userId);
    setUser(fetchedUser);
    setRole(fetchedUser.currentRole);
    setLoading(false);
  }

  const refreshUser = async () => {
    if (!user) return;
    setLoading(true);
    const fetchedUser = await getUserByIdWithPictures(user.id);
    setUser(fetchedUser);
    setRole(fetchedUser.currentRole);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const returnedUser = await performLogin(email, password);
    if (returnedUser) {
      storeUser(returnedUser.id);
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
      await editUser(user.id, { roles: [Role.MINDER, Role.OWNER] });
    }
  
    const newRole = role === Role.MINDER ? Role.OWNER : Role.MINDER;
    setRole(newRole);
    await editUser(user.id, { currentRole: newRole });

    await refreshUser();
    setLoading(false);
  };
  

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshUser, setUser, setRole, loginUser, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
