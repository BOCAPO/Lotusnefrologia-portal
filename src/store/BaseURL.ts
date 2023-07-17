import { setBaseUrl, store } from 'store';

export const BaseURL = {
  set(baseURL: string | null) {
    store.dispatch(setBaseUrl({ baseURL: baseURL }));
  }
};
