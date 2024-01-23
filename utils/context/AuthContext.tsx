import { createContext } from "react";
import { User } from "../types";

type AuthContextType = {
  user?: User;
  updateUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType>({
  updateUser: () => ({}),
});
