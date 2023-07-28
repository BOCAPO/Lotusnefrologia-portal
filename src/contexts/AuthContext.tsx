'use client';

import React, { ReactNode, useState } from 'react';

import { ResponseUserModel } from 'models/ResponseUserModel';
import { UserModel } from 'models/UserModel';
import { Prefs } from 'repository/Prefs';
import { login } from 'services/login';

export type AuthContextDataProps = {
  signIn: (
    _loginUser: string,
    _password: string
  ) => Promise<string | undefined>;
  signOut: () => void;
  isLoading: boolean;
  isLogged: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = React.createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  let responseOK = {} as ResponseUserModel;
  async function signIn(
    loginUser: string,
    password: string
  ): Promise<string | undefined> {
    try {
      setIsLoading(true);
      const response = await login(loginUser, password);

      if (response !== undefined) {
        responseOK = response.data as ResponseUserModel;
        const token = responseOK.token as string;
        const usuario = responseOK.usuario as UserModel;
        if (token != null) {
          Prefs.setToken(token);
          Prefs.setNameUser(usuario.name.toString());
          setIsLogged(true);
        }
        return token;
      } else {
        return undefined;
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
