import { setLogged, store } from 'store';

export const Logged = {
  set(isLogged: boolean) {
    store.dispatch(setLogged({ isLogged: isLogged }));
  }
};
