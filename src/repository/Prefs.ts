const PrefKeys = {
  token: 'token',
  login: 'login',
  password: 'password',
  nameUser: 'nameUser',
  idUser: 'idUser',
  units: 'units'
};

export const Prefs = {
  setToken(valor: string) {
    set(PrefKeys.token, valor);
  },
  setNameUser(valor: string) {
    set(PrefKeys.nameUser, valor);
  },
  setIdUser(valor: string) {
    set(PrefKeys.idUser, valor);
  },
  setUnits(valor: string) {
    set(PrefKeys.units, valor);
  },
  getToken() {
    return get(PrefKeys.token);
  },
  getNameUser() {
    return get(PrefKeys.nameUser);
  },
  getIdUser() {
    return get(PrefKeys.idUser);
  },
  getUnits() {
    return get(PrefKeys.units);
  },
  clear() {
    localStorage.clear();
    sessionStorage.clear();
  }
};

function set(chave: string, valor: string) {
  try {
    return localStorage.setItem(chave, valor);
  } catch (e) {
    return String(e);
  }
}

function get(chave: string) {
  try {
    return localStorage.getItem(chave);
  } catch (e) {
    return String(e);
  }
}
