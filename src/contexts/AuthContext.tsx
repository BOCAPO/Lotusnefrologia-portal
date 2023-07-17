import React, { ReactNode, useState } from 'react';

import { Prefs } from 'repository/Prefs';
import { login } from 'services/logins';

export type AuthContextProps = {
  signIn: (_logingUser: string, _password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  isLogged: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = React.createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  async function signIn(logingUser: string, password: string) {
    try {
      setIsLoading(true);

      const { data } = await login(logingUser, password);
      const response = data;

      if (response != null) {
        const token = response.Token as string;
        Prefs.setToken(token);
      }
    } finally {
      setIsLoading(false);
    }
  }
  function signOut() {
    setIsLogged(false);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isLoading, isLogged }}>
      {children}
    </AuthContext.Provider>
  );
}
