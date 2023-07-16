import { ReactNode, createContext, useState } from 'react';

export type AuthContextProps = {
  signIn: (_logingUser: string, _password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
  isLogged: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextProps);

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
        sessionStorage.setItem('token', 'Bearer ' + token);
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
