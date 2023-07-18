const PrefKeys = {
  token: 'token',
  login: 'login',
  password: 'password',
  nameUser: 'nameUser'
};

export const Prefs = {
  setToken(valor: string) {
    set(PrefKeys.token, valor);
  },
  setNameUser(valor: string) {
    set(PrefKeys.nameUser, valor);
  },
  getToken() {
    return get(PrefKeys.token);
  },
  getNameUser() {
    return get(PrefKeys.nameUser);
  }
};

async function set(chave: string, valor: string) {
  try {
    return localStorage.setItem(chave, valor);
  } catch (e) {
    return String(e);
  }
}

async function get(chave: string) {
  try {
    return localStorage.getItem(chave);
  } catch (e) {
    return String(e);
  }
}
