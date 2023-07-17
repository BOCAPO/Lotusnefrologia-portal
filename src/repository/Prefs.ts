const PrefKeys = {
  token: 'token',
  login: 'login',
  password: 'password'
};

export const Prefs = {
  setToken(valor: string) {
    set(PrefKeys.token, valor);
  },
  getToken() {
    return get(PrefKeys.token);
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
